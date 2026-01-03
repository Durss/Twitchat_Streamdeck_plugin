import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Shoutout.
 */
@action({ UUID: 'fr.twitchat.action.shoutout' })
export class Shoutout extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(_ev.action) === 'disabled') {
			_ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast('SET_SHOUTOUT_LAST_RAIDER');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.lastRaiderName) {
			this.setText(action, data.lastRaiderName);
		}

		if (data?.lastRaiderName) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link Shoutout}.
 */
type Settings = {};
