import WebSocket, { WebSocketServer } from 'ws';
/**
* Created : 26/02/2025 
*/
export default class TwitchatSocket {

	private static _instance:TwitchatSocket;
	private _wss:WebSocketServer | null = null;
	private _connexions:WebSocket[] = [];
	
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

	public broadcast(action:string, data:unknown = {}, ws?:WebSocket):void {
		const json = JSON.stringify({ action, data });
		if(ws) {
			ws.send(json);
		}else{
			this._connexions.forEach((client) => {
				client.send(json);
			});
		}
	}
	
	
	
	/******************
	* PUBLIC METHODS *
	******************/
	public initialize():void {
		this._wss = new WebSocketServer({ port: 30385 });

		this._wss.on('connection', (ws) => {
			console.log('Client connected');
			this._connexions.push(ws);

			ws.on('message', (message) => {
				console.log(`Received: ${message}`);
			});
			ws.on("close", () => {
				const index = this._connexions.indexOf(ws);
				if(index > -1) {
					this._connexions.splice(index, 1);
				}
			});

			this.broadcast("CONNECTED", { message: "Welcome to streamdeck" }, ws);
		});
	}
	
	
	
	/*******************
	* PRIVATE METHODS *
	*******************/
}