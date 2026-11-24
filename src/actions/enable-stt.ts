import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable voice control.
 */
@action({ UUID: 'fr.twitchat.action.enable-stt' })
export class EnableStt extends AbstractAction<Settings> {
	protected override readonly deprecated = true;

	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_VOICE_CONTROL_STATE', { enabled: true });
	}
}

/**
 * Settings for {@link EnableStt}.
 */
type Settings = {};
