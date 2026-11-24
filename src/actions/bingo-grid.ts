import streamDeck, { action, DialAction, KeyAction, KeyDownEvent, KeyUpEvent, WillAppearEvent } from '@elgato/streamdeck';
import { clearInterval, setInterval, setTimeout } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Enable/disable a bingo grid or show/hide the bingo grid overlay.
 * Replaces deprecated "toggle-bingo-grid" and "show-bingo-grid" actions.
 *
 * "ENABLE", "DISABLE", "TOGGLE": changes the enabled state of the selected grid
 * "VISIBILITY": shows/hides the currently active grid's overlay
 *   Short press => show/hide
 *   Long press => show while pressed, hide on release
 */
@action({ UUID: 'fr.twitchat.action.bingo-grid' })
export class BingoGrid extends AbstractAction<Settings> {
	private _disabledMap: Map<string, boolean> = new Map();
	private _pressedAtMap: Map<string, number> = new Map();
	private _forceShowIntervalMap: Map<string, ReturnType<typeof setInterval>> = new Map();

	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		super.onWillAppear(ev);
		if (!ev.payload.settings.gridAction) {
			ev.action.setSettings<Settings>({
				...ev.payload.settings,
				gridId: ev.payload.settings.gridId ?? '',
				gridAction: 'TOGGLE',
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = ev.payload.settings;
		if (settings.gridAction === 'VISIBILITY') {
			if (this.getActionState(ev.action) === 'error' || this.getActionState(ev.action) === 'disabled') {
				ev.action.showAlert();
				return;
			}
			this._pressedAtMap.set(ev.action.id, Date.now());

			TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {});

			// Force display until key up
			if (this._forceShowIntervalMap.has(ev.action.id)) clearInterval(this._forceShowIntervalMap.get(ev.action.id));
			this._forceShowIntervalMap.set(
				ev.action.id,
				setInterval(() => {
					TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {
						show: true,
					});
				}, 2000),
			);
			return;
		}

		if (this.getActionState(ev.action) === 'error') {
			ev.action.showAlert();
			return;
		}
		let forcedState: boolean | undefined = undefined;
		if (settings.gridAction === 'ENABLE') forcedState = true;
		if (settings.gridAction === 'DISABLE') forcedState = false;
		TwitchatSocket.instance.broadcast('SET_BINGO_GRID_STATE', {
			id: settings.gridId,
			forcedState,
		});
	}

	override onKeyUp(ev: KeyUpEvent<Settings>): void {
		if (ev.payload.settings.gridAction !== 'VISIBILITY') return;

		if (this._forceShowIntervalMap.has(ev.action.id)) {
			clearInterval(this._forceShowIntervalMap.get(ev.action.id));
			this._forceShowIntervalMap.delete(ev.action.id);
		}
		const pressedAt = this._pressedAtMap.get(ev.action.id);
		this._pressedAtMap.delete(ev.action.id);
		// Key down was refused
		if (!pressedAt) return;

		if (Date.now() - pressedAt > 1000) {
			// Long press: force hide
			TwitchatSocket.instance.broadcast('SET_BINGO_GRID_VISIBILITY_FROM_SD', {
				show: false,
			});
		}

		// Avoid spamming
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
		if (settings.gridAction === 'VISIBILITY') {
			this.setImage(action, 'imgs/actions/bingo-grid/visibility.svg');
			this.setToggleState(action, null);
			if (this._disabledMap.get(action.id)) {
				this.setDisabledState(action);
				return;
			}
			const activeGrid = data?.bingoGridList.find((g) => g.enabled);
			if (!activeGrid) {
				this.setText(action, streamDeck.i18n.translate('no-active-bingo-grid'));
				this.setDisabledState(action);
			} else {
				this.setText(action, activeGrid.name);
				this.setEnabledState(action);
			}
			return;
		}

		this.setImage(action, 'imgs/actions/bingo-grid/icon.svg');
		const grid = data?.bingoGridList.find((g) => g.id === settings.gridId);
		if (!grid) {
			this.setText(action, streamDeck.i18n.translate('missing-grid'));
			this.setErrorState(action);
			this.setToggleState(action, null);
		} else {
			this.setText(action, grid.name);
			if (grid.enabled) {
				this.setEnabledState(action);
			} else {
				this.setDisabledState(action);
			}
			this.setToggleState(action, grid.enabled);
		}
	}
}

/**
 * Settings for {@link BingoGrid}.
 */
type Settings = {
	gridId: string;
	gridAction: 'ENABLE' | 'DISABLE' | 'TOGGLE' | 'VISIBILITY';
};
