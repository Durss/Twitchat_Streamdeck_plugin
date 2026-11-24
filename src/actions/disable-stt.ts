import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Disable voice control.
 */
@action({ UUID: 'fr.twitchat.action.disable-stt' })
export class DisableStt extends AbstractAction<Settings> {
	protected override readonly deprecated = true;

	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_VOICE_CONTROL_STATE', { enabled: false });
	}
}

/**
 * Settings for {@link DisableStt}.
 */
type Settings = {};
