import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Set emergency mode.
 */
@action({ UUID: 'fr.twitchat.action.set-emergency-mode' })
export class SetEmergencyMode extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_EMERGENCY_MODE');
	}
}

/**
 * Settings for {@link SetEmergencyMode}.
 */
type Settings = {};
