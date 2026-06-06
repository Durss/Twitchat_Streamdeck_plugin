import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Qna highlight.
 */
@action({ UUID: 'fr.twitchat.action.qna-highlight' })
export class QnaHighlight extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.qnaId) {
			ev.action.setSettings({
				qnaId: '',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error') {
			ev.action.showAlert();
		} else {
			TwitchatSocket.instance.broadcast('SET_QNA_HIGHLIGHT', {
				id: ev.payload.settings.qnaId!,
			});
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
}

/**
 * Settings for {@link QnaHighlight}.
 */
type Settings = {
	qnaId?: string;
};
