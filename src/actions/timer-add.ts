import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Timer add.
 */
@action({ UUID: 'fr.twitchat.action.timer-add' })
export class TimerAdd extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.timerId) {
			ev.action.setSettings({
				timerId: '',
				timerAdd: 0,
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_TIMER_ADD', {
			id: ev.payload.settings.timerId,
			value: ev.payload.settings.timeAdd,
		});
	}
}

/**
 * Settings for {@link TimerAdd}.
 */
type Settings = {
	timerId: string;
	timeAdd: string;
};
