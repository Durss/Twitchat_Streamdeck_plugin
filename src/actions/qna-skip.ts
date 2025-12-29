import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Qna skip.
 */
@action({ UUID: 'fr.twitchat.action.qna-skip' })
export class QnaSkip extends AbstractAction<Settings> {
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
		TwitchatSocket.instance.broadcast('QNA_SKIP', {
			qnaId: ev.payload.settings.qnaId!,
		});
	}
}

/**
 * Settings for {@link QnaSkip}.
 */
type Settings = {
	qnaId?: string;
};
