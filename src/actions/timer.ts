import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { clearInterval, setInterval } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { formatDuration, parseTimerValue } from '../Utils';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Add or remove time on a timer or a countdown.
 * Replaces deprecated "timer-add" and "countdown-add" actions.
 *
 * The selected ID is searched in both timers and countdowns lists
 * to know which one it is.
 */
@action({ UUID: 'fr.twitchat.action.timer' })
export class Timer extends AbstractAction<Settings> {
	private _actionToTimerType: Map<string, 'timer' | 'countdown'> = new Map();

	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (ev.payload.settings.timerId === undefined) {
			ev.action.setSettings<Settings>({
				timerId: '',
				timeAdd: '0',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const value = ev.payload.settings.timeAdd;
		const type = this._actionToTimerType.get(ev.action.id);
		if (
			!type ||
			!parseTimerValue(value).isValid ||
			this.getActionState(ev.action) === 'error' ||
			this.getActionState(ev.action) === 'disabled'
		) {
			ev.action.showAlert();
			return;
		}
		TwitchatSocket.instance.broadcast(type === 'countdown' ? 'SET_COUNTDOWN_ADD' : 'SET_TIMER_ADD', {
			id: ev.payload.settings.timerId,
			value: ev.payload.settings.timeAdd,
		});
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		// Stop any previous refresh, timer may have changed
		if (this._actionToRefreshInterval.has(action.id)) {
			clearInterval(this._actionToRefreshInterval.get(action.id));
			this._actionToRefreshInterval.delete(action.id);
		}

		// Find the timer to display
		const countdown = settings.timerId ? data?.countdowns.find((t) => t.id === settings.timerId) : undefined;
		const timer = settings.timerId ? data?.timers.find((t) => t.id === settings.timerId) : undefined;
		const entry = countdown ?? timer;
		const type = countdown ? 'countdown' : 'timer';
		if (entry) {
			this._actionToTimerType.set(action.id, type);
		} else {
			this._actionToTimerType.delete(action.id);
		}
		this.setImage(action, type === 'countdown' ? 'imgs/actions/timer/countdown.svg' : 'imgs/actions/timer/icon.svg');

		// Check value set by the user is valid
		const parsed = parseTimerValue(settings.timeAdd);
		if (parsed.isValid && typeof parsed.value === 'number') {
			action.setTitle(parsed.value < 0 ? `${parsed.value}` : `+${parsed.value}`);
		} else if (parsed.isValid) {
			this.setText(action, '');
		} else {
			this.setText(action, streamDeck.i18n.translate('invalid-value'));
			this.setErrorState(action);
			return;
		}

		if (!entry || !entry.enabled) {
			// Timer not found or disabled
			this.setText(action, streamDeck.i18n.translate('missing-timer'));
			this.setErrorState(action);
			return;
		}

		this.setEnabledState(action);
		// Timer found and enabled, schedule value refresh every second
		const renderTimer = () => {
			if (this.getActionState(action) === 'disabled' || this.getActionState(action) === 'error') {
				return;
			}
			if (!entry.startAt_ms) {
				this.setText(action, '');
				this.setDisabledState(action);
				return;
			}
			let elapsed = 0;
			if (entry.paused) {
				elapsed = entry.pausedAt_ms! - entry.startAt_ms + entry.offset_ms;
			} else if (type === 'countdown') {
				elapsed = Date.now() - entry.startAt_ms;
			} else {
				elapsed = Date.now() - entry.startAt_ms + entry.offset_ms;
			}
			if (type === 'countdown') {
				elapsed -= entry.pauseDuration_ms;
				this.setText(action, formatDuration(entry.duration_ms - elapsed));
			} else {
				this.setText(action, formatDuration(elapsed, false, streamDeck.i18n.translate('day-unit')));
			}
			this.setEnabledState(action);
		};
		const interval = setInterval(() => {
			renderTimer();
		}, 1000);
		renderTimer();
		this._actionToRefreshInterval.set(action.id, interval);
	}
}

/**
 * Settings for {@link Timer}.
 */
type Settings = {
	/**
	 * ID of a timer or a countdown
	 */
	timerId: string;
	timeAdd: string;
};
