import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
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

	protected override onQnaSessionListUpdate(
		data: TwitchatEventMap['ON_QNA_SESSION_LIST'],
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const qnaSession = data.sessionList.find((q) => q.id === settings.qnaId);
		if (!qnaSession) this.setErrorState(action);
		else this.setEnabled(action);
	}
}

/**
 * Settings for {@link QnaHighlight}.
 */
type Settings = {
	qnaId?: string;
};
