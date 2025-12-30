import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Viewers count toggle.
 */
@action({ UUID: 'fr.twitchat.action.viewers-count-toggle' })
export class ViewersCountToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_VIEWERS_COUNT_TOGGLE');
	}
}

/**
 * Settings for {@link ViewersCountToggle}.
 */
type Settings = {};
