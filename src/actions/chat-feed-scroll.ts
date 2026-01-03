import streamDeck, { action, DialRotateEvent, TouchTapEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed scroll.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-scroll' })
export class ChatFeedScroll extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		if (ev.action.isDial()) {
			let colIndex = ev.payload.settings.colIndex || 0;
			if (typeof colIndex == 'string') colIndex = parseInt(colIndex);
			ev.action.setFeedbackLayout('$X1');
			ev.action.setFeedback({
				title: { value: streamDeck.i18n.translate('chat-feed-scroll') + ' (' + (colIndex + 1) + ')' },
			});
		}
		super.onWillAppear(ev);
	}

	override onTouchTap(ev: TouchTapEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL_BOTTOM', {
			colIndex: ev.payload.settings.colIndex || 0,
		});
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
			colIndex: ev.payload.settings.colIndex || 0,
			scrollBy: ev.payload.ticks,
		});
	}
}

/**
 * Settings for {@link ChatFeedScroll}.
 */
type Settings = {
	colIndex: number;
};
