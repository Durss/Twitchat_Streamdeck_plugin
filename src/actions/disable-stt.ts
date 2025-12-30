import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Disable stt.
 */
@action({ UUID: 'fr.twitchat.action.disable-stt' })
export class DisableStt extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_DISABLE_STT');
	}
}

/**
 * Settings for {@link DisableStt}.
 */
type Settings = {};
