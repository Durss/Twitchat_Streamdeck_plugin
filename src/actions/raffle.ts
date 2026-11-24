import { action, DialAction, DidReceiveSettingsEvent, KeyAction, KeyDownEvent, WillAppearEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Show/hide current raffle or pick a winner.
 * Replaces deprecated "raffle-toggle" and "raffle-pick-winner" actions.
 */
@action({ UUID: 'fr.twitchat.action.raffle' })
export class Raffle extends AbstractAction<Settings> {
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		let settings = ev.payload.settings;
		if (!settings.raffleAction) {
			settings = { ...settings, raffleAction: 'toggle' };
			ev.action.setSettings(settings);
		}
		this.updateIcon(ev.action, settings);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): void {
		super.onDidReceiveSettings(ev);
		this.updateIcon(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
			return;
		}
		if (ev.payload.settings.raffleAction === 'pick-winner') {
			TwitchatSocket.instance.broadcast('SET_RAFFLE_PICK_WINNER');
		} else {
			TwitchatSocket.instance.broadcast('SET_RAFFLE_TOGGLE');
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		const active = settings.raffleAction === 'pick-winner' ? data?.hasActiveRaffleWithEntries : data?.hasActiveRaffle;
		if (active) this.setEnabledState(action);
		else this.setDisabledState(action);
	}

	private updateIcon(action: DialAction<{}> | KeyAction<{}>, settings: Settings): void {
		if (settings.raffleAction === 'pick-winner') {
			this.setImage(action, 'imgs/actions/raffle/pick-winner.svg');
		} else {
			this.setImage(action, 'imgs/actions/raffle/icon.svg');
		}
	}
}

/**
 * Settings for {@link Raffle}.
 */
type Settings = {
	raffleAction: 'toggle' | 'pick-winner';
};
