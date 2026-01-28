import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Execute trigger.
 */
@action({ UUID: 'fr.twitchat.action.execute-trigger' })
export class ExecuteTrigger extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			TwitchatSocket.instance.broadcast('SET_EXECUTE_TRIGGER', { id: ev.payload.settings.triggerId });
		}
	}

	protected override onTriggerListUpdate(
		data: TwitchatEventMap['ON_TRIGGER_LIST'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const trigger = data?.triggerList.find((t) => t.id === settings.triggerId);

		this.setText(action, trigger?.name ?? '???');

		if (trigger?.disabled) {
			this.setDisabledState(action);
		} else if (!trigger) {
			this.setText(action, streamDeck.i18n.translate('missing-trigger'));
			this.setErrorState(action);
		} else {
			this.setEnabledState(action);
		}
	}
}

/**
 * Settings for {@link ExecuteTrigger}.
 */
type Settings = {
	triggerId: string;
};
