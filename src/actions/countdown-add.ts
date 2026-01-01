import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Countdown add.
 */
@action({ UUID: 'fr.twitchat.action.countdown-add' })
export class CountdownAdd extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.timerId) {
			ev.action.setSettings({
				timerId: '',
				timerAdd: 0,
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_COUNTDOWN_ADD', {
			id: ev.payload.settings.timerId,
			value: ev.payload.settings.timeAdd,
		});
	}
}

/**
 * Settings for {@link CountdownAdd}.
 */
type Settings = {
	timerId: string;
	timeAdd: string;
};
