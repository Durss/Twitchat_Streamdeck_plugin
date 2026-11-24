import streamDeck, {
	action,
	DialAction,
	DialDownEvent,
	DialRotateEvent,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	TouchTapEvent,
	WillAppearEvent,
} from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Control a chat column.
 * Replaces deprecated "chat-feed-pause", "chat-feed-scroll", "chat-feed-read",
 * "chat-feed-read-all" and "chat-feed-read-encoder" actions.
 *
 * Key:
 *   pause  => pause/unpause the column
 *   scroll => scroll the column by "scrollAmount" pixels
 *   read   => mark "readCount" messages as read, or all of them depending on "readMode"
 * Dial ("pause" isn't available on dials):
 *   scroll => rotate to scroll, push/touch to scroll to the bottom
 *   read   => rotate to move the read marker, push/touch to mark all messages as read
 */
@action({ UUID: 'fr.twitchat.action.chat-feed-control' })
export class ChatFeedControl extends AbstractAction<Settings> {
	private _lastStates: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined;

	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		// "pause" isn't available on dials
		const invalidDialAction = ev.action.isDial() && settings.chatAction === 'pause';
		if (!settings.chatAction || invalidDialAction) {
			settings = {
				...settings,
				colIndex: settings.colIndex ?? 0,
				// Pausing is the most common use of a key, scrolling the most common use of a dial
				chatAction: ev.action.isDial() ? 'scroll' : 'pause',
				scrollAmount: settings.scrollAmount ?? -150,
				readMode: settings.readMode ?? 'count',
				readCount: settings.readCount ?? 1,
			};
			ev.action.setSettings(settings);
		}
		this.updateRender(ev.action, settings);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): void {
		super.onDidReceiveSettings(ev);
		this.updateRender(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = ev.payload.settings;
		const colIndex = settings.colIndex || 0;
		switch (settings.chatAction) {
			case 'scroll':
				TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
					colIndex,
					scrollBy: settings.scrollAmount || -150,
					mode: 'pixels',
				});
				break;
			case 'read':
				if (settings.readMode === 'all') {
					TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ_ALL', { colIndex });
				} else {
					TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ', { colIndex, count: settings.readCount || 1 });
				}
				break;
			case 'pause':
			default:
				TwitchatSocket.instance.broadcast('SET_CHAT_FEED_PAUSE_STATE', { colIndex });
				break;
		}
	}

	override async onDialRotate(ev: DialRotateEvent<Settings>): Promise<void> {
		const colIndex = ev.payload.settings.colIndex || 0;
		if (ev.payload.settings.chatAction === 'read') {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ', { colIndex, count: ev.payload.ticks });
		} else {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL', {
				colIndex,
				scrollBy: ev.payload.ticks,
				mode: 'messages',
			});
		}
	}

	override onDialDown(ev: DialDownEvent<Settings>): void {
		this.onDialPress(ev.payload.settings);
	}

	override onTouchTap(ev: TouchTapEvent<Settings>): void {
		this.onDialPress(ev.payload.settings);
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		this._lastStates = data;
		// Only the pause icon depends on Twitchat's states, no need to reset dial's layout
		this.updateRender(action, settings, false);
	}

	/**
	 * Dial pushed or touch screen tapped
	 */
	private onDialPress(settings: Settings): void {
		const colIndex = settings.colIndex || 0;
		if (settings.chatAction === 'read') {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_READ_ALL', { colIndex });
		} else {
			TwitchatSocket.instance.broadcast('SET_CHAT_FEED_SCROLL_BOTTOM', { colIndex });
		}
	}

	/**
	 * Updates icon and dial title depending on the selected action
	 */
	private updateRender(action: DialAction<{}> | KeyAction<{}>, settings: Settings, updateDialLayout = true): void {
		let colIndex = settings.colIndex || 0;
		if (typeof colIndex == 'string') colIndex = parseInt(colIndex);
		let chatAction = settings.chatAction || (action.isDial() ? 'scroll' : 'pause');
		// "pause" isn't available on dials
		if (action.isDial() && chatAction === 'pause') chatAction = 'scroll';
		const folder = 'imgs/actions/chat-feed-control/';

		let icon = 'icon.svg';
		let titleKey = 'chat-feed-scroll';
		switch (chatAction) {
			case 'pause':
				icon = this._lastStates?.chatColConfs?.[colIndex]?.paused ? 'unpause.svg' : 'pause.svg';
				titleKey = 'chat-feed-pause';
				break;
			case 'scroll':
				if (action.isKey()) icon = settings.scrollAmount > 0 ? 'scroll-down.svg' : 'scroll-up.svg';
				titleKey = 'chat-feed-scroll';
				break;
			case 'read':
				if (action.isDial()) icon = 'read-encoder.svg';
				else icon = settings.readMode === 'all' ? 'read-all.svg' : 'read.svg';
				titleKey = 'chat-feed-read';
				break;
		}

		if (action.isDial() && updateDialLayout) {
			action.setFeedbackLayout('$X1');
			action.setFeedback({
				title: { value: streamDeck.i18n.translate(titleKey) + ' (' + (colIndex + 1) + ')' },
			});
		}
		this.setImage(action, folder + icon);
	}
}

/**
 * Settings for {@link ChatFeedControl}.
 */
type Settings = {
	colIndex: number;
	chatAction: 'pause' | 'scroll' | 'read';
	/**
	 * Key + "scroll" only: pixels to scroll by. Negative to scroll up
	 */
	scrollAmount: number;
	/**
	 * Key + "read" only: mark "readCount" messages as read, or all of them
	 */
	readMode: 'count' | 'all';
	/**
	 * Key + "read" only: number of messages to mark as read
	 */
	readCount: number;
};
