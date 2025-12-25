import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Automod reject.
 */
@action({ UUID: 'fr.twitchat.action.automod-reject' })
export class AutomodReject extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('AUTOMOD_REJECT');
	}
}

/**
 * Settings for {@link AutomodReject}.
 */
type Settings = {};
