import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { UUID } from '../Utils';
import { AbstractAction } from './AbstractActions';
import { setTimeout } from 'timers';

/**
 * Action for Write animated text.
 */
@action({ UUID: 'fr.twitchat.action.set-animated-text' })
export class SetAnimatedText extends AbstractAction<Settings> {
	private _disabledMap: Map<string, boolean> = new Map();
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			this._disabledMap.set(ev.action.id, true);
			this.setDisabledState(ev.action);
			setTimeout(() => {
				this._disabledMap.delete(ev.action.id);
				this.setEnabledState(ev.action);
			}, 1500);
			TwitchatSocket.instance.broadcast('SET_ANIMATED_TEXT_CONTENT_FROM_SD', {
				queryId: UUID(),
				id: ev.payload.settings.animatedTextId,
				text: ev.payload.settings.message,
				autoHide: ev.payload.settings.autoHide == true,
			});
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const overlay = data?.animatedTextList.find((t) => t.id === settings.animatedTextId);
		if (this._disabledMap.get(action.id)) {
			this.setDisabledState(action);
			return;
		}
		this.setText(action, overlay?.name || '');
		if (!overlay) {
			this.setText(action, streamDeck.i18n.translate('missing-overlay'));
			this.setErrorState(action);
		} else if (!overlay.enabled) {
			this.setDisabledState(action);
		} else {
			this.setEnabledState(action);
		}
	}
}

/**
 * Settings for {@link SetAnimatedText}.
 */
type Settings = {
	animatedTextId: string;
	message: string;
	autoHide: boolean;
};
