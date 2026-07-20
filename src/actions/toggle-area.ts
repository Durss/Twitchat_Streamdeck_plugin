import { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';
import { TwitchatEventMap } from '../TwitchatEventMap';

/**
 * Action for Toggle Clickable Area.
 */
@action({ UUID: 'fr.twitchat.action.toggle-area' })
export class ToggleArea extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(_ev.action) === 'error') {
			_ev.action.showAlert();
			return;
		}
		const state = _ev.payload.settings.state ?? 'toggle';
		TwitchatSocket.instance.broadcast('SET_CLICKABLE_AREA_STATE', {
			id: _ev.payload.settings.areaId,
			state: state === 'toggle' ? 'toggle' : state === 'true',
		});
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;

		const areaList = data?.clickableAreas.map((a) => a.areas).flat();
		const area = areaList?.find((v) => v.id == settings.areaId);

		if (area?.title) {
			this.setText(action, area.title);
		}

		if (area) {
			if (area.enabled === false) this.setDisabledState(action);
			else this.setEnabledState(action);
		} else this.setErrorState(action);
	}
}

/**
 * Settings for {@link ToggleArea}.
 */
type Settings = {
	areaId: string;
	state: 'true' | 'false' | 'toggle';
};
