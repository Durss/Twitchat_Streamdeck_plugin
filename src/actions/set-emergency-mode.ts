import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Set emergency mode.
 */
@action({ UUID: 'fr.twitchat.action.set-emergency-mode' })
export class SetEmergencyMode extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_EMERGENCY_MODE', undefined);
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.emergencyMode) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link SetEmergencyMode}.
 */
type Settings = {};
