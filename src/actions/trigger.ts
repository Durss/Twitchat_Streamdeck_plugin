import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Execute, enable or disable a trigger.
 * Replaces deprecated "execute-trigger" and "toggle-trigger" actions.
 */
@action({ UUID: 'fr.twitchat.action.trigger' })
export class Trigger extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.payload.settings.triggerAction) {
			ev.action.setSettings<Settings>({
				...ev.payload.settings,
				triggerId: ev.payload.settings.triggerId ?? '',
				triggerAction: 'EXECUTE',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = ev.payload.settings;
		const state = this.getActionState(ev.action);
		const isExecute = !settings.triggerAction || settings.triggerAction === 'EXECUTE';

		// A disabled trigger can still be enabled/disabled, but not executed
		if (state === 'error' || (isExecute && state === 'disabled')) {
			ev.action.showAlert();
			return;
		}

		if (isExecute) {
			TwitchatSocket.instance.broadcast('SET_EXECUTE_TRIGGER', { id: settings.triggerId });
		} else {
			let forcedState: boolean | undefined = undefined;
			if (settings.triggerAction === 'ENABLE') forcedState = true;
			if (settings.triggerAction === 'DISABLE') forcedState = false;
			TwitchatSocket.instance.broadcast('SET_TRIGGER_STATE', { id: settings.triggerId, forcedState });
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const isExecute = !settings.triggerAction || settings.triggerAction === 'EXECUTE';
		const trigger = data?.triggerList.find((t) => t.id === settings.triggerId);

		this.setImage(action, isExecute ? 'imgs/actions/trigger/icon.svg' : 'imgs/actions/trigger/toggle.svg');

		// Use trigger's own icon if any
		if (trigger?.iconUrl) {
			this.setImageUrl(action, trigger.iconUrl);
			this.setImageEmoji(action, '');
		} else if (trigger?.iconEmoji) {
			this.setImageEmoji(action, trigger.iconEmoji);
			this.setImageUrl(action, '');
		} else {
			this.setImageEmoji(action, '');
			this.setImageUrl(action, '');
		}

		if (!trigger) {
			this.setText(action, streamDeck.i18n.translate('missing-trigger'));
			this.setErrorState(action);
			this.setToggleState(action, null);
			return;
		}

		this.setText(action, trigger.name);
		if (trigger.enabled) {
			this.setEnabledState(action);
		} else {
			this.setDisabledState(action);
		}
		// Only show the on/off indicator when the button changes the trigger's state
		this.setToggleState(action, isExecute ? null : trigger.enabled);
	}
}

/**
 * Settings for {@link Trigger}.
 */
type Settings = {
	triggerId: string;
	triggerAction: 'EXECUTE' | 'ENABLE' | 'DISABLE' | 'TOGGLE';
};
