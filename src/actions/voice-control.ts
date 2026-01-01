import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable/Disable voice control.
 */
@action({ UUID: 'fr.twitchat.action.voice-control' })
export class VoiceControl extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = ev.payload.settings;
		settings.enabled = !settings.enabled;
		ev.action.setSettings(settings);
		TwitchatSocket.instance.broadcast('SET_VOICE_CONTROL_STATE', {
			enabled: settings.enabled,
		});
		if (settings.enabled) {
			ev.action.setImage('imgs/actions/voice-control/icon.svg');
		} else {
			ev.action.setImage('imgs/actions/voice-control/disabled.svg');
			// this.fadeIcon(ev.action);
		}
	}
}

/**
 * Settings for {@link VoiceControl}.
 */
type Settings = {
	enabled: boolean;
};
