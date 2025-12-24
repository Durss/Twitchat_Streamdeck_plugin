import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Qna highlight.
 */
@action({ UUID: "fr.twitchat.action.qna-highlight" })
export class QnaHighlight extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("QNA_HIGHLIGHT");
	}
}

/**
 * Settings for {@link QnaHighlight}.
 */
type Settings = {};
