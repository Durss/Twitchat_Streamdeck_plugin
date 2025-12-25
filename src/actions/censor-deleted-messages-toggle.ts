import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Censor deleted messages toggle.
 */
@action({ UUID: 'fr.twitchat.action.censor-deleted-messages-toggle' })
export class CensorDeletedMessagesToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('CENSOR_DELETED_MESSAGES_TOGGLE');
	}
}

/**
 * Settings for {@link CensorDeletedMessagesToggle}.
 */
type Settings = {};
