import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Prediction toggle.
 */
@action({ UUID: 'fr.twitchat.action.prediction-toggle' })
export class PredictionToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('PREDICTION_TOGGLE');
	}
}

/**
 * Settings for {@link PredictionToggle}.
 */
type Settings = {};
