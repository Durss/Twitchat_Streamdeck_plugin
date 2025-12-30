import { action, DialRotateEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed read encoder.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-read-encoder' })
export class ChatFeedReadEncoder extends AbstractAction<Settings> {
	override onWillAppear?(_ev: WillAppearEvent<Settings>): Promise<void> | void {
		this.subscribeTo('COLUMNS');
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ', { colIndex: ev.payload.settings.colIndex || 0, count: ev.payload.ticks });
	}
}

/**
 * Settings for {@link ChatFeedReadEncoder}.
 */
type Settings = {
	colIndex: number;
};
