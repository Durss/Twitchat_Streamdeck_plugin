import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable voice control.
 */
@action({ UUID: 'fr.twitchat.action.enable-stt' })
export class EnableStt extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		this.setDeprecatedState(ev.action);
	}

	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_VOICE_CONTROL_STATE', { enabled: true });
	}
}

/**
 * Settings for {@link EnableStt}.
 */
type Settings = {};
