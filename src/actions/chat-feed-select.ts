import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed select.
 * TODO: implement encoder actions
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-select' })
export class ChatFeedSelect extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SELECT', { colIndex: ev.payload.settings.colIndex || 0, direction: 1 });
	}
}

/**
 * Settings for {@link ChatFeedSelect}.
 */
type Settings = {
	colIndex: number;
};
