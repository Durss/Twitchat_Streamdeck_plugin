import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { UUID } from '../Utils';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Write animated text.
 */
@action({ UUID: 'fr.twitchat.action.set-animated-text' })
export class SetAnimatedText extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast('SET_ANIMATED_TEXT_CONTENT_FROM_SD', {
			queryId: UUID(),
			id: ev.payload.settings.animatedTextId,
			text: ev.payload.settings.message,
			autoHide: ev.payload.settings.autoHide == true,
		});
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const text = data?.animatedTextList.find((t) => t.id === settings.animatedTextId);
		this.setText(action, '');
		if (!text?.enabled) {
			this.setDisabledState(action);
		} else if (!text) {
			this.setText(action, 'Missing overlay');
			this.setErrorState(action);
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
