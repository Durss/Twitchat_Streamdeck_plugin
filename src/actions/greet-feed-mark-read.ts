import { action, DialAction, DidReceiveSettingsEvent, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Remove messages from "Greet them" section.
 * Replaces deprecated "greet-feed-read" and "greet-feed-read-all" actions.
 */
@action({ UUID: 'fr.twitchat.action.greet-feed-mark-read' })
export class GreetFeedMarkRead extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		if (!settings.readMode) {
			settings = { ...settings, readCount: settings.readCount ?? 1, readMode: 'count' };
			ev.action.setSettings(settings);
		}
		this.updateIcon(ev.action, settings);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): void {
		super.onDidReceiveSettings(ev);
		this.updateIcon(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (ev.payload.settings.readMode === 'all') {
			TwitchatSocket.instance.broadcast('SET_GREET_FEED_READ_ALL');
		} else {
			TwitchatSocket.instance.broadcast('SET_GREET_FEED_READ', {
				messageCount: ev.payload.settings.readCount || 1,
			});
		}
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): void {
		if (settings.readMode === 'all') {
			this.setImage(action, 'imgs/actions/greet-feed-mark-read/all.svg');
		} else {
			this.setImage(action, 'imgs/actions/greet-feed-mark-read/icon.svg');
		}
	}
}

/**
 * Settings for {@link GreetFeedMarkRead}.
 */
type Settings = {
	/**
	 * Remove "readCount" messages, or all of them
	 */
	readMode: 'count' | 'all';
	readCount: number;
};
