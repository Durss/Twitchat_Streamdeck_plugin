import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

/**
 * Action for Enable/Disable a bingo grid.
 */
@action({ UUID: 'fr.twitchat.action.toggle-bingo-grid' })
export class ToggleBingoGrid extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		let enabled = undefined;
		switch (ev.payload.settings.gridAction) {
			case 'ENABLE':
				enabled = true;
				break;
			case 'DISABLE':
				enabled = false;
				break;
		}
		TwitchatSocket.instance.broadcast('SET_BINGO_GRID_STATE', {
			id: ev.payload.settings.gridId,
			forcedState: enabled,
		});
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		const grid = data?.bingoGridList.find((t) => t.id === settings.gridId);

		this.setText(action, grid?.name ?? '???');

		if (!grid) {
			this.setText(action, streamDeck.i18n.translate('missing-grid'));
			this.setErrorState(action);
			this.setToggleState(action, null);
		} else {
			if (grid.enabled) {
				this.setEnabledState(action);
			} else {
				this.setDisabledState(action);
			}
			this.setToggleState(action, grid.enabled);
		}
	}
}

type Settings = {
	gridId: string;
	gridAction: 'ENABLE' | 'DISABLE' | 'TOGGLE';
};
