import { action, DialRotateEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed scroll.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-scroll' })
export class ChatFeedScroll extends AbstractAction<Settings> {
	override onWillAppear?(_ev: WillAppearEvent<Settings>): Promise<void> | void {
		this.subscribeTo('COLUMNS');
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', { colIndex: ev.payload.settings.colIndex || 0, scrollBy: ev.payload.ticks });
	}
}

/**
 * Settings for {@link ChatFeedScroll}.
 */
type Settings = {
	colIndex: number;
};
