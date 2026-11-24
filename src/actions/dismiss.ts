import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Things that can be dismissed, the event to send to do it,
 * and how to know if there's currently something to dismiss
 */
const TARGETS = {
	highlight: {
		event: 'SET_CLEAR_CHAT_HIGHLIGHT',
		isActive: (data: GlobalStates) => data.isMessageHighlighted,
	},
	alert: {
		event: 'SET_HIDE_CHAT_ALERT',
		isActive: (data: GlobalStates) => data.hasActiveChatAlert,
	},
	tts: {
		event: 'SET_STOP_CURRENT_TTS_AUDIO',
		isActive: (data: GlobalStates) => data.ttsSpeaking,
	},
	pinned: {
		event: 'SET_UNPIN_TWITCH_MESSAGE',
		isActive: (data: GlobalStates) => !!data.pinnedMessage,
	},
} as const;

/**
 * Action for Dismiss current highlighted message, !alert message, TTS or pinned message.
 * Replaces deprecated "clear-chat-highlight", "hide-alert", "stop-tts" and "unpin-twitch-message" actions.
 */
@action({ UUID: 'fr.twitchat.action.dismiss' })
export class Dismiss extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.payload.settings.dismissTarget) {
			ev.action.setSettings<Settings>({ ...ev.payload.settings, dismissTarget: 'highlight' });
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
			return;
		}
		const target = TARGETS[ev.payload.settings.dismissTarget] ?? TARGETS.highlight;
		TwitchatSocket.instance.broadcast(target.event);
	}

	protected override onGlobalStatesUpdate(
		data: GlobalStates | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const key = settings.dismissTarget in TARGETS ? settings.dismissTarget : 'highlight';
		this.setImage(action, `imgs/actions/dismiss/${key}.svg`);

		if (this._forceOfflineState || !data) return;

		// Show pinned message content
		if (key === 'pinned' && data.pinnedMessage) {
			this.setText(action, data.pinnedMessage.login.toUpperCase() + '\n' + data.pinnedMessage.text);
		} else {
			this.setText(action, '');
		}

		if (TARGETS[key].isActive(data)) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

type GlobalStates = TwitchatEventMap['ON_GLOBAL_STATES'];

/**
 * Settings for {@link Dismiss}.
 */
type Settings = {
	dismissTarget: keyof typeof TARGETS;
};
