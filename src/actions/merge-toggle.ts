import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Merge toggle.
 */
@action({ UUID: 'fr.twitchat.action.merge-toggle' })
export class MergeToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_MERGE_TOGGLE');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.messageMergeEnabled) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link MergeToggle}.
 */
type Settings = {};
