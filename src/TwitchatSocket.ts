import streamDeck from '@elgato/streamdeck';
import https from 'https';
import { setTimeout } from 'timers';
import WebSocket, { WebSocketServer } from 'ws';
import CertificateManager from './CertificateManager';
import { json2Event, TwitchatEventMap } from './TwitchatEventMap';
import { GlobalSettings } from './plugin';
/**
 * Created : 26/02/2025
 */
export default class TwitchatSocket {
	private static _instance: TwitchatSocket;
	private _socketServer: WebSocketServer | null = null;
	private _socketServerSSL: WebSocketServer | null = null;
	private _httpServerSSL: https.Server | null = null;
	private _connexions: { type: 'main' | 'other'; ws: WebSocket }[] = [];
	private _callbackListeners: {
		[key: string]: { [actionId: string]: (data: TwitchatEventMap[keyof TwitchatEventMap]) => void };
	} = {};
	private _lastEventDataCache: Partial<{ [key in keyof TwitchatEventMap]?: TwitchatEventMap[key] }> = {};
	private _twitchatConnectionHandlers: { [actionId: string]: (connected: boolean) => void } = {};

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

	public get isMainAppConnected(): boolean {
		return this._connexions.some((c) => c.type === 'main');
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
			if (attempts >= 10) return;
			//Wait for a connexion and retry
			setTimeout(() => {
				// @ts-expect-error couldn't find a way to make ts happy here
				this.broadcast(action, data, ws, attempts + 1);
			}, 500);
			return;
		}
		const json = JSON.stringify({ action, data });
		if (ws) {
			ws.send(json);
		} else {
			this._connexions.forEach((client) => {
				if (client.type == 'main') client.ws.send(json);
			});
		}
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

	public on<Event extends keyof TwitchatEventMap>(
		event: Event,
		actionId: string,
		listener: (data: TwitchatEventMap[Event]) => void,
	): void {
		if (!this._callbackListeners[event]) {
			this._callbackListeners[event] = {};
		}
		const castedListener = listener as (data: TwitchatEventMap[keyof TwitchatEventMap]) => void;
		this._callbackListeners[event][actionId] = castedListener;
		castedListener(this._lastEventDataCache[event]);
	}

	public off(event: keyof TwitchatEventMap, actionId: string): void {
		if (!this._callbackListeners[event]) return;
		delete this._callbackListeners[event][actionId];
	}

	public subscribeTwitchatConnection(actionId: string, handler: (connected: boolean) => void): void {
		this._twitchatConnectionHandlers[actionId] = handler;
	}

	public unsubscribeTwitchatConnection(actionId: string): void {
		if (!this._twitchatConnectionHandlers[actionId]) return;
		delete this._twitchatConnectionHandlers[actionId];
	}

	public broadcastCachedEvents(): void {
		for (const event in this._lastEventDataCache) {
			const data = this._lastEventDataCache[event as keyof TwitchatEventMap];
			Object.values(this._callbackListeners[event] || {}).forEach((callback) => callback(data!));
		}
	}

	/*******************
	 * PRIVATE METHODS *
	 *******************/

