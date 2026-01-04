import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Resume paused chat.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-unpause' })
export class ChatFeedUnpause extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		this.setDeprecatedState(ev.action);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_PAUSE_STATE', { colIndex: ev.payload.settings.colIndex || 0 });
	}
}

/**
 * Settings for {@link ChatFeedUnpause}.
 */
type Settings = {
	colIndex: number;
};
