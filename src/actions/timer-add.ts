import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Timer add.
 */
@action({ UUID: 'fr.twitchat.action.timer-add' })
export class TimerAdd extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.timerId) {
			ev.action.setSettings({
				timerId: '',
				timerAdd: 0,
			});
		}
		this.subscribeTo('TIMERS');
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('TIMER_ADD', {
			timerId: ev.payload.settings.timerId,
			timeAdd: ev.payload.settings.timeAdd,
		});
	}
}

/**
 * Settings for {@link TimerAdd}.
 */
type Settings = {
	timerId: string;
	timeAdd: number;
};
