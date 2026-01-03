import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Hide alert.
 */
@action({ UUID: 'fr.twitchat.action.hide-alert' })
export class HideAlert extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			TwitchatSocket.instance.broadcast('SET_HIDE_CHAT_ALERT');
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.hasActiveChatAlert) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link HideAlert}.
 */
type Settings = {};
