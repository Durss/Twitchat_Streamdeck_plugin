import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed scroll down.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-scroll-down' })
export class ChatFeedScrollDown extends AbstractAction<Settings> {
	/**
	 * Init action
	 */
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.scrollAmount) {
			ev.action.setSettings({
				scrollAmount: 50,
			});
		}
		this.setDeprecatedState(ev.action);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
			scrollBy: ev.payload.settings.scrollAmount || 50,
			colIndex: ev.payload.settings.colIndex || 0,
			mode: 'pixels',
		});
	}
}

/**
 * Settings for {@link ChatFeedScrollDown}.
 */
type Settings = {
	scrollAmount: number;
	colIndex: number;
};
