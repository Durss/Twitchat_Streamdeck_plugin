import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Greet feed read.
 */
@action({ UUID: "fr.twitchat.action.greet-feed-read" })
export class GreetFeedRead extends SingletonAction<Settings> {

	/**
	 * Sets the initial action image, stores the action for auto-updating, and establishes a timer for auto-updating.
	 */
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		// Verify that the action is a key so we can call setRandomCat.
		if (!ev.action.isKey()) return;
		if(!ev.payload.settings.readCount) {
			ev.action.setSettings({
				readCount: 1
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("GREET_FEED_READ", { readCount: ev.payload.settings.readCount || 0 });
	}
}

/**
 * Settings for {@link GreetFeedRead}.
 */
type Settings = {
	readCount:number
};
