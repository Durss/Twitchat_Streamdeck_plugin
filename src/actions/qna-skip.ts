import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Qna skip.
 */
@action({ UUID: "fr.twitchat.action.qna-skip" })
export class QnaSkip extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("QNA_SKIP");
	}
}

/**
 * Settings for {@link QnaSkip}.
 */
type Settings = {};
