import streamDeck, {
	action,
	DialAction,
	DialRotateEvent,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	TouchTapEvent,
	WillAppearEvent,
} from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Chat feed scroll.
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-scroll' })
export class ChatFeedScroll extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		if (ev.action.isDial()) {
			let colIndex = ev.payload.settings.colIndex || 0;
			if (typeof colIndex == 'string') colIndex = parseInt(colIndex);
			ev.action.setFeedbackLayout('$X1');
			ev.action.setFeedback({
				title: { value: streamDeck.i18n.translate('chat-feed-scroll') + ' (' + (colIndex + 1) + ')' },
			});
		} else {
			if (!ev.payload.settings.scrollAmount) {
				ev.action.setSettings({
					scrollAmount: -150,
				});
			}

			ev.action.getSettings().then((settings: Settings) => {
				this.updateIcon(ev.action, settings);
			});
		}
		super.onWillAppear(ev);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (ev.action.isKey()) {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
				colIndex: ev.payload.settings.colIndex || 0,
				scrollBy: ev.payload.settings.scrollAmount || 50,
				mode: 'pixels',
			});
		}
	}

	override onTouchTap(ev: TouchTapEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL_BOTTOM', {
			colIndex: ev.payload.settings.colIndex || 0,
		});
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
			colIndex: ev.payload.settings.colIndex || 0,
			scrollBy: ev.payload.ticks,
			mode: 'messages',
		});
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): Promise<void> | void {
		super.onDidReceiveSettings(ev);
		this.updateIcon(ev.action, ev.payload.settings);
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): Promise<void> | void {
		if (settings.scrollAmount > 0) {
			this.updateImage(action, 'imgs/actions/chat-feed-scroll/down.svg');
		} else {
			this.updateImage(action, 'imgs/actions/chat-feed-scroll/up.svg');
		}
		streamDeck.logger.debug(`[ChatFeedScroll] New settings received: ${JSON.stringify(settings)}`);
	}
}

/**
 * Settings for {@link ChatFeedScroll}.
 */
type Settings = {
	colIndex: number;
	scrollAmount: number;
};
