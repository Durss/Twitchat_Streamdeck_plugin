import streamDeck, { PropertyInspectorDidAppearEvent, SingletonAction } from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Abstract action class.
 */
export class AbstractAction<T extends JsonObject = JsonObject> extends SingletonAction<T> {
	private subscriptionTypes: ('COUNTERS' | 'COLUMNS' | 'TRIGGERS')[] = [];

	/**
	 * Subscribe to data.
	 * @param subscription
	 */
	protected subscribeTo(subscription: (typeof this.subscriptionTypes)[number]): void {
		this.subscriptionTypes.push(subscription);
	}

	/**
	 * Init action
	 */
	override onPropertyInspectorDidAppear(_ev: PropertyInspectorDidAppearEvent<T>): Promise<void> | void {
		if (this.subscriptionTypes.includes('COUNTERS')) {
			TwitchatSocket.instance.subscribe(
				'COUNTER_GET_ALL',
				'COUNTER_LIST',
				(data: { counters: { perUser: boolean; id: string; name: string }[] }) => {
					const items: { value: string; label: string; disabled?: true }[] = data.counters
						.filter((c) => c.perUser === false)
						.map((counter) => ({ value: counter.id, label: counter.name }));
					if (items.length === 0) {
						items.push({
							value: '',
							label: streamDeck.i18n.translate('no-counter'),
							disabled: true,
						});
					} else {
						items.unshift({
							value: '',
							label: streamDeck.i18n.translate('select-placeholder'),
						});
					}
					streamDeck.ui.sendToPropertyInspector({
						event: 'getCounters',
						items,
					});
				},
			);
		}

		if (this.subscriptionTypes.includes('COLUMNS')) {
			TwitchatSocket.instance.subscribe('GET_COLS_COUNT', 'SET_COLS_COUNT', (data: { count: number }) => {
				streamDeck.ui.sendToPropertyInspector({
					event: 'getColumns',
					items: Array.from({ length: data.count }, (_, i) => ({
						value: i,
						label: (i + 1).toString(),
					})),
				});
			});
		}

		if (this.subscriptionTypes.includes('TRIGGERS')) {
			TwitchatSocket.instance.subscribe('TRIGGERS_GET_ALL', 'TRIGGER_LIST', (data: { triggers: { id: string; name: string }[] }) => {
				streamDeck.logger.debug('TRIGGEEEEEEEEEEEEEEEEEEEEEEEEEEERS');
				streamDeck.logger.debug(data);
				streamDeck.ui.sendToPropertyInspector({
					event: 'getTriggers',
					items: data.triggers.map((trigger) => ({
						value: trigger.id,
						label: trigger.name,
					})),
				});
			});
		}
	}
}
