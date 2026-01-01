import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

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
		TwitchatSocket.instance.broadcast('SET_QNA_SKIP', {
			id: ev.payload.settings.qnaId!,
		});
	}

	protected override onQnaSessionListUpdate(
		data: TwitchatEventMap['ON_QNA_SESSION_LIST'],
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const qnaSession = data.sessionList.find((q) => q.id === settings.qnaId);
		streamDeck.logger.debug('QnaSkip.onQnaSessionListUpdate', { qnaSession });
		if (!qnaSession) this.errorIcon(action);
		else this.resetIcon(action);
	}
}

/**
 * Settings for {@link QnaSkip}.
 */
type Settings = {
	qnaId?: string;
};
