import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable/Disable voice control.
 */
@action({ UUID: 'fr.twitchat.action.voice-control' })
export class VoiceControl extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this._forceOfflineState) return;

		TwitchatSocket.instance.broadcast('SET_VOICE_CONTROL_STATE', {});
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.voiceControlEnabled) {
			this.setImage(action, 'imgs/actions/voice-control/icon.svg');
			this.setEnabledState(action);
		} else {
			this.setImage(action, 'imgs/actions/voice-control/disabled.svg');
			this.setDisabledState(action);
		}
	}
}

/**
 * Settings for {@link VoiceControl}.
 */
type Settings = {};
