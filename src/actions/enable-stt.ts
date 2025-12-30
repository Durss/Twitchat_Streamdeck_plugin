import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable stt.
 */
@action({ UUID: 'fr.twitchat.action.enable-stt' })
export class EnableStt extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_ENABLE_STT');
	}
}

/**
 * Settings for {@link EnableStt}.
 */
type Settings = {};
