import {
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	PropertyInspectorDidAppearEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import { readFileSync } from 'fs';
import { clearInterval, setInterval } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Abstract action class.
 */
export class AbstractAction<Settings extends JsonObject = JsonObject> extends SingletonAction<Settings> {
	private _actionStateCache: Map<string, 'default' | 'disabled' | 'deprecated' | 'error'> = new Map();
	private _actionStateTitleCache: Map<string, string> = new Map();
	private _actionStateImageCache: Map<string, string> = new Map();

	protected _actionToRefreshInterval: Map<string, ReturnType<typeof setInterval>> = new Map();
	protected _forceOfflineState = false;

	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		this._forceOfflineState = !TwitchatSocket.instance.isMainAppConnected;
		TwitchatSocket.instance.subscribeTwitchatConnection(ev.action.id, async (isConnected) => {
			this.onConnectionStateChange(ev.action, isConnected);
		});
		TwitchatSocket.instance.on('ON_COUNTER_LIST', ev.action.id, async (data) =>
			this.onCounterListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_CHAT_COLUMNS_COUNT', ev.action.id, async (data) =>
			this.onChatColumnsListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_TRIGGER_LIST', ev.action.id, async (data) =>
			this.onTriggerListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_TIMER_LIST', ev.action.id, async (data) =>
			this.onTimerListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_QNA_SESSION_LIST', ev.action.id, async (data) =>
			this.onQnaSessionListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_GLOBAL_STATES', ev.action.id, async (data) =>
			this.onGlobalStatesUpdate(data, await ev.action.getSettings(), ev.action),
		);
		this.applyState(ev.action);
	}

	override onWillDisappear(ev: WillDisappearEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.off('ON_COUNTER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_CHAT_COLUMNS_COUNT', ev.action.id);
		TwitchatSocket.instance.off('ON_TRIGGER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_TIMER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_QNA_SESSION_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_GLOBAL_STATES', ev.action.id);
		if (this._actionToRefreshInterval.has(ev.action.id)) {
			clearInterval(this._actionToRefreshInterval.get(ev.action.id));
			this._actionToRefreshInterval.delete(ev.action.id);
		}
		TwitchatSocket.instance.unsubscribeTwitchatConnection(ev.action.id);
	}

	/**
	 * Init action
	 */
	override onPropertyInspectorDidAppear(_ev: PropertyInspectorDidAppearEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcast('GET_ALL_COUNTERS');
		TwitchatSocket.instance.broadcast('GET_CHAT_COLUMNS_COUNT');
		TwitchatSocket.instance.broadcast('GET_TRIGGER_LIST');
		TwitchatSocket.instance.broadcast('GET_TIMER_LIST');
		TwitchatSocket.instance.broadcast('GET_QNA_SESSION_LIST');
		TwitchatSocket.instance.broadcast('GET_GLOBAL_STATES');
	}

	override onDidReceiveSettings(_ev: DidReceiveSettingsEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcastCachedEvents();
	}

	protected getActionState(
		action: DialAction<{}> | KeyAction<{}>,
	): typeof this._actionStateCache extends Map<string, infer U> ? U : never {
		return this._actionStateCache.get(action.id) || 'default';
	}

	protected setErrorState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'error');
		this.applyState(action);
	}

	protected setEnabledState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'default');
		this.applyState(action);
	}

	protected setDisabledState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'disabled');
		this.applyState(action);
	}

	protected setDeprecatedState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'deprecated');
		this.applyState(action);
	}

	protected setText(action: DialAction<{}> | KeyAction<{}>, text: string): void {
		this._actionStateTitleCache.set(action.id, text.replace(/&/, '&amp;'));
		this.applyState(action);
	}

	protected updateImage(action: DialAction<{}> | KeyAction<{}>, imagePath: string): void {
		this._actionStateImageCache.set(action.id, imagePath);
		this.applyState(action);
	}

	private async onConnectionStateChange(action: DialAction<{}> | KeyAction<{}>, isConnected: boolean): Promise<void> {
		this._forceOfflineState = isConnected === false;
		this.applyState(action);
	}

	private applyState(action: DialAction<{}> | KeyAction<{}>): void {
		let state = this._actionStateCache.get(action.id);
		const actionId = action.manifestId.split('.').pop();
		let svg = '';
		if (this._actionStateImageCache.has(action.id)) {
			const imagePath = this._actionStateImageCache.get(action.id)!;
			svg = readFileSync(imagePath, 'utf-8');
		} else {
			svg = readFileSync('imgs/actions/' + actionId + '/icon.svg', 'utf-8');
		}

		if (this._forceOfflineState) {
			svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .35;`).replace(
				'</svg>',
				`
			<path style="fill: white; stroke: #000; stroke-miterlimit: 10; stroke-width: 5px;" d="M68.61,91.79c-.55.34-4.49,10.06-5.61,11.71-2.7,4-7.81,1.13-6.78-2.72l27.88-58.58c2.43-3.28,7.24-1.35,6.6,2.85l-5.56,12.13,3.91,5.18c19.7-3.2,25.2,24.74,5.74,29.23l-26.18.19Z"/>
			<path style="fill: white; stroke: #000; stroke-miterlimit: 10; stroke-width: 5px;" d="M72.31,51.48l-18.88,39.95c-5.49,1.24-11.61-.73-14.58-5.72-5.46-9.16,1.77-20.32,12.25-19.07,2.4-9.4,11.46-16.3,21.21-15.17Z"/>
			</svg>`,
			);
		} else {
			switch (state) {
				case 'deprecated': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .85;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `$1 stroke-opacity: .85;`);
					svg = svg.replace(/<image/gi, `<image style="opacity: .85;"`);
					svg = svg.replace(
						'</svg>',
						`
						<path fill="#ffffff" d="M127.74,84.48h-18.56c1.11-2.59,1.06-5.53-.2-8.11l-24.84-50.75c-1.65-3.37-5.01-5.47-8.76-5.47s-7.11,2.1-8.76,5.47l-24.83,50.75c-1.27,2.59-1.31,5.52-.2,8.11h-25.32c-6.53,0-11.84,5.31-11.84,11.84v15.69c0,6.53,5.31,11.84,11.84,11.84h111.48c6.53,0,11.84-5.31,11.84-11.84v-15.69c0-6.53-5.31-11.84-11.84-11.84Z"/>
						<path fill="#cc0000" d="M81.12,106.13h1.23c-.18-1.56-.36-3.48-.54-5.78-.36,2.63-.59,4.56-.69,5.78Z"/>
						<path fill="#cc0000" d="M52.36,106.13h1.23c-.18-1.56-.36-3.48-.54-5.78-.36,2.63-.59,4.56-.69,5.78Z"/>
						<path fill="#cc0000" d="M37.11,99.64v3.5c.1,0,.19,0,.26,0,.33,0,.56-.08.68-.24.13-.16.19-.5.19-1.01v-1.13c0-.47-.07-.78-.22-.92-.15-.14-.45-.21-.92-.21Z"/>
						<path fill="#cc0000" d="M20.51,99.64v3.06c.4,0,.68-.06.85-.17.16-.11.24-.47.24-1.08v-.75c0-.44-.08-.72-.23-.86-.16-.14-.44-.2-.85-.2Z"/>
						<path fill="#cc0000" d="M113.61,99.33c-.19,0-.33.07-.43.22-.1.15-.15.57-.15,1.28v6.42c0,.8.03,1.29.1,1.48.06.19.22.28.45.28s.4-.11.47-.32c.07-.22.1-.73.1-1.54v-6.32c0-.64-.04-1.05-.11-1.23-.07-.18-.22-.27-.44-.27Z"/>
						<path fill="#cc0000" d="M127.74,90.87H16.26c-3.01,0-5.45,2.44-5.45,5.45v15.69c0,3.01,2.44,5.45,5.45,5.45h111.48c3.01,0,5.45-2.44,5.45-5.45v-15.69c0-3.01-2.44-5.45-5.45-5.45ZM24.37,104.57c.24.29.39.56.45.81.06.25.09.92.09,2.03v3.63h-3.32v-4.57c0-.74-.06-1.19-.17-1.37-.12-.17-.42-.26-.91-.26v6.2h-3.58v-13.75h2.53c1.69,0,2.83.06,3.43.2.6.13,1.08.46,1.46,1,.38.54.56,1.39.56,2.56,0,1.07-.13,1.79-.4,2.16-.27.37-.79.59-1.57.66.71.18,1.18.41,1.43.7ZM32.5,111.04h-6.2v-13.75h5.96v2.75h-2.39v2.61h2.23v2.62h-2.23v3.02h2.62v2.75ZM41.23,102.34c0,.88-.09,1.52-.27,1.92-.18.4-.51.71-1,.93-.48.22-1.12.32-1.9.32h-.96v5.54h-3.57v-13.75h3.6c.97,0,1.72.08,2.25.23.52.15.92.37,1.18.66.26.29.44.64.54,1.05.09.41.14,1.05.14,1.91v1.2ZM48.01,111.04h-5.75v-13.75h3.58v11h2.17v2.75ZM53.88,111.04l-.19-2.47h-1.28l-.21,2.47h-3.7l1.82-13.75h5.17l2.04,13.75h-3.65ZM66.49,103.28h-3.58v-2.39c0-.7-.04-1.13-.12-1.3-.08-.17-.24-.26-.5-.26-.29,0-.48.1-.56.31-.08.21-.12.66-.12,1.36v6.39c0,.67.04,1.1.12,1.31.08.2.26.31.53.31s.44-.1.52-.31c.08-.2.12-.68.12-1.44v-1.73h3.58v.54c0,1.42-.1,2.43-.3,3.03-.2.6-.65,1.12-1.33,1.57-.69.45-1.54.67-2.54.67s-1.91-.19-2.59-.57c-.68-.38-1.13-.9-1.35-1.57-.22-.67-.33-1.68-.33-3.03v-4.02c0-.99.03-1.73.1-2.23.07-.49.27-.97.61-1.43s.8-.82,1.4-1.08c.6-.26,1.28-.39,2.06-.39,1.05,0,1.92.2,2.61.61.69.41,1.14.92,1.35,1.52.22.61.32,1.55.32,2.84v1.31ZM73.97,111.04h-6.2v-13.75h5.96v2.75h-2.39v2.61h2.23v2.62h-2.23v3.02h2.62v2.75ZM82.64,111.04l-.19-2.47h-1.28l-.21,2.47h-3.7l1.82-13.75h5.17l2.04,13.75h-3.66ZM95.25,103.28h-3.58v-2.39c0-.7-.04-1.13-.12-1.3-.07-.17-.24-.26-.5-.26-.29,0-.48.1-.56.31-.08.21-.12.66-.12,1.36v6.39c0,.67.04,1.1.12,1.31.08.2.26.31.53.31s.44-.1.52-.31c.08-.2.12-.68.12-1.44v-1.73h3.58v.54c0,1.42-.1,2.43-.3,3.03-.2.6-.64,1.12-1.33,1.57-.69.45-1.54.67-2.54.67s-1.91-.19-2.59-.57c-.68-.38-1.13-.9-1.35-1.57-.22-.67-.33-1.68-.33-3.03v-4.02c0-.99.04-1.73.1-2.23.07-.49.27-.97.61-1.43.34-.46.81-.82,1.4-1.08.6-.26,1.28-.39,2.06-.39,1.05,0,1.92.2,2.61.61.69.41,1.14.92,1.35,1.52.22.61.32,1.55.32,2.84v1.31ZM103.73,100.04h-2.12v11h-3.57v-11h-2.12v-2.75h7.81v2.75ZM108.12,111.04h-3.58v-13.75h3.58v13.75ZM117.73,105.34c0,1.38-.03,2.36-.1,2.93-.06.58-.27,1.1-.61,1.58-.34.48-.81.84-1.39,1.1-.58.26-1.26.38-2.04.38-.74,0-1.4-.12-1.98-.36-.59-.24-1.06-.6-1.41-1.08-.36-.48-.57-1-.64-1.57-.07-.57-.1-1.56-.1-2.97v-2.35c0-1.38.03-2.36.1-2.94.06-.57.27-1.1.61-1.57.34-.48.81-.84,1.39-1.1.58-.26,1.26-.38,2.04-.38.74,0,1.4.12,1.98.36.59.24,1.06.6,1.41,1.08.36.48.57,1,.64,1.57.07.57.1,1.56.1,2.97v2.35ZM127.05,111.04h-3.13l-1.86-6.25v6.25h-2.99v-13.75h2.99l2,6.19v-6.19h2.99v13.75Z"/>
						<path fill="#cc0000" d="M103.24,79.18l-24.84-50.75c-1.23-2.52-4.83-2.52-6.06,0l-24.84,50.75c-1.1,2.24.54,4.86,3.03,4.86h49.67c2.5,0,4.13-2.62,3.03-4.86ZM79.24,75.5h-7.72v-6.62h7.72v6.62ZM78.56,67.33h-6.37l-1.35-24.89h9.07l-1.35,24.89Z"/>
						</svg>`,
					);
					break;
				}
				case 'disabled': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .35;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `$1 stroke-opacity: .35;`);
					svg = svg.replace(/<image/gi, `<image style="opacity: .35;"`);
					break;
				}
				case 'error': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `fill: #ff3333; fill-opacity: .8;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `stroke: #ff3333; stroke-opacity: .8;`);
					break;
				}
			}
			const label = this._actionStateTitleCache.get(action.id);
			if (label) {
				svg = this.injectText(svg, label, state === 'error');
			}
		}

		svg = this.injectLogo(svg);
		// eslint-disable-next-line no-undef
		const img = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
		if (action.isKey()) {
			action.setImage(img);
		} else if (action.isDial()) {
			action.setFeedback({
				icon: { value: img },
			});
		}
	}

	private injectLogo(svg: string): string {
		return svg.replace(
			'</svg>',
			`
				<path style="fill: white; fill-opacity:.5; stroke: #000; stroke-miterlimit: 10; stroke-width: 2px;" d="M123.48,123.91c-.01,1.9-.01,3.79,0,5.69,0,.39-.15.49-.52.49-1.61-.02-3.21,0-4.82-.03-.43-.01-.6.09-.59.56.03,1.05,0,1.05,1.07,1.05,1.44,0,2.87.01,4.31-.01.42-.01.56.13.55.56-.02,1.85-.02,3.69,0,5.54.01.47-.17.58-.6.57-2.74-.01-5.46.01-8.2-.02-.3,0-.66-.17-.88-.38-.84-.77-1.63-1.61-2.47-2.39-.39-.37-.55-.75-.55-1.29.04-2.6.03-5.23.03-7.86s.01-4.71-.01-7.4c0-.47.11-.67.63-.66,1.86.03,3.72.02,5.59,0,.44,0,.58.13.58.58-.03,1.56,0,2.41-.02,3.97-.01.42.11.56.55.55,1.62-.02,3.25,0,4.87-.02.38,0,.51.11.5.49Z"/>
				<path style="fill: white; fill-opacity:.5; stroke: #000; stroke-miterlimit: 10; stroke-width: 2px;" d="M138.33,123.91c-.01,1.9-.01,3.79,0,5.69,0,.39-.15.49-.52.49-1.61-.02-3.21,0-4.82-.03-.43-.01-.6.09-.59.56.03,1.05,0,1.05,1.07,1.05,1.44,0,2.87.01,4.31-.01.42-.01.56.13.55.56-.02,1.85-.02,3.69,0,5.54.01.47-.17.58-.6.57-2.74-.01-5.46.01-8.2-.02-.3,0-.66-.17-.88-.38-.84-.77-1.63-1.61-2.47-2.39-.39-.37-.55-.75-.55-1.29.04-2.6.03-5.23.03-7.86s.01-4.71-.01-7.4c0-.47.11-.67.63-.66,1.86.03,3.72.02,5.59,0,.44,0,.58.13.58.58-.03,1.56,0,2.41-.02,3.97-.01.42.11.56.55.55,1.62-.02,3.25,0,4.87-.02.38,0,.51.11.5.49Z"/>
			</svg>`,
		);
	}

	private injectText(svg: string, text: string, isError: boolean): string {
		const color = isError ? '#ff0000' : '#008667';
		const lines = text.split('\n');
		const svgLines: string[] = [];
		lines.forEach((line, index) => {
			const py = 20 + index * 20;
			svgLines.push(`
			<text
				x="74px"
				y="${py + 2 * (index + 1)}px"
				text-anchor="middle"
				font-family="sans-serif"
				font-size="20"
				fill="black"
			>${line}</text>
			<text
				x="72px"
				y="${py}px"
				text-anchor="middle"
				font-family="sans-serif"
				font-size="20"
				fill="white"
			>${line}</text>`);
		});
		return svg.replace(
			'</svg>',
			`
				<rect x="0" y="-20" width="144px" height="${svgLines.length * 20 + 10 + 20}px" rx="12px" ry="12px" style="fill: ${color}; fill-opacity: .7; stroke: #000000; stroke-opacity: .7; stroke-miterlimit: 10; stroke-width: 3px;"/>
				${svgLines.join('\n')}
			</svg>`,
		);
	}

	/**
	 * @override
	 */
	protected onTriggerListUpdate(
		_data: TwitchatEventMap['ON_TRIGGER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onCounterListUpdate(
		_data: TwitchatEventMap['ON_COUNTER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onChatColumnsListUpdate(
		_data: TwitchatEventMap['ON_CHAT_COLUMNS_COUNT'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onTimerListUpdate(
		_data: TwitchatEventMap['ON_TIMER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onQnaSessionListUpdate(
		_data: TwitchatEventMap['ON_QNA_SESSION_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onGlobalStatesUpdate(
		_data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
}
