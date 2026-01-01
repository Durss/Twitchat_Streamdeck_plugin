import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Execute trigger.
 */
@action({ UUID: 'fr.twitchat.action.execute-trigger' })
export class ExecuteTrigger extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_EXECUTE_TRIGGER', { id: ev.payload.settings.triggerId });
	}

	protected override onTriggerListUpdate(
		data: TwitchatEventMap['ON_TRIGGER_LIST'],
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const trigger = data.triggerList.find((t) => t.id === settings.triggerId);
		if (trigger?.disabled) this.setDisabledState(action);
		else this.setEnabled(action);
	}
}

/**
 * Settings for {@link ExecuteTrigger}.
 */
type Settings = {
	triggerId: string;
};
