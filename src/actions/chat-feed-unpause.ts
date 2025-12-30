import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed unpause.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-unpause' })
export class ChatFeedUnpause extends AbstractAction<Settings> {
	override onWillAppear?(_ev: WillAppearEvent<Settings>): Promise<void> | void {
		this.subscribeTo('COLUMNS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_UNPAUSE', { colIndex: ev.payload.settings.colIndex || 0 });
	}
}

/**
 * Settings for {@link ChatFeedUnpause}.
 */
type Settings = {
	colIndex: number;
};
