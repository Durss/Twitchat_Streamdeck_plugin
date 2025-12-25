import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Poll toggle.
 */
@action({ UUID: 'fr.twitchat.action.poll-toggle' })
export class PollToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('POLL_TOGGLE');
	}
}

/**
 * Settings for {@link PollToggle}.
 */
type Settings = {};
