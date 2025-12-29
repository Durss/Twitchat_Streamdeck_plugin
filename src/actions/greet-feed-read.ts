import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Greet feed read.
 */
@action({ UUID: 'fr.twitchat.action.greet-feed-read' })
export class GreetFeedRead extends AbstractAction<Settings> {
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
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('GREET_FEED_READ', {
			messageCount: ev.payload.settings.readCount || 0,
		});
	}
}

/**
 * Settings for {@link GreetFeedRead}.
 */
type Settings = {
	readCount: number;
};
