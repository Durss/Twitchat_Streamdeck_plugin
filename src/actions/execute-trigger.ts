import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Execute trigger.
 */
@action({ UUID: 'fr.twitchat.action.execute-trigger' })
export class ExecuteTrigger extends AbstractAction<Settings> {
	override onWillAppear(_ev: WillAppearEvent<Settings>): void {
		this.subscribeTo('TRIGGERS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_EXECUTE_TRIGGER', { id: ev.payload.settings.triggerId });
	}
}

/**
 * Settings for {@link ExecuteTrigger}.
 */
type Settings = {
	triggerId: string;
};
