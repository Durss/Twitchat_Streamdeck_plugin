import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

/**
 * Action for Unpin Twitch message.
 */
@action({ UUID: 'fr.twitchat.action.unpin-twitch-message' })
export class UnpinTwitchMessage extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(_ev.action) === 'disabled') {
			_ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast('SET_UNPIN_TWITCH_MESSAGE');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.pinnedMessage) {
			this.setText(action, data.pinnedMessage.login.toUpperCase() + '\n' + data.pinnedMessage.text);
			this.setEnabledState(action);
		} else {
			this.setText(action, '');
			this.setDisabledState(action);
		}
	}
}

/**
 * Settings for {@link UnpinTwitchMessage}.
 */
type Settings = {};
