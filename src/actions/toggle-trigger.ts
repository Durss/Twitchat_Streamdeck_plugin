import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Toggle trigger.
 */
@action({ UUID: 'fr.twitchat.action.toggle-trigger' })
export class ToggleTrigger extends AbstractAction<Settings> {
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
		TwitchatSocket.instance.broadcast('SET_TRIGGER_STATE', {
			id: ev.payload.settings.triggerId,
			forcedState: enabled,
		});
	}

	protected override onTriggerListUpdate(
		data: TwitchatEventMap['ON_TRIGGER_LIST'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const trigger = data?.triggerList.find((t) => t.id === settings.triggerId);
		if (trigger?.disabled) this.setDisabledState(action);
		else this.setEnabledState(action);
	}
}

/**
 * Settings for {@link ToggleTrigger}.
 */
type Settings = {
	triggerId: string;
	triggerAction: 'ENABLE' | 'DISABLE' | 'TOGGLE';
};
