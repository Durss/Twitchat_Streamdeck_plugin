import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Toggle trigger.
 */
@action({ UUID: 'fr.twitchat.action.toggle-trigger' })
export class ToggleTrigger extends AbstractAction<Settings> {
	override onWillAppear(_ev: WillAppearEvent<Settings>): void {
		this.subscribeTo('TRIGGERS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('TOGGLE_TRIGGER', {
			triggerId: ev.payload.settings.triggerId,
			triggerAction: ev.payload.settings.triggerAction,
		});
	}
}

/**
 * Settings for {@link ToggleTrigger}.
 */
type Settings = {
	triggerId: string;
	triggerAction: 'ENABLE' | 'DISABLE' | 'TOGGLE';
};
