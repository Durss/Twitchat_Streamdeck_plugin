import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed pause.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-pause' })
export class ChatFeedPause extends AbstractAction<Settings> {
	override onWillAppear?(_ev: WillAppearEvent<Settings>): Promise<void> | void {
		this.subscribeTo('COLUMNS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_PAUSE', { colIndex: ev.payload.settings.colIndex || 0 });
	}
}

/**
 * Settings for {@link ChatFeedPause}.
 */
type Settings = {
	colIndex: number;
};
