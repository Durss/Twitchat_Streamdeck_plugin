import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Clear chat highlight.
 */
@action({ UUID: 'fr.twitchat.action.clear-chat-highlight' })
export class ClearChatHighlight extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('CLEAR_CHAT_HIGHLIGHT');
	}
}

/**
 * Settings for {@link ClearChatHighlight}.
 */
type Settings = {};
