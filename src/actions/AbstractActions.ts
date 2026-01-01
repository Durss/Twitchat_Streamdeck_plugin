import { DialAction, KeyAction, PropertyInspectorDidAppearEvent, SingletonAction, WillAppearEvent, WillDisappearEvent } from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import { readFileSync } from 'fs';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Abstract action class.
 */
export class AbstractAction<Settings extends JsonObject = JsonObject> extends SingletonAction<Settings> {
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

	protected errorIcon(action: DialAction<{}> | KeyAction<{}>): void {
		const actionId = action.manifestId.split('.').pop();
		let svg = readFileSync('imgs/actions/' + actionId + '/icon.svg', 'utf-8');
		svg = svg.replace(/(fill: ?#.*;)/gi, `fill: #ff3333; fill-opacity: .8;`);
		// eslint-disable-next-line no-undef
		action.setImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
	}

	protected fadeIcon(action: DialAction<{}> | KeyAction<{}>): void {
		this.applyFade(action, 0.35);
	}

	protected resetIcon(action: DialAction<{}> | KeyAction<{}>): void {
		const actionId = action.manifestId.split('.').pop();
		action.setImage('imgs/actions/' + actionId + '/icon.svg');
	}

	/**
	 * Get SVG icon source of given action and apply opacity to all css fills
	 * @param action
	 * @param opacity
	 */
	private applyFade(action: DialAction<{}> | KeyAction<{}>, opacity: number): void {
		const actionId = action.manifestId.split('.').pop();
		let svg = readFileSync('imgs/actions/' + actionId + '/icon.svg', 'utf-8');
		if (opacity < 1) svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: ${opacity};`);
		// eslint-disable-next-line no-undef
		action.setImage(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
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
