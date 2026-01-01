import streamDeck, {
	DialAction,
	KeyAction,
	PropertyInspectorDidAppearEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import { readFileSync } from 'fs';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { GlobalSettings } from '../plugin';

/**
 * Abstract action class.
 */
export class AbstractAction<Settings extends JsonObject = JsonObject> extends SingletonAction<Settings> {
	private _actionStateCache: Map<string, 'default' | 'disabled' | 'error'> = new Map();
	private _forceOfflineState = true;

	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
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

		TwitchatSocket.instance.subscribeTwitchatConnection(ev.action.id, async (isConnected) => {
			this.onConnectionStateChange(ev.action, isConnected);
		});
		streamDeck.settings.getGlobalSettings<GlobalSettings>().then(async (globalSettings) => {
			this.onConnectionStateChange(ev.action, globalSettings.mainAppCount > 0);
		});
		this.applyState(ev.action);
	}

	override onWillDisappear(ev: WillDisappearEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.off('ON_COUNTER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_CHAT_COLUMNS_COUNT', ev.action.id);
		TwitchatSocket.instance.off('ON_TRIGGER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_TIMER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_QNA_SESSION_LIST', ev.action.id);
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
	}

	protected getActionState(action: DialAction<{}> | KeyAction<{}>): typeof this._actionStateCache extends Map<string, infer U> ? U : never {
		return this._actionStateCache.get(action.id) || 'default';
	}

	protected setErrorState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'error');
		this.applyState(action);
	}

	protected setEnabled(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'default');
		this.applyState(action);
	}

	protected setDisabledState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'disabled');
		this.applyState(action);
	}

	private async onConnectionStateChange(action: DialAction<{}> | KeyAction<{}>, isConnected: boolean): Promise<void> {
		this._forceOfflineState = isConnected === false;
		this.applyState(action);
	}

	private applyState(action: DialAction<{}> | KeyAction<{}>): void {
		let state = this._actionStateCache.get(action.id);
		const actionId = action.manifestId.split('.').pop();
		let svg = readFileSync('imgs/actions/' + actionId + '/icon.svg', 'utf-8');

		if (this._forceOfflineState) {
			svg = svg.replace(/(fill: ?#.*;)/gi, `fill: #0000ff; fill-opacity: .5;`);
		} else {
			switch (state) {
				case 'disabled':
					svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .35;`);
					break;
				case 'error':
					svg = svg.replace(/(fill: ?#.*;)/gi, `fill: #ff3333; fill-opacity: .8;`);
					break;
			}
		}

		svg = this.injectLogo(svg);
		// eslint-disable-next-line no-undef
		action.setImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
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

	/**
	 * @override
	 */
	protected onTriggerListUpdate(_data: TwitchatEventMap['ON_TRIGGER_LIST'], _settings: Settings, _action: DialAction<{}> | KeyAction<{}>): void {}
	/**
	 * @override
	 */
	protected onCounterListUpdate(_data: TwitchatEventMap['ON_COUNTER_LIST'], _settings: Settings, _action: DialAction<{}> | KeyAction<{}>): void {}
	/**
	 * @override
	 */
	protected onChatColumnsListUpdate(
		_data: TwitchatEventMap['ON_CHAT_COLUMNS_COUNT'],
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onTimerListUpdate(_data: TwitchatEventMap['ON_TIMER_LIST'], _settings: Settings, _action: DialAction<{}> | KeyAction<{}>): void {}
	/**
	 * @override
	 */
	protected onQnaSessionListUpdate(
		_data: TwitchatEventMap['ON_QNA_SESSION_LIST'],
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
}