	/**
	 * Handles a new WebSocket connection (shared between WS and WSS)
	 */
	private handleConnection(ws: WebSocket): void {
		this._connexions.push({ type: 'other', ws });
		this.updateConnexionCount();

		ws.on('message', (eventSource) => {
			const event = json2Event(eventSource.toString());
			Object.values(this._callbackListeners[event.type] || {}).forEach((callback) => callback(event.data));
			(this._lastEventDataCache as Record<keyof TwitchatEventMap, TwitchatEventMap[keyof TwitchatEventMap]>)[event.type] =
				event.data;
			switch (event.type) {
				case 'ON_FLAG_MAIN_APP': {
					const connexion = this._connexions.find((c) => c.ws === ws);
					if (connexion) {
						connexion.type = 'main';
					}
					this.updateConnexionCount();
					this.broadcast('GET_ALL_COUNTERS');
					this.broadcast('GET_CHAT_COLUMNS_COUNT');
					this.broadcast('GET_TRIGGER_LIST');
					this.broadcast('GET_TIMER_LIST');
					this.broadcast('GET_QNA_SESSION_LIST');
					break;
				}
			}
			this.populatePropertInspector();
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

	private populatePropertInspector(): void {
		streamDeck.ui.sendToPropertyInspector({
			event: 'getQnas',
			items: this.reduceQnaList(),
		});
		streamDeck.ui.sendToPropertyInspector({
			event: 'getColumns',
			items: this.reduceColumnCount(),
		});
		streamDeck.ui.sendToPropertyInspector({
			event: 'getCounters',
			items: this.reduceCounterList(),
		});
		streamDeck.ui.sendToPropertyInspector({
			event: 'getTriggers',
			items: this.reduceTriggerList(),
		});
		streamDeck.ui.sendToPropertyInspector({
			event: 'getTimers',
			items: this.reduceTimerList(),
		});
		streamDeck.ui.sendToPropertyInspector({
			event: 'getCountdowns',
			items: this.reduceCountdownList(),
		});
	}

	private async updateConnexionCount(): Promise<void> {
		await streamDeck.settings.setGlobalSettings<GlobalSettings>({
			clientCount: this._connexions.length,
			mainAppCount: this._connexions.filter((v) => v.type === 'main').length,
		});
		for (const key in this._twitchatConnectionHandlers) {
			if (!Object.hasOwn(this._twitchatConnectionHandlers, key)) continue;
			this._twitchatConnectionHandlers[key](this._connexions.some((c) => c.type === 'main'));
		}
	}

	private reduceCounterList() {
		let items = this._lastEventDataCache['ON_COUNTER_LIST']?.counterList
			.filter((c) => c.perUser === false)
			.map((counter): SelectItem => ({ value: counter.id, label: counter.name }));
		if (!items || items.length === 0) {
			items = [
				{
					value: '',
					label: streamDeck.i18n.translate('no-counter'),
					disabled: true,
				},
			];
		}
		items.unshift({
			value: '',
			label: streamDeck.i18n.translate('select-placeholder'),
		});
		return items;
	}

	private reduceColumnCount() {
		const items: SelectItem<number>[] = [];
		const count = this._lastEventDataCache['ON_CHAT_COLUMNS_COUNT']?.count ?? 1;
		for (let i = 0; i < count; i++) {
			items.push({ value: i, label: (i + 1).toString() });
		}
		return items;
	}

	private reduceTriggerList() {
		let items = this._lastEventDataCache['ON_TRIGGER_LIST']?.triggerList.map(
			(trigger): SelectItem => ({
				value: trigger.id,
				label: trigger.disabled ? `🔴 ${trigger.name}` : `🟢 ${trigger.name}`,
				// disabled: trigger.disabled === true,
			}),
		);
		if (!items || items.length === 0) {
			items = [{ value: '', label: streamDeck.i18n.translate('no-trigger'), disabled: true }];
		}
		items.unshift({
			value: '',
			label: streamDeck.i18n.translate('select-placeholder'),
		});
		return items;
	}

	private reduceTimerList() {
		let items = this._lastEventDataCache['ON_TIMER_LIST']?.timerList
			.filter((timer) => timer.type === 'timer')
			.map(
				(timer): SelectItem => ({
					value: timer.id,
					label: timer.title,
					disabled: !timer.enabled,
				}),
			);
		return items;
	}

	private reduceCountdownList() {
		let items = this._lastEventDataCache['ON_TIMER_LIST']?.timerList
			.filter((timer) => timer.type === 'countdown')
			.map(
				(timer): SelectItem => ({
					value: timer.id,
					label: timer.title,
					disabled: !timer.enabled,
				}),
			);
		return items;
	}

	private reduceQnaList() {
		let items = this._lastEventDataCache['ON_QNA_SESSION_LIST']?.sessionList?.map(
			(qna): SelectItem => ({
				value: qna.id,
				label: qna.command,
				disabled: !qna.open,
			}),
		);
		if (!items || items.length === 0) {
			items = [
				{
					value: '',
					label: streamDeck.i18n.translate('no-qna-session'),
					disabled: true,
				},
			];
		}
		items.unshift({
			value: '',
			label: streamDeck.i18n.translate('select-placeholder'),
		});
		return items;
	}
}

type SelectItem<V = string> = {
	value: V;
	label: string;
	disabled?: boolean;
};
