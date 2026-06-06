import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
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

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const trigger = data?.triggerList.find((t) => t.id === settings.triggerId);

		this.setText(action, trigger?.name ?? '???');

		if (!trigger) {
			this.setText(action, streamDeck.i18n.translate('missing-trigger'));
			this.setErrorState(action);
			this.setToggleState(action, null);
		} else {
			if (trigger.iconUrl) {
				this.setImageUrl(action, trigger.iconUrl);
			} else {
				this.setImageUrl(action, '');
			}
			if (trigger.iconEmoji) {
				this.setImageEmoji(action, trigger.iconEmoji);
			} else {
				this.setImageEmoji(action, '');
			}
			if (trigger.enabled) {
				this.setEnabledState(action);
			} else {
				this.setDisabledState(action);
			}
			this.setToggleState(action, trigger.enabled);
		}
	}
}

/**
 * Settings for {@link ToggleTrigger}.
 */
type Settings = {
	triggerId: string;
	triggerAction: 'ENABLE' | 'DISABLE' | 'TOGGLE';
};
