import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed read all.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-read-all' })
export class ChatFeedReadAll extends AbstractAction<Settings> {
	override onWillAppear?(_ev: WillAppearEvent<Settings>): Promise<void> | void {
		this.subscribeTo('COLUMNS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('CHAT_FEED_READ_ALL', { col: ev.payload.settings.colIndex || 0 });
	}
}

/**
 * Settings for {@link ChatFeedReadAll}.
 */
type Settings = {
	colIndex: number;
};
