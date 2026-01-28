import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

/**
 * Action for Automod accept.
 */
@action({ UUID: 'fr.twitchat.action.automod-accept' })
export class AutomodAccept extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(_ev.action) === 'disabled') {
			_ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast('SET_AUTOMOD_ACCEPT');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.pendingAutomodMessage) {
			this.setText(action, data.pendingAutomodMessage.user.login.toUpperCase() + '\n' + data.pendingAutomodMessage.message);
		} else {
			this.setText(action, '');
		}

		if (data?.pendingAutomodMessage) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link AutomodAccept}.
 */
type Settings = {};
