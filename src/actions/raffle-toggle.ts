import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Raffle toggle.
 */
@action({ UUID: 'fr.twitchat.action.raffle-toggle' })
export class RaffleToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_RAFFLE_TOGGLE');
	}
}

/**
 * Settings for {@link RaffleToggle}.
 */
type Settings = {};
