import { action, DialAction, DidReceiveSettingsEvent, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Validate or reject a prompt window.
 * Replaces deprecated "prompt-accept" and "prompt-reject" actions.
 */
@action({ UUID: 'fr.twitchat.action.prompt' })
export class Prompt extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		if (!settings.promptAction) {
			settings = { ...settings, promptAction: 'accept' };
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
		if (ev.payload.settings.promptAction === 'reject') {
			TwitchatSocket.instance.broadcast('SET_PROMPT_PARAMS_REJECT');
		} else {
			TwitchatSocket.instance.broadcast('SET_PROMPT_PARAMS_ACCEPT');
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.currentPrompt) {
			this.setText(action, data.currentPrompt.title);
			this.setEnabledState(action);
		} else {
			this.setText(action, '');
			this.setDisabledState(action);
		}
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): void {
		if (settings.promptAction === 'reject') {
			this.setImage(action, 'imgs/actions/prompt/reject.svg');
		} else {
			this.setImage(action, 'imgs/actions/prompt/icon.svg');
		}
	}
}

/**
 * Settings for {@link Prompt}.
 */
type Settings = {
	promptAction: 'accept' | 'reject';
};
