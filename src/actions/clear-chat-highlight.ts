import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Clear chat highlight.
 */
@action({ UUID: 'fr.twitchat.action.clear-chat-highlight' })
export class ClearChatHighlight extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			TwitchatSocket.instance.broadcast('SET_CLEAR_CHAT_HIGHLIGHT');
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		if (data?.isMessageHighlighted) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

/**
 * Settings for {@link ClearChatHighlight}.
 */
type Settings = {};
