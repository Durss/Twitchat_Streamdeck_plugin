import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

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
		TwitchatSocket.instance.broadcast('SET_QNA_HIGHLIGHT', {
			id: ev.payload.settings.qnaId!,
		});
	}

	protected override onQnaSessionListUpdate(
		data: TwitchatEventMap['ON_QNA_SESSION_LIST'],
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const qnaSession = data.sessionList.find((q) => q.id === settings.qnaId);
		streamDeck.logger.debug('QnaHighlight.onQnaSessionListUpdate', { qnaSession });
		if (!qnaSession) this.errorIcon(action);
		else this.resetIcon(action);
	}
}

/**
 * Settings for {@link QnaHighlight}.
 */
type Settings = {
	qnaId?: string;
};
