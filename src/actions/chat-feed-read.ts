import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed read.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-read' })
export class ChatFeedRead extends AbstractAction<Settings> {
	/**
	 * Init action
	 */
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.readCount) {
			ev.action.setSettings({
				readCount: 1,
			});
		}
		this.subscribeTo('COLUMNS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ', {
			count: ev.payload.settings.readCount || 1,
			colIndex: ev.payload.settings.colIndex || 0,
		});
	}
}

/**
 * Settings for {@link ChatFeedRead}.
 */
type Settings = {
	readCount: number;
	colIndex: number;
};
