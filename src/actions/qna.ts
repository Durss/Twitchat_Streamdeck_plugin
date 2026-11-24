import streamDeck, {
	action,
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	WillAppearEvent,
} from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Highlight or skip top-most Q&A entry.
 * Replaces deprecated "qna-highlight" and "qna-skip" actions.
 */
@action({ UUID: 'fr.twitchat.action.qna' })
export class Qna extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		if (!settings.qnaAction) {
			settings = { ...settings, qnaId: settings.qnaId ?? '', qnaAction: 'highlight' };
			ev.action.setSettings(settings);
		}
		this.updateIcon(ev.action, settings);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): void {
		super.onDidReceiveSettings(ev);
		this.updateIcon(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error') {
			ev.action.showAlert();
			return;
		}
		const id = ev.payload.settings.qnaId;
		if (ev.payload.settings.qnaAction === 'skip') {
			TwitchatSocket.instance.broadcast('SET_QNA_SKIP', { id });
		} else {
			TwitchatSocket.instance.broadcast('SET_QNA_HIGHLIGHT', { id });
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const qnaSession = data?.qnaSessionList.find((q) => q.id === settings.qnaId);
		if (!qnaSession) {
			this.setText(action, streamDeck.i18n.translate('missing-qna-session'));
			this.setErrorState(action);
		} else {
			this.setText(action, qnaSession.command);
			this.setEnabledState(action);
		}
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): void {
		if (settings.qnaAction === 'skip') {
			this.setImage(action, 'imgs/actions/qna/skip.svg');
		} else {
			this.setImage(action, 'imgs/actions/qna/icon.svg');
		}
	}
}

/**
 * Settings for {@link Qna}.
 */
type Settings = {
	qnaId: string;
	qnaAction: 'highlight' | 'skip';
};
