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
	private _connexions: WebSocket[] = [];
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
				client.send(json);
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
		this._connexions.push(ws);
		this.updateConnexionCount();
		streamDeck.logger.info(`[TwitchatSocket] New connection established. Total: ${this._connexions.length}`);

		ws.on('message', (event) => {
			const json = JSON.parse(event.toString()) as { type: string; data: unknown };
			const callback = this._callbacks.get(json.type);
			if (callback) {
				callback(json.data);
			}
		});

		ws.on('close', () => {
			const index = this._connexions.indexOf(ws);
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
			connexionCount: this._connexions.length,
		});
	}
}

export const TwitchatEventTypeList = [
	'CustomEvent', //Do not uppercase/change this ! it matches an OBS-WS event
	'TWITCHAT_READY',
	'OBS_WEBSOCKET_CONNECTED',
	'OBS_WEBSOCKET_DISCONNECTED',
	'TEXT_UPDATE',
	'ACTION_BATCH',
	'SPEECH_END',
	'REMOTE_TEMP_TEXT_EVENT',
	'REMOTE_FINAL_TEXT_EVENT',
	'MESSAGE_READ',
	'MESSAGE_NON_FOLLOWER',
	'MESSAGE_FILTERED',
	'MESSAGE_DELETED',
	'MESSAGE_FIRST',
	'MESSAGE_FIRST_ALL_TIME',
	'MESSAGE_WHISPER',
	'FOLLOW',
	'REWARD_REDEEM',
	'BITS',
	'SUBSCRIPTION',
	'MENTION',
	'CURRENT_TRACK',
	'TRACK_ADDED_TO_QUEUE',
	'WHEEL_OVERLAY_PRESENCE',
	'BITSWALL_OVERLAY_PRESENCE',
	'CREDITS_OVERLAY_PRESENCE',
	'COUNTDOWN_START',
	'COUNTDOWN_COMPLETE',
	'TIMER_START',
	'TIMER_STOP',
	'TIMER_OVERLAY_PRESENCE',
	'POLL_PROGRESS',
	'CHAT_POLL_PROGRESS',
	'PREDICTION_PROGRESS',
	'RAFFLE_RESULT',
	'EMERGENCY_MODE',
	'CHAT_HIGHLIGHT_OVERLAY_PRESENCE',
	'CHAT_HIGHLIGHT_OVERLAY_CONFIRM',
	'VOICEMOD_CHANGE',
	'SET_COLS_COUNT',
	'COUNTER_UPDATE',
	'COUNTER_LIST',
	'TRIGGER_LIST',
	'OBS_SCENE_CHANGE',
	'OBS_SOURCE_TOGGLE',
	'OBS_MUTE_TOGGLE',
	'OBS_FILTER_TOGGLE',
	'OBS_STREAM_STATE',
	'OBS_RECORD_STATE',
	'OBS_PLAYBACK_ENDED',
	'OBS_PLAYBACK_STARTED',
	'OBS_PLAYBACK_PAUSED',
	'OBS_PLAYBACK_RESTARTED',
	'OBS_PLAYBACK_NEXT',
	'OBS_PLAYBACK_PREVIOUS',
	'OBS_INPUT_NAME_CHANGED',
	'OBS_SCENE_NAME_CHANGED',
	'OBS_FILTER_NAME_CHANGED',
	'MUSIC_PLAYER_HEAT_CLICK',
	'LABELS_UPDATE',
	'SUMMARY_DATA',
	'ENDING_CREDITS_CONFIGS',
	'ENDING_CREDITS_CONTROL',
	'ENDING_CREDITS_COMPLETE',
	'AD_BREAK_OVERLAY_PRESENCE',
	'AD_BREAK_OVERLAY_PARAMETERS',
	'AD_BREAK_DATA',
	'DISTORT_OVERLAY_PARAMETERS',
	'BITSWALL_OVERLAY_PARAMETERS',
	'PREDICTIONS_OVERLAY_PRESENCE',
	'PREDICTIONS_OVERLAY_PARAMETERS',
	'POLLS_OVERLAY_PRESENCE',
	'CHAT_POLL_OVERLAY_PRESENCE',
	'POLLS_OVERLAY_PARAMETERS',
	'CHAT_POLL_OVERLAY_PARAMETERS',
	'BINGO_GRID_PARAMETERS',
	'BINGO_GRID_OVERLAY_PRESENCE',
	'BINGO_GRID_HEAT_CLICK',
	'BINGO_GRID_OVERLAY_VIEWER_EVENT',
	'BINGO_GRID_OVERLAY_LEADER_BOARD',
	'LABEL_OVERLAY_PARAMS',
	'LABEL_OVERLAY_PLACEHOLDERS',
	'DONATION_GOALS_OVERLAY_PARAMS',
	'DONATION_EVENT',
	'QNA_SESSION_LIST',
	'ANIMATED_TEXT_CONFIGS',
	'ANIMATED_TEXT_SHOW_COMPLETE',
	'ANIMATED_TEXT_HIDE_COMPLETE',
	'CUSTOM_TRAIN_STATE',
	'TIMER_LIST',
] as const;
export type TwitchatEventType = (typeof TwitchatEventTypeList)[number];

