import streamDeck from '@elgato/streamdeck';
import WebSocket, { WebSocketServer } from 'ws';
/**
* Created : 26/02/2025 
*/
export default class TwitchatSocket {

	private static _instance:TwitchatSocket;
	private _wss:WebSocketServer | null = null;
	private _connexions:WebSocket[] = [];
	private _pendingAnswers:Map<string, (data:any) => void> = new Map();
	
	constructor() {
	
	}
	
	/********************
	* GETTER / SETTERS *
	********************/
	static get instance():TwitchatSocket {
		if(!TwitchatSocket._instance) {
			TwitchatSocket._instance = new TwitchatSocket();
		}
		return TwitchatSocket._instance;
	}

	/******************
	* PUBLIC METHODS *
	******************/

	public broadcast(action:string, data:unknown = {}, ws?:WebSocket, attempts = 0):void {
		if(this._connexions.length === 0 && !ws) {
			if(attempts >= 30) return
			//Wait for a connexion and retry
			setTimeout(() => {
				this.broadcast(action, data, ws, attempts + 1);
			}, 1000);
			return;
		}
		const json = JSON.stringify({ action, data });
		if(ws) {
			ws.send(json);
		}else{
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
	public subscribe(action:string, resultEvent:string, callback:(data:any) => void):void {
		this._pendingAnswers.set(resultEvent, (data:any) => {
			callback(data);
		});
		this.broadcast(action);
	}

	public initialize():void {
		this._wss = new WebSocketServer({ port: 30385 });

		this._wss.on('connection', (ws) => {
			this._connexions.push(ws);
			this.updateConnexionCount();
			
			ws.on('message', (event) => {
				const json = JSON.parse(event.toString()) as {type: string, data:unknown};
				const callback = this._pendingAnswers.get(json.type);
				if(callback) {
					callback(json.data);
					// this._pendingAnswers.delete(json.type)
				}
			});
			ws.on("close", () => {
				const index = this._connexions.indexOf(ws);
				if(index > -1) {
					this._connexions.splice(index, 1);
				}
				this.updateConnexionCount();
			});

			this.broadcast("CONNECTED", { message: "Welcome to streamdeck" }, ws);
		});
	}
	
	
	
	/*******************
	* PRIVATE METHODS *
	*******************/
	private updateConnexionCount():void {
		streamDeck.settings.setGlobalSettings({
			connexionCount: this._connexions.length,
		});
	}
}