import { action, DialAction, DidReceiveSettingsEvent, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Send message.
 */
@action({ UUID: 'fr.twitchat.action.send-message' })
export class SendMessage extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		super.onWillAppear(ev);
		this.setLabel(ev.action, ev.payload.settings.message);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): Promise<void> | void {
		super.onDidReceiveSettings(ev);
		this.setLabel(ev.action, ev.payload.settings.message);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_SEND_MESSAGE', { message: ev.payload.settings.message });
	}

	private setLabel(action: DialAction<{}> | KeyAction<{}>, label?: string) {
		const originalLabel = label || '';
		const maxLength = Math.floor(15 * 2.5);
		let message = originalLabel.substring(0, maxLength);
		if (message.length != originalLabel.length) {
			message = message.substring(0, maxLength - 1) + '…';
		}
		if (message) {
			this.setText(action, message);
			this.setEnabledState(action);
		} else {
			this.setErrorState(action);
		}
	}
}

/**
 * Settings for {@link SendMessage}.
 */
type Settings = {
	message: string;
};
