import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Qna highlight.
 */
@action({ UUID: 'fr.twitchat.action.qna-highlight' })
export class QnaHighlight extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.qnaId) {
			ev.action.setSettings({
				qnaId: '',
			});
		}
		this.subscribeTo('QNA');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_QNA_HIGHLIGHT', {
			id: ev.payload.settings.qnaId!,
		});
	}
}

/**
 * Settings for {@link QnaHighlight}.
 */
type Settings = {
	qnaId?: string;
};
