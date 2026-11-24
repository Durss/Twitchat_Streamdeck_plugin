import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Available chat options, the event to send to toggle them and how to read their current state
 */
const OPTIONS = {
	merge: {
		event: 'SET_MERGE_TOGGLE',
		isEnabled: (data: GlobalStates) => data.messageMergeEnabled,
	},
	censor: {
		event: 'SET_CENSOR_DELETED_MESSAGES_TOGGLE',
		isEnabled: (data: GlobalStates) => data.censorshipEnabled,
	},
	'mod-tools': {
		event: 'SET_MOD_TOOLS_TOGGLE',
		isEnabled: (data: GlobalStates) => data.moderationToolsVisible,
	},
	'viewers-count': {
		event: 'SET_VIEWERS_COUNT_TOGGLE',
		isEnabled: (data: GlobalStates) => data.showViewerCount,
	},
} as const;

/**
 * Action for Toggle a chat option.
 * Replaces deprecated "merge-toggle", "censor-deleted-messages-toggle",
 * "mod-tools-toggle" and "viewers-count-toggle" actions.
 */
@action({ UUID: 'fr.twitchat.action.toggle-chat-option' })
export class ToggleChatOption extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.payload.settings.chatOption) {
			ev.action.setSettings<Settings>({ ...ev.payload.settings, chatOption: 'merge' });
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const option = OPTIONS[ev.payload.settings.chatOption] ?? OPTIONS.merge;
		TwitchatSocket.instance.broadcast(option.event);
	}

	protected override onGlobalStatesUpdate(
		data: GlobalStates | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const key = settings.chatOption in OPTIONS ? settings.chatOption : 'merge';
		this.setImage(action, `imgs/actions/toggle-chat-option/${key}.svg`);

		if (this._forceOfflineState || !data) return;

		if (OPTIONS[key].isEnabled(data)) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

type GlobalStates = TwitchatEventMap['ON_GLOBAL_STATES'];

/**
 * Settings for {@link ToggleChatOption}.
 */
type Settings = {
	chatOption: keyof typeof OPTIONS;
};
