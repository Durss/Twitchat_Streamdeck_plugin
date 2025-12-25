import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Shoutout.
 */
@action({ UUID: 'fr.twitchat.action.shoutout' })
export class Shoutout extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SHOUTOUT');
	}
}

/**
 * Settings for {@link Shoutout}.
 */
type Settings = {};
