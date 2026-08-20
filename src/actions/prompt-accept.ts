import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

/**
 * Action for Validate a prompt window.
 */
@action({ UUID: 'fr.twitchat.action.prompt-accept' })
export class PromptAccept extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(_ev.action) === 'disabled') {
			_ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast('SET_PROMPT_PARAMS_ACCEPT');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.currentPrompt) {
			this.setText(action, data.currentPrompt.title);
		} else {
			this.setText(action, '');
		}

		if (data?.currentPrompt) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link PromptAccept}.
 */
type Settings = {};
