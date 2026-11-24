import { action, DialAction, DidReceiveSettingsEvent, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Accept or reject last automoded message.
 * Replaces deprecated "automod-accept" and "automod-reject" actions.
 */
@action({ UUID: 'fr.twitchat.action.automod' })
export class Automod extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		if (!settings.automodAction) {
			settings = { ...settings, automodAction: 'accept' };
			ev.action.setSettings(settings);
		}
		this.updateIcon(ev.action, settings);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): void {
		super.onDidReceiveSettings(ev);
		this.updateIcon(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
			return;
		}
		if (ev.payload.settings.automodAction === 'reject') {
			TwitchatSocket.instance.broadcast('SET_AUTOMOD_REJECT');
		} else {
			TwitchatSocket.instance.broadcast('SET_AUTOMOD_ACCEPT');
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.pendingAutomodMessage) {
			this.setText(action, data.pendingAutomodMessage.user.login.toUpperCase() + '\n' + data.pendingAutomodMessage.message);
			this.setEnabledState(action);
		} else {
			this.setText(action, '');
			this.setDisabledState(action);
		}
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): void {
		if (settings.automodAction === 'reject') {
			this.setImage(action, 'imgs/actions/automod/reject.svg');
		} else {
			this.setImage(action, 'imgs/actions/automod/icon.svg');
		}
	}
}

/**
 * Settings for {@link Automod}.
 */
type Settings = {
	automodAction: 'accept' | 'reject';
};
