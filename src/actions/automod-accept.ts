import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Automod accept.
 */
@action({ UUID: 'fr.twitchat.action.automod-accept' })
export class AutomodAccept extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_AUTOMOD_ACCEPT');
	}
}

/**
 * Settings for {@link AutomodAccept}.
 */
type Settings = {};
