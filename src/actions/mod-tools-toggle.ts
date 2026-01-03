import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Mod tools toggle.
 */
@action({ UUID: 'fr.twitchat.action.mod-tools-toggle' })
export class ModToolsToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_MOD_TOOLS_TOGGLE');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.moderationToolsVisible) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link ModToolsToggle}.
 */
type Settings = {};