export const TwitchatActionTypeList = [
	'GREET_FEED_READ',
	'GREET_FEED_READ_ALL',
	'CHAT_FEED_READ',
	'CHAT_FEED_READ_ALL',
	'CHAT_FEED_PAUSE',
	'CHAT_FEED_UNPAUSE',
	'CHAT_FEED_SCROLL_UP',
	'CHAT_FEED_SCROLL_DOWN',
	'CHAT_FEED_SCROLL',
	'CHAT_FEED_SCROLL_BOTTOM',
	'CHAT_FEED_SELECT',
	'CHAT_FEED_SELECT_ACTION_CANCEL',
	'CHAT_FEED_SELECT_ACTION_DELETE',
	'CHAT_FEED_SELECT_ACTION_BAN',
	'CHAT_FEED_SELECT_CHOOSING_ACTION',
	'CHAT_FEED_SELECT_ACTION_PIN',
	'CHAT_FEED_SELECT_ACTION_HIGHLIGHT',
	'CHAT_FEED_SELECT_ACTION_SHOUTOUT',
	'CLEAR_CHAT_HIGHLIGHT',
	'MERGE_TOGGLE',
	'POLL_TOGGLE',
	'POLL_CREATE',
	'PREDICTION_TOGGLE',
	'BINGO_TOGGLE',
	'RAFFLE_TOGGLE',
	'VIEWERS_COUNT_TOGGLE',
	'MOD_TOOLS_TOGGLE',
	'CENSOR_DELETED_MESSAGES_TOGGLE',
	'GET_CURRENT_TRACK',
	'GET_WHEEL_OVERLAY_PRESENCE',
	'GET_BITSWALL_OVERLAY_PRESENCE',
	'GET_CREDITS_OVERLAY_PRESENCE',
	'WHEEL_OVERLAY_START',
	'GET_CURRENT_TIMERS',
	'GET_TIMER_OVERLAY_PRESENCE',
	'SET_EMERGENCY_MODE',
	'GET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE',
	'SET_CHAT_HIGHLIGHT_OVERLAY_MESSAGE',
	'SHOW_CLIP',
	'START_EMERGENCY',
	'STOP_EMERGENCY',
	'SHOUTOUT',
	'STOP_TTS',
	'ENABLE_STT',
	'DISABLE_STT',
	'RAFFLE_START',
	'RAFFLE_PICK_WINNER',
	'RAFFLE_END',
	'GET_COLS_COUNT',
	'COUNTER_GET_ALL',
	'TRIGGERS_GET_ALL',
	'EXECUTE_TRIGGER',
	'TOGGLE_TRIGGER',
	'SEND_MESSAGE',
	'COUNTER_GET',
	'COUNTER_ADD',
	'TIMER_ADD',
	'COUNTDOWN_ADD',
	'CREATE_POLL',
	'STOP_POLL',
	'CREATE_PREDICTION',
	'STOP_PREDICTION',
	'CREATE_RAFFLE',
	'STOP_RAFFLE',
	'GET_SUMMARY_DATA',
	'GET_AD_BREAK_OVERLAY_PRESENCE',
	'GET_AD_BREAK_OVERLAY_PARAMETERS',
	'GET_DISTORT_OVERLAY_PARAMETERS',
	'GET_BITS_WALL_OVERLAY_PARAMETERS',
	'CUSTOM_CHAT_MESSAGE',
	'GET_PREDICTIONS_OVERLAY_PRESENCE',
	'GET_PREDICTIONS_OVERLAY_PARAMETERS',
	'GET_POLLS_OVERLAY_PRESENCE',
	'GET_CHAT_POLL_OVERLAY_PRESENCE',
	'GET_POLLS_OVERLAY_PARAMETERS',
	'GET_CHAT_POLL_OVERLAY_PARAMETERS',
	'GET_BINGO_GRID_PARAMETERS',
	'GET_LABEL_OVERLAY_PARAMS',
	'GET_LABEL_OVERLAY_PLACEHOLDERS',
	'AUTOMOD_ACCEPT',
	'AUTOMOD_REJECT',
	'GET_DONATION_GOALS_OVERLAY_PARAMS',
	'QNA_HIGHLIGHT',
	'QNA_SKIP',
	'QNA_SESSION_GET_ALL',
	'HIDE_ALERT',
	'GET_ANIMATED_TEXT_CONFIGS',
	'ANIMATED_TEXT_SET',
	'ANIMATED_TEXT_CLOSE',
	'GET_CUSTOM_TRAIN_STATE',
	'PLAY_SFXR',
	'GET_TIMER_LIST',
] as const;
export type TwitchatActionType = (typeof TwitchatActionTypeList)[number];
