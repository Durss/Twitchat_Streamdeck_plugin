import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Bingo toggle.
 */
@action({ UUID: 'fr.twitchat.action.bingo-toggle' })
export class BingoToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('BINGO_TOGGLE');
	}
}

/**
 * Settings for {@link BingoToggle}.
 */
type Settings = {};
