import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Hide alert.
 */
@action({ UUID: 'fr.twitchat.action.hide-alert' })
export class HideAlert extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('HIDE_ALERT');
	}
}

/**
 * Settings for {@link HideAlert}.
 */
type Settings = {};
