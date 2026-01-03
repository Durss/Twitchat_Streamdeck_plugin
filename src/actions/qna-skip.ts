import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Qna skip.
 */
@action({ UUID: 'fr.twitchat.action.qna-skip' })
export class QnaSkip extends AbstractAction<Settings> {
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
			TwitchatSocket.instance.broadcast('SET_QNA_SKIP', {
				id: ev.payload.settings.qnaId!,
			});
		}
	}

	protected override onQnaSessionListUpdate(
		data: TwitchatEventMap['ON_QNA_SESSION_LIST'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const qnaSession = data?.sessionList.find((q) => q.id === settings.qnaId);
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
 * Settings for {@link QnaSkip}.
 */
type Settings = {
	qnaId?: string;
};
