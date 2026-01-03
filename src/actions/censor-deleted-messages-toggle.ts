import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Censor deleted messages toggle.
 */
@action({ UUID: 'fr.twitchat.action.censor-deleted-messages-toggle' })
export class CensorDeletedMessagesToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CENSOR_DELETED_MESSAGES_TOGGLE');
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.censorshipEnabled) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link CensorDeletedMessagesToggle}.
 */
type Settings = {};
