import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Available activities, the event to send to toggle them and how to know if one is running
 */
const ACTIVITIES = {
	poll: {
		event: 'SET_POLL_TOGGLE',
		isActive: (data: GlobalStates) => data.hasActivePoll,
	},
	prediction: {
		event: 'SET_PREDICTION_TOGGLE',
		isActive: (data: GlobalStates) => data.hasActivePrediction,
	},
	bingo: {
		event: 'SET_BINGO_TOGGLE',
		isActive: (data: GlobalStates) => data.hasActiveBingo,
	},
} as const;

/**
 * Action for Show/hide current poll, prediction or bingo.
 * Replaces deprecated "poll-toggle", "prediction-toggle" and "bingo-toggle" actions.
 */
@action({ UUID: 'fr.twitchat.action.toggle-activity' })
export class ToggleActivity extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.payload.settings.activity) {
			ev.action.setSettings<Settings>({ ...ev.payload.settings, activity: 'poll' });
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
			return;
		}
		const activity = ACTIVITIES[ev.payload.settings.activity] ?? ACTIVITIES.poll;
		TwitchatSocket.instance.broadcast(activity.event);
	}

	protected override onGlobalStatesUpdate(
		data: GlobalStates | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const key = settings.activity in ACTIVITIES ? settings.activity : 'poll';
		this.setImage(action, `imgs/actions/toggle-activity/${key}.svg`);

		if (this._forceOfflineState || !data) return;

		if (ACTIVITIES[key].isActive(data)) this.setEnabledState(action);
		else this.setDisabledState(action);
	}
}

type GlobalStates = TwitchatEventMap['ON_GLOBAL_STATES'];

/**
 * Settings for {@link ToggleActivity}.
 */
type Settings = {
	activity: keyof typeof ACTIVITIES;
};
