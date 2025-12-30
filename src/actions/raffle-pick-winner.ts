import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Raffle pick winner.
 */
@action({ UUID: 'fr.twitchat.action.raffle-pick-winner' })
export class RafflePickWinner extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_RAFFLE_PICK_WINNER');
	}
}

/**
 * Settings for {@link RafflePickWinner}.
 */
type Settings = {};
