import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Prediction toggle.
 */
@action({ UUID: "fr.twitchat.action.prediction-toggle" })
export class PredictionToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("PREDICTION_TOGGLE");
	}
}

/**
 * Settings for {@link PredictionToggle}.
 */
type Settings = {};
