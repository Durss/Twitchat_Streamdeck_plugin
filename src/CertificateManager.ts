import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import streamDeck from '@elgato/streamdeck';

/**
 * Manages SSL/TLS certificates for WSS connections
 * Generates self-signed certificates on first run and persists them
 */
export default class CertificateManager {
	private static _instance: CertificateManager;
	private _certPath: string;
	private _keyPath: string;
	private _cert: string | null = null;
	private _key: string | null = null;

	private constructor() {
		// Get the appropriate user data directory based on OS
		const dataPath = this.getUserDataPath();
		this._certPath = path.join(dataPath, 'twitchat-cert.pem');
		this._keyPath = path.join(dataPath, 'twitchat-key.pem');

		streamDeck.logger.info(`[CertificateManager] Certificate storage path: ${dataPath}`);
	}

	/********************
	 * GETTER / SETTERS *
	 ********************/
	static get instance(): CertificateManager {
		if (!CertificateManager._instance) {
			CertificateManager._instance = new CertificateManager();
		}
		return CertificateManager._instance;
	}

	/******************
	 * PUBLIC METHODS *
	 ******************/

	/**
	 * Gets the certificate and key, generating them if they don't exist
	 * @returns Object containing cert and key in PEM format
	 */
	public getCertificates(): { cert: string; key: string } {
		// If we already have them in memory, return them
		if (this._cert && this._key) {
			return { cert: this._cert, key: this._key };
		}

		// Try to load from disk
		if (this.loadCertificatesFromDisk()) {
			return { cert: this._cert!, key: this._key! };
		}

		// Generate new certificates if none exist
		streamDeck.logger.info('[CertificateManager] Generating new self-signed certificate...');
		this.generateCertificates();
		return { cert: this._cert!, key: this._key! };
	}

	/**
	 * Regenerates the certificates (useful if user wants to refresh)
	 */
	public regenerateCertificates(): { cert: string; key: string } {
		streamDeck.logger.info('[CertificateManager] Regenerating certificates...');
		this.generateCertificates();
		return { cert: this._cert!, key: this._key! };
	}

	/**
	 * Gets the certificate fingerprint for display to user
	 */
	public getCertificateFingerprint(): string {
		if (!this._cert) {
			this.getCertificates();
		}

		try {
			const cert = forge.pki.certificateFromPem(this._cert!);
			const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
			const md = forge.md.sha256.create();
			md.update(der);
			return md.digest().toHex().toUpperCase().match(/.{2}/g)!.join(':');
		} catch (error) {
			streamDeck.logger.error('[CertificateManager] Failed to get fingerprint:', error);
			return 'N/A';
		}
	}

	/*******************
	 * PRIVATE METHODS *
	 *******************/

	/**
	 * Generates a new self-signed certificate
	 */
	private generateCertificates(): void {
		try {
			// Generate a keypair
			streamDeck.logger.info('[CertificateManager] Generating RSA keypair...');
			const keys = forge.pki.rsa.generateKeyPair(2048);

			// Create a certificate
			const cert = forge.pki.createCertificate();
			cert.publicKey = keys.publicKey;
			cert.serialNumber = '01' + Date.now().toString(16);
			cert.validity.notBefore = new Date();
			cert.validity.notAfter = new Date();
			cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

			// Set certificate attributes
			const attrs = [
				{
					name: 'commonName',
					value: 'localhost',
				},
				{
					name: 'organizationName',
					value: 'Twitchat Stream Deck Plugin',
				},
				{
					shortName: 'OU',
					value: 'WebSocket Server',
				},
				{
					name: 'countryName',
					value: 'US',
				},
			];

			cert.setSubject(attrs);
			cert.setIssuer(attrs); // Self-signed, so issuer = subject

			// Add extensions for localhost
			cert.setExtensions([
				{
					name: 'basicConstraints',
					cA: true,
				},
				{
					name: 'keyUsage',
					keyCertSign: true,
					digitalSignature: true,
					nonRepudiation: true,
					keyEncipherment: true,
					dataEncipherment: true,
				},
				{
					name: 'extKeyUsage',
					serverAuth: true,
					clientAuth: true,
				},
				{
					name: 'subjectAltName',
					altNames: [
						{
							type: 2, // DNS
							value: 'localhost',
						},
						{
							type: 7, // IP
							ip: '127.0.0.1',
						},
						{
							type: 7, // IP
							ip: '::1',
						},
					],
				},
			]);

			// Self-sign certificate
			cert.sign(keys.privateKey, forge.md.sha256.create());

			// Convert to PEM format
			this._cert = forge.pki.certificateToPem(cert);
			this._key = forge.pki.privateKeyToPem(keys.privateKey);

			// Save to disk
			this.saveCertificatesToDisk();

			streamDeck.logger.info('[CertificateManager] Certificate generated successfully');
			streamDeck.logger.info(`[CertificateManager] Fingerprint: ${this.getCertificateFingerprint()}`);
		} catch (error) {
			streamDeck.logger.error('[CertificateManager] Failed to generate certificate:', error);
			throw error;
		}
	}

	/**
	 * Loads certificates from disk if they exist
	 * @returns true if loaded successfully, false otherwise
	 */
	private loadCertificatesFromDisk(): boolean {
		try {
			if (fs.existsSync(this._certPath) && fs.existsSync(this._keyPath)) {
				this._cert = fs.readFileSync(this._certPath, 'utf8');
				this._key = fs.readFileSync(this._keyPath, 'utf8');
				streamDeck.logger.info('[CertificateManager] Loaded existing certificates from disk');
				return true;
			}
		} catch (error) {
			streamDeck.logger.error('[CertificateManager] Failed to load certificates from disk:', error);
		}
		return false;
	}

	/**
	 * Saves certificates to disk
	 */
	private saveCertificatesToDisk(): void {
		try {
			// Ensure directory exists
			const dir = path.dirname(this._certPath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			fs.writeFileSync(this._certPath, this._cert!, { mode: 0o600 });
			fs.writeFileSync(this._keyPath, this._key!, { mode: 0o600 });
			streamDeck.logger.info('[CertificateManager] Certificates saved to disk');
		} catch (error) {
			streamDeck.logger.error('[CertificateManager] Failed to save certificates to disk:', error);
		}
	}

	/**
	 * Gets the appropriate user data directory based on the OS
	 */
	private getUserDataPath(): string {
		const appName = 'TwitchatStreamDeck';
		const platform = os.platform();
		const homeDir = os.homedir();

		let dataPath: string;

		switch (platform) {
			case 'win32':
				// Windows: %LOCALAPPDATA%\TwitchatStreamDeck
				// eslint-disable-next-line no-undef
				dataPath = path.join(process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local'), appName);
				break;
			case 'darwin':
				// macOS: ~/Library/Application Support/TwitchatStreamDeck
				dataPath = path.join(homeDir, 'Library', 'Application Support', appName);
				break;
			default:
				// Linux: ~/.config/twitchat-streamdeck
				dataPath = path.join(homeDir, '.config', 'twitchat-streamdeck');
				break;
		}

		return dataPath;
	}
}
