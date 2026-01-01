import { action, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
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
		const settings = ev.payload.settings;
		TwitchatSocket.instance.broadcast('SET_COUNTER_ADD', {
			id: settings.counterId,
			value: settings.countAdd,
			action: settings.counterAction,
		});
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
