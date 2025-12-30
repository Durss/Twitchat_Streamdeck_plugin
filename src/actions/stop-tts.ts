import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Stop tts.
 */
@action({ UUID: 'fr.twitchat.action.stop-tts' })
export class StopTts extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_STOP_CURRENT_TTS_AUDIO');
	}
}

/**
 * Settings for {@link StopTts}.
 */
type Settings = {};
