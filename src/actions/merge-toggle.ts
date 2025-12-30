import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Merge toggle.
 */
@action({ UUID: 'fr.twitchat.action.merge-toggle' })
export class MergeToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_MERGE_TOGGLE');
	}
}

/**
 * Settings for {@link MergeToggle}.
 */
type Settings = {};
