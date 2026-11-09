import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Bid War update.
 */
@action({ UUID: 'fr.twitchat.action.bid-war-update' })
export class BidWarUpdate extends AbstractAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const { bidwarId, bidwarAction, bidwarValue } = ev.payload.settings;

		let value: boolean | number | undefined;
		switch (bidwarAction) {
			case 'enable':
			case 'disable':
				value = bidwarAction === 'enable';
				break;
			case 'add1':
			case 'add2':
			case 'set1':
			case 'set2':
				// Text field value, accept "," as decimal separator
				value = parseFloat(String(bidwarValue ?? '').replace(',', '.'));
				break;
		}

		if (!bidwarId || !bidwarAction || Number.isNaN(value)) {
			ev.action.showAlert();
			return;
		}

		TwitchatSocket.instance.broadcast('BID_WAR_UPDATE', { id: bidwarId, action: bidwarAction, value });
	}

	/**
	 * Called when Twitchat sends its states and when the PI changes a setting.
	 * Populates the "action" select of the PI with the selected bid war's side names.
	 */
	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		// Populate actions (with side names) for currently selected bid war
		if (streamDeck.ui.action?.id === action.id) {
			const sides = data?.bidwars?.find((bidwar) => bidwar.id === settings.bidwarId)?.sides ?? [];
			const t = (key: string) => streamDeck.i18n.translate(key);
			const sideLabel = (key: string, index: number) => t(key).replace('{NAME}', sides[index]?.title || `#${index + 1}`);

			const items: { value: Settings['bidwarAction']; label: string }[] = [
				{ value: 'enable', label: t('bid-war-enable') },
				{ value: 'disable', label: t('bid-war-disable') },
				{ value: 'toggle', label: t('bid-war-toggle') },
				{ value: 'reset', label: t('bid-war-reset') },
				{ value: 'add1', label: sideLabel('bid-war-add', 0) },
				{ value: 'add2', label: sideLabel('bid-war-add', 1) },
				{ value: 'set1', label: sideLabel('bid-war-set', 0) },
				{ value: 'set2', label: sideLabel('bid-war-set', 1) },
			];

			streamDeck.ui.sendToPropertyInspector({ event: 'getBidwarActions', items });
		}

		const bidwar = data?.bidwars.find((b) => b.id === settings.bidwarId);
		this.setText(action, bidwar?.title ?? '???');

		if (bidwar && !bidwar.enabled) {
			this.setDisabledState(action);
		} else if (!bidwar) {
			this.setText(action, streamDeck.i18n.translate('missing-bidwar'));
			this.setErrorState(action);
		} else {
			this.setEnabledState(action);
		}
	}
}

/**
 * Settings for {@link BidWarUpdate}.
 */
type Settings = {
	bidwarId: string;
	bidwarAction: 'enable' | 'disable' | 'toggle' | 'reset' | 'add1' | 'add2' | 'set1' | 'set2';
	/**
	 * Amount for "add" and "set" actions, as typed in the text field
	 */
	bidwarValue: string;
};
