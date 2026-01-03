import { action, DialAction, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Counter add.
 */
@action({ UUID: 'fr.twitchat.action.counter-add' })
export class CounterAdd extends AbstractAction<Settings> {
	/**
	 * Init action
	 */
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.action.isKey()) return;
		if (!ev.payload.settings.countAdd) {
			ev.action.setSettings({
				countAdd: 0,
				counterId: '',
				counterAction: 'ADD',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error') {
			ev.action.showAlert();
		} else {
			const settings = ev.payload.settings;
			TwitchatSocket.instance.broadcast('SET_COUNTER_ADD', {
				id: settings.counterId,
				value: settings.countAdd,
				action: settings.counterAction,
			});
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		const counter = data?.counterValues.find((c) => c.id === _settings.counterId);
		if (!counter) {
			this.setText(action, 'Missing Counter');
			this.setErrorState(action);
			return;
		} else {
			this.setText(action, counter.value.toString());
			this.setEnabledState(action);
		}
	}
}

/**
 * Settings for {@link CounterAdd}.
 */
type Settings = {
	counterId: string;
	countAdd: string;
	counterAction: 'ADD' | 'DEL' | 'SET';
};
