/**
 * Minimal type declarations for node-forge.
 * Only covers the APIs used by CertificateManager.ts.
 * Replaces the heavyweight @types/node-forge package to speed up TS autocompletion.
 */
declare module 'node-forge' {
	namespace pki {
		interface Certificate {
			publicKey: rsa.PublicKey;
			serialNumber: string;
			validity: {
				notBefore: Date;
				notAfter: Date;
			};
			setSubject(attrs: CertificateAttribute[]): void;
			setIssuer(attrs: CertificateAttribute[]): void;
			setExtensions(extensions: CertificateExtension[]): void;
			sign(key: rsa.PrivateKey, md: md.MessageDigest): void;
		}

		interface CertificateAttribute {
			name?: string;
			shortName?: string;
			value: string;
		}

		interface CertificateExtension {
			name: string;
			cA?: boolean;
			keyCertSign?: boolean;
			digitalSignature?: boolean;
			nonRepudiation?: boolean;
			keyEncipherment?: boolean;
			dataEncipherment?: boolean;
			serverAuth?: boolean;
			clientAuth?: boolean;
			altNames?: { type: number; value?: string; ip?: string }[];
		}

		function createCertificate(): Certificate;
		function certificateFromPem(pem: string): Certificate;
		function certificateToPem(cert: Certificate): string;
		function certificateToAsn1(cert: Certificate): asn1.Asn1;
		function privateKeyToPem(key: rsa.PrivateKey): string;

		namespace rsa {
			interface PublicKey {}
			interface PrivateKey {}
			interface KeyPair {
				publicKey: PublicKey;
				privateKey: PrivateKey;
			}
			function generateKeyPair(bits: number): KeyPair;
		}
	}

	namespace asn1 {
		interface Asn1 {}
		function toDer(asn1: Asn1): { getBytes(): string };
	}

	namespace md {
		interface MessageDigest {
			update(data: string): void;
			digest(): { toHex(): string };
		}
		namespace sha256 {
			function create(): MessageDigest;
		}
	}
}
