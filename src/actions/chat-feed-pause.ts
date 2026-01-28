import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed pause.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-pause' })
export class ChatFeedPause extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_PAUSE_STATE', { colIndex: ev.payload.settings.colIndex || 0 });
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		const colIndex = _settings.colIndex || 0;
		if (data?.chatColConfs?.[colIndex]?.paused) {
			this.setImage(action, 'imgs/actions/chat-feed-pause/unpause.svg');
		} else {
			this.setImage(action, 'imgs/actions/chat-feed-pause/icon.svg');
		}
	}
}

/**
 * Settings for {@link ChatFeedPause}.
 */
type Settings = {
	colIndex: number;
};
