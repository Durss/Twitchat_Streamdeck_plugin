import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Send message.
 */
@action({ UUID: 'fr.twitchat.action.send-message' })
export class SendMessage extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_SEND_MESSAGE', { message: ev.payload.settings.message });
	}
}

/**
 * Settings for {@link SendMessage}.
 */
type Settings = {
	message: string;
};
