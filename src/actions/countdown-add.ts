import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { clearInterval, setInterval } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { formatDuration } from '../Utils';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Countdown add.
 */
@action({ UUID: 'fr.twitchat.action.countdown-add' })
export class CountdownAdd extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.action.isKey()) return;
		if (ev.payload.settings.timerId === undefined) {
			ev.action.setSettings<Settings>({
				timerId: '',
				timeAdd: '0',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('SET_COUNTDOWN_ADD', {
			id: ev.payload.settings.timerId,
			value: ev.payload.settings.timeAdd,
		});
	}

	protected override onTimerListUpdate(
		data: TwitchatEventMap['ON_TIMER_LIST'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		let timer = data?.timerList.find((t) => t.id === settings.timerId);
		if (!timer && !settings.timerId) {
			timer = data?.timerList.find((t) => t.isDefault && t.type === 'countdown');
		}

		if (!timer || !timer?.enabled) {
			this.setText(action, '');
			this.setErrorState(action);
		} else {
			const renderTimer = () => {
				if (timer.type == 'countdown' && timer.startAt_ms) {
					let elapsed = 0;
					if (timer.paused) {
						elapsed = timer.pausedAt_ms! - timer.startAt_ms + timer.offset_ms;
					} else {
						elapsed = Date.now() - timer.startAt_ms;
					}
					elapsed -= timer.pauseDuration_ms;
					const remaining = Math.round((timer.duration_ms - elapsed) / 1000) * 1000;
					this.setText(action, formatDuration(remaining));
					this.setEnabledState(action);
				} else {
					this.setText(action, '');
					this.setDisabledState(action);
				}
			};
			if (this._actionToRefreshInterval.has(action.id)) {
				clearInterval(this._actionToRefreshInterval.get(action.id));
			}
			const interval = setInterval(() => {
				renderTimer();
			}, 1000);
			renderTimer();
			this._actionToRefreshInterval.set(action.id, interval);
		}
	}
}

/**
 * Settings for {@link CountdownAdd}.
 */
type Settings = {
	timerId: string;
	timeAdd: string;
};
