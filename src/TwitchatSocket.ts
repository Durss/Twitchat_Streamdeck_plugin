import streamDeck from '@elgato/streamdeck';
import WebSocket, { WebSocketServer } from 'ws';
import { setTimeout } from 'timers';
import https from 'https';
import CertificateManager from './CertificateManager';
import { TwitchatEventMap } from './TwitchatEventMap';
/**
 * Created : 26/02/2025
 */
export default class TwitchatSocket {
	private static _instance: TwitchatSocket;
	private _socketServer: WebSocketServer | null = null;
	private _socketServerSSL: WebSocketServer | null = null;
	private _httpServerSSL: https.Server | null = null;
	private _connexions: { type: 'main' | 'other'; ws: WebSocket }[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _callbacks: Map<string, (data: any) => void> = new Map();

	constructor() {}

	/********************
	 * GETTER / SETTERS *
	 ********************/
	static get instance(): TwitchatSocket {
		if (!TwitchatSocket._instance) {
			TwitchatSocket._instance = new TwitchatSocket();
		}
		return TwitchatSocket._instance;
	}

	/******************
	 * PUBLIC METHODS *
	 ******************/
	public async broadcast<Event extends keyof TwitchatEventMap>(
		action: Event,
		...args: TwitchatEventMap[Event] extends undefined
			? [ws?: WebSocket, attempts?: number]
			: [data: TwitchatEventMap[Event], ws?: WebSocket, attempts?: number]
	): Promise<void> {
		const [data, ws, attempts = 0] =
			args.length && typeof args[0] === 'object'
				? [args[0] as TwitchatEventMap[Event], args[1] as WebSocket, args[2] ?? 0]
				: [undefined, args[0] as WebSocket, args[1] as number];

		if (this._connexions.length === 0 && !ws) {
			if (attempts >= 30) return;
			//Wait for a connexion and retry
			setTimeout(() => {
				// @ts-expect-error couldn't find a way to make ts happy here
				this.broadcast(action, data, ws, attempts + 1);
			}, 1000);
			return;
		}
		const json = JSON.stringify({ action, data });
		if (ws) {
			ws.send(json);
		} else {
			this._connexions.forEach((client) => {
				client.ws.send(json);
			});
		}
	}

	/**
	 * Request for information to Twitchat
	 * @param action
	 * @param data
	 * @returns
	 */
	public subscribe<Data = unknown>(action: keyof TwitchatEventMap, resultEvent: keyof TwitchatEventMap, callback: (data: Data) => void): void {
		this._callbacks.set(resultEvent, (data: Data) => {
			callback(data);
		});
		// @ts-expect-error i'm too lazy to strongly type this for now
		this.broadcast(action);
	}

	/**
	 * Unsubscribe from all events
	 */
	public unsubscribeAll(): void {
		this._callbacks.clear();
	}

	/**
	 * Initialize the WebSocket servers
	 */
	public initialize(): void {
		// Unsecured WS server for localhost connections (no certificate needed)
		streamDeck.logger.info('[TwitchatSocket] Starting WS server on port 30385...');
		this._socketServer = new WebSocketServer({ port: 30385 });

		this._socketServer.on('connection', (ws, req) => {
			streamDeck.logger.info(`[TwitchatSocket] WS connection from ${req.socket.remoteAddress}`);
			this.handleConnection(ws);
		});

		this._socketServer.on('error', (error) => {
			streamDeck.logger.error('[TwitchatSocket] WS server error:', error);
		});

		this._socketServer.on('listening', () => {
			streamDeck.logger.info('[TwitchatSocket] WS server listening on ws://localhost:30385');
		});

		// Secured socket server for remote connections
		const certManager = CertificateManager.instance;
		const { cert, key } = certManager.getCertificates();

		streamDeck.logger.info('[TwitchatSocket] Starting HTTPS/WSS server on port 30386...');
		streamDeck.logger.info(`[TwitchatSocket] Certificate fingerprint: ${certManager.getCertificateFingerprint()}`);

		this._httpServerSSL = https.createServer(
			{
				cert,
				key,
			},
			(req, res) => {
				streamDeck.logger.info(`[TwitchatSocket] HTTPS request: ${req.method} ${req.url}`);
				res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
				const html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Twitchat Stream Deck Plugin</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						max-width: 800px;
						margin: 50px auto;
						padding: 20px;
						background-color: #f5f5f5;
					}
					.container {
						background-color: white;
						padding: 30px;
						border-radius: 8px;
						box-shadow: 0 2px 4px rgba(0,0,0,0.1);
					}
					h1 {
						color: #333;
					}
					.status {
						color: #28a745;
						font-weight: bold;
					}
					.info {
						margin: 20px 0;
						padding: 15px;
						background-color: #e9ecef;
						border-radius: 4px;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1 class="status">✓ Connection to Stream Deck plugin allowed</h1>
					<p class="info">You can close this page</p>
				</div>
			</body>
			</html>
			`;
				res.end(html);
			},
		);

		this._socketServerSSL = new WebSocketServer({ server: this._httpServerSSL });

		this._socketServerSSL.on('connection', (ws, req) => {
			streamDeck.logger.info(`[TwitchatSocket] WSS connection from ${req.socket.remoteAddress}`);
			this.handleConnection(ws);
		});

		this._socketServerSSL.on('error', (error) => {
			streamDeck.logger.error('[TwitchatSocket] WSS server error:', error);
		});

		this._httpServerSSL.listen(30386, '0.0.0.0', () => {
			streamDeck.logger.info('[TwitchatSocket] WSS server listening on wss://localhost:30386');
			streamDeck.logger.info('[TwitchatSocket] Note: WSS users need to accept the self-signed certificate first');
		});

		this._httpServerSSL.on('error', (error) => {
			streamDeck.logger.error('[TwitchatSocket] HTTPS server error:', error);
		});

		streamDeck.logger.info('[TwitchatSocket] Both servers started successfully');
		streamDeck.logger.info('[TwitchatSocket] Use ws://localhost:30385 for local connections (no certificate needed)');
		streamDeck.logger.info('[TwitchatSocket] Use wss://localhost:30386 for secure connections');
	}

	/**
	 * Handles a new WebSocket connection (shared between WS and WSS)
	 */
	private handleConnection(ws: WebSocket): void {
		this._connexions.push({ type: 'other', ws });
		this.updateConnexionCount();
		streamDeck.logger.info(`[TwitchatSocket] New connection established. Total: ${this._connexions.length}`);

		ws.on('message', (event) => {
			const json = JSON.parse(event.toString()) as { type: string; data: unknown };
			const callback = this._callbacks.get(json.type);
			if (callback) {
				callback(json.data);
			}
			if (json.type === 'FLAG_MAIN_APP') {
				const connexion = this._connexions.find((c) => c.ws === ws);
				if (connexion) {
					connexion.type = 'main';
				}
				this.updateConnexionCount();
			}
		});

		ws.on('close', () => {
			const index = this._connexions.findIndex((connexion) => connexion.ws === ws);
			if (index > -1) {
				this._connexions.splice(index, 1);
			}
			this.updateConnexionCount();
			streamDeck.logger.info(`[TwitchatSocket] Connection closed. Total: ${this._connexions.length}`);
		});

		ws.on('error', (error) => {
			streamDeck.logger.error('[TwitchatSocket] WebSocket error:', error);
		});
	}

	/*******************
	 * PRIVATE METHODS *
	 *******************/
	private updateConnexionCount(): void {
		streamDeck.settings.setGlobalSettings({
			// Only count main app connections
			connexionCount: this._connexions.filter((v) => v.type === 'main').length,
		});
	}
}
