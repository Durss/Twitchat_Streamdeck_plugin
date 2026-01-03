import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { setTimeout } from 'timers';

/**
 * Action for Show/Hide a bingo grid overlay.
 */
@action({ UUID: 'fr.twitchat.action.show-bingo-grid' })
export class ShowBingoGrid extends AbstractAction<Settings> {
	private _disabledMap: Map<string, boolean> = new Map();
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
			ev.action.showAlert();
		} else {
			this._disabledMap.set(ev.action.id, true);
			this.setDisabledState(ev.action);
			setTimeout(() => {
				this._disabledMap.delete(ev.action.id);
				this.setEnabledState(ev.action);
			}, 1500);
			TwitchatSocket.instance.broadcast('SET_BINGO_GRID_CONFIGS_VISIBILITY_FROM_SD', {
				id: ev.payload.settings.bingoGridId,
			});
		}
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
