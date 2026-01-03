import streamDeck, { action, DialRotateEvent, DialUpEvent, TouchTapEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';
import { setTimeout, clearTimeout } from 'timers';

/**
 * Action for Chat feed select.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-select' })
export class ChatFeedSelect extends AbstractAction<Settings> {
	private _selectModeMap: Map<string, boolean> = new Map();
	private _selectIndexMap: Map<string, number> = new Map();
	private _actionToTimeout: Map<string, ReturnType<typeof setTimeout>> = new Map();

	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		super.onWillAppear(ev);
		this._selectIndexMap.set(ev.action.id, 0);
		if (ev.action.isDial()) {
			this.resetStrip(ev);
		}
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		const colIndex = ev.payload.settings.colIndex || 0;
		if (this._selectModeMap.get(ev.action.id) === true) {
			let index = this._selectIndexMap.get(ev.action.id) || 0;
			index += ev.payload.ticks;
			if (index < 0) index = SELECT_ACTIONS.length - 1;
			if (index >= SELECT_ACTIONS.length) index = 0;
			this._selectIndexMap.set(ev.action.id, index);

			await ev.action.setFeedback({
				action: { value: '◄ ' + SELECT_ACTIONS[index].label + ' ►', color: SELECT_ACTIONS[index].color },
			});
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SELECT_CHOOSING_ACTION', { colIndex });
		} else {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SELECT', { colIndex, direction: ev.payload.ticks });
		}

		clearTimeout(this._actionToTimeout.get(ev.action.id));
		this._actionToTimeout.set(
			ev.action.id,
			setTimeout(() => {
				this._selectModeMap.set(ev.action.id, false);
				this.resetStrip(ev);
				TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SELECT_ACTION_CANCEL', { colIndex });
			}, 5000),
		);
	}

	override async onTouchTap(ev: TouchTapEvent<Settings>): Promise<void> {
		this.switchMode(ev);
	}

	override async onDialUp(ev: DialUpEvent<Settings>): Promise<void> {
		this.switchMode(ev);
	}

	private async switchMode(ev: DialUpEvent<Settings> | TouchTapEvent<Settings>): Promise<void> {
		let selectMode = this._selectModeMap.get(ev.action.id);
		if (selectMode === undefined) {
			selectMode = true;
			this._selectModeMap.set(ev.action.id, selectMode);
		} else {
			selectMode = !selectMode;
		}
		this._selectModeMap.set(ev.action.id, selectMode);

		let index = this._selectIndexMap.get(ev.action.id) || 0;
		const colIndex = ev.payload.settings.colIndex || 0;
		if (selectMode === true) {
			await ev.action.setFeedbackLayout('layouts/chat-feed-select-layout.json');
			await ev.action.setFeedback({
				title: { value: streamDeck.i18n.translate('chat-feed-select-action') },
				action: { value: '◄ ' + SELECT_ACTIONS[index].label + ' ►', color: SELECT_ACTIONS[index].color },
			});
		} else {
			TwitchatSocket.instance.broadcast(SELECT_ACTIONS[index].action, {
				colIndex,
				...SELECT_ACTIONS[index].params,
			});
			await this.resetStrip(ev);
		}
	}

	private async resetStrip(
		ev: WillAppearEvent<Settings> | DialUpEvent<Settings> | TouchTapEvent<Settings> | DialRotateEvent<Settings>,
	): Promise<void> {
		if (ev.action.isDial() === false) return;

		await ev.action.setFeedbackLayout('$X1');
		await ev.action.setFeedback({
			title: { value: streamDeck.i18n.translate('chat-feed-select-select') },
		});
	}
}

/**
 * Settings for {@link ChatFeedSelect}.
 */
type Settings = {
	colIndex: number;
};

type SelectActionItem = {
	[K in keyof TwitchatEventMap]: {
		color: string;
		label: string;
		action: K;
		params: TwitchatEventMap[K] extends undefined ? undefined : TwitchatEventMap[K];
	};
}[keyof TwitchatEventMap];

const SELECT_ACTIONS: readonly SelectActionItem[] = [
	{ color: '#616161', label: 'CANCEL', action: 'SET_CHAT_FEED_SELECT_ACTION_CANCEL', params: { colIndex: 0 } },
	{ color: '#d9a808', label: 'DELETE', action: 'SET_CHAT_FEED_SELECT_ACTION_DELETE', params: { colIndex: 0 } },
	{ color: '#d97b08', label: 'TIMEOUT 1s', action: 'SET_CHAT_FEED_SELECT_ACTION_BAN', params: { colIndex: 0, duration: 1 } },
	{ color: '#d93c08', label: 'TIMEOUT 600s', action: 'SET_CHAT_FEED_SELECT_ACTION_BAN', params: { colIndex: 0, duration: 600 } },
	{ color: '#FF0000', label: 'BAN', action: 'SET_CHAT_FEED_SELECT_ACTION_BAN', params: { colIndex: 0 } },
	{ color: '#47c2ff', label: 'HIGHLIGHT', action: 'SET_CHAT_FEED_SELECT_ACTION_HIGHLIGHT', params: { colIndex: 0 } },
	{ color: '#475cff', label: 'SAVE', action: 'SET_CHAT_FEED_SELECT_ACTION_SAVE', params: { colIndex: 0 } },
	{ color: '#9147ff', label: 'SHOUTOUT', action: 'SET_CHAT_FEED_SELECT_ACTION_SHOUTOUT', params: { colIndex: 0 } },
];
