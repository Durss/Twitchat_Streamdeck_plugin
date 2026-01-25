import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, KeyUpEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { setTimeout, setInterval, clearInterval } from 'timers';

/**
 * Action for Show/Hide a bingo grid overlay.
 *
 * Short press => show and hide 5s later
 * Long press => show while pressed, hide on release
 */
@action({ UUID: 'fr.twitchat.action.show-bingo-grid' })
export class ShowBingoGrid extends AbstractAction<Settings> {
	private _disabledMap: Map<string, boolean> = new Map();
	private _pressedAtMap: Map<string, number> = new Map();
	private _forceShowIntervaltMap: Map<string, ReturnType<typeof setInterval>> = new Map();

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			this._pressedAtMap.set(ev.action.id, Date.now());

			TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {
				id: ev.payload.settings.bingoGridId,
			});

			// Force display every second until key up
			if (this._forceShowIntervaltMap.has(ev.action.id)) clearInterval(this._forceShowIntervaltMap.get(ev.action.id));
			this._forceShowIntervaltMap.set(
				ev.action.id,
				setInterval(() => {
					TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {
						id: ev.payload.settings.bingoGridId,
						show: true,
					});
				}, 2000),
			);
		}
	}

	override onKeyUp(ev: KeyUpEvent<Settings>): Promise<void> | void {
		const pressedAt = this._pressedAtMap.get(ev.action.id);
		if (this._forceShowIntervaltMap.has(ev.action.id)) clearInterval(this._forceShowIntervaltMap.get(ev.action.id));
		if (pressedAt && Date.now() - pressedAt > 1000) {
			// Long press: force hide
			TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {
				id: ev.payload.settings.bingoGridId,
				show: false,
			});
		}

		this._disabledMap.set(ev.action.id, true);
		this.setDisabledState(ev.action);
		setTimeout(() => {
			this._disabledMap.delete(ev.action.id);
			this.setEnabledState(ev.action);
		}, 1500);
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const bingoGrid = data?.bingoGridList.find((q) => q.id === settings.bingoGridId);
		if (this._disabledMap.get(action.id)) {
			this.setDisabledState(action);
			return;
		}
		if (!bingoGrid) {
			this.setText(action, streamDeck.i18n.translate('missing-bingo-grid'));
			this.setErrorState(action);
		} else {
			this.setText(action, bingoGrid.name);
			this.setEnabledState(action);
		}
	}
}

/**
 * Settings for {@link ShowBingoGrid}.
 */
type Settings = {
	bingoGridId: string;
};
