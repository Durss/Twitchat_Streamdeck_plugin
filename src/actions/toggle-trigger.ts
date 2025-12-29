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
		let enabled = undefined;
		switch (ev.payload.settings.triggerAction) {
			case 'ENABLE':
				enabled = true;
				break;
			case 'DISABLE':
				enabled = false;
				break;
		}
		TwitchatSocket.instance.broadcast('TOGGLE_TRIGGER_STATE', {
			id: ev.payload.settings.triggerId,
			forcedState: enabled,
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
