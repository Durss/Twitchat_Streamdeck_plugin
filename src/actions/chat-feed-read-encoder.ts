import streamDeck, { action, DialRotateEvent, TouchTapEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed read encoder.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-read-encoder' })
export class ChatFeedReadEncoder extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isDial()) return;
		if (!ev.payload.settings.colIndex) {
			ev.action.setSettings({
				colIndex: 0,
			});
		}
		let colIndex = ev.payload.settings.colIndex || 0;
		if (typeof colIndex == 'string') colIndex = parseInt(colIndex);
		ev.action.setFeedbackLayout('$X1');
		ev.action.setFeedback({
			title: { value: streamDeck.i18n.translate('chat-feed-read') + ' (' + (colIndex + 1) + ')' },
		});
		super.onWillAppear(ev);
	}

	override onTouchTap(ev: TouchTapEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ_ALL', {
			colIndex: ev.payload.settings.colIndex || 0,
		});
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ', {
			colIndex: ev.payload.settings.colIndex || 0,
			count: ev.payload.ticks,
		});
	}
}

/**
 * Settings for {@link ChatFeedReadEncoder}.
 */
type Settings = {
	colIndex: number;
};
