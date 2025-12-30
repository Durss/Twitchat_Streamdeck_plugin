import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Greet feed read all.
 */
@action({ UUID: 'fr.twitchat.action.greet-feed-read-all' })
export class GreetFeedReadAll extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_GREET_FEED_READ_ALL');
	}
}

/**
 * Settings for {@link GreetFeedReadAll}.
 */
type Settings = {};
