import streamDeck, { PropertyInspectorDidAppearEvent, PropertyInspectorDidDisappearEvent, SingletonAction } from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Abstract action class.
 */
export class AbstractAction<T extends JsonObject = JsonObject> extends SingletonAction<T> {
	private subscriptionTypes: ('COUNTERS' | 'COLUMNS' | 'TRIGGERS' | 'TIMERS' | 'QNA')[] = [];

	/**
	 * Subscribe to data.
	 * @param subscription
	 */
	protected subscribeTo(subscription: (typeof this.subscriptionTypes)[number]): void {
		this.subscriptionTypes.push(subscription);
	}

	/**
	 * Unsubscribe all subscriptions when disappearing
	 * @param _ev
	 */
	override onPropertyInspectorDidDisappear(_ev: PropertyInspectorDidDisappearEvent<T>): Promise<void> | void {
		TwitchatSocket.instance.unsubscribeAll();
	}

	/**
	 * Init action
	 */
	override onPropertyInspectorDidAppear(_ev: PropertyInspectorDidAppearEvent<T>): Promise<void> | void {
		if (this.subscriptionTypes.includes('COUNTERS')) {
			TwitchatSocket.instance.subscribe('GET_ALL_COUNTERS', 'ON_COUNTER_LIST', (data) => {
				let items: SelectItem[] = data.counters
					.filter((c) => c.perUser === false)
					.map((counter) => ({ value: counter.id, label: counter.name }));
				if (items.length === 0) {
					items = [
						{
							value: '',
							label: streamDeck.i18n.translate('no-counter'),
							disabled: true,
						},
					];
				}
				items.unshift({
					value: '',
					label: streamDeck.i18n.translate('select-placeholder'),
				});
				streamDeck.ui.sendToPropertyInspector({
					event: 'getCounters',
					items,
				});
			});
		}

		if (this.subscriptionTypes.includes('COLUMNS')) {
			TwitchatSocket.instance.subscribe('GET_CHAT_COLUMNS_COUNT', 'ON_CHAT_COLUMNS_COUNT', (data) => {
				const items: SelectItem<number>[] = [];
				for (let i = 0; i < data.count; i++) {
					items.push({ value: i, label: (i + 1).toString() });
				}
				streamDeck.ui.sendToPropertyInspector({
					event: 'getColumns',
					items,
				});
			});
		}

		if (this.subscriptionTypes.includes('TRIGGERS')) {
			TwitchatSocket.instance.subscribe('GET_TRIGGER_LIST', 'ON_TRIGGER_LIST', (data) => {
				let items: SelectItem[] = data.triggerList.map((trigger) => ({
					value: trigger.id,
					label: trigger.name,
					disabled: trigger.disabled === true,
				}));
				if (items.length === 0) {
					items = [{ value: '', label: streamDeck.i18n.translate('no-trigger'), disabled: true }];
				}
				items.unshift({
					value: '',
					label: streamDeck.i18n.translate('select-placeholder'),
				});
				streamDeck.ui.sendToPropertyInspector({
					event: 'getTriggers',
					items,
				});
			});
		}

		if (this.subscriptionTypes.includes('TIMERS')) {
			TwitchatSocket.instance.subscribe('GET_TIMER_LIST', 'ON_TIMER_LIST', (data) => {
				let items: SelectItem[] = data.timers
					.filter((timer) => timer.type === 'timer')
					.map((timer) => ({
						value: timer.id,
						label: timer.title,
						disabled: !timer.enabled,
					}));
				streamDeck.ui.sendToPropertyInspector({
					event: 'getTimers',
					items,
				});

				items = data.timers
					.filter((timer) => timer.type === 'countdown')
					.map((timer) => ({
						value: timer.id,
						label: timer.title,
						disabled: !timer.enabled,
					}));
				streamDeck.ui.sendToPropertyInspector({
					event: 'getCountdowns',
					items,
				});
			});
		}

		if (this.subscriptionTypes.includes('QNA')) {
			TwitchatSocket.instance.subscribe('GET_QNA_SESSION_LIST', 'ON_QNA_SESSION_LIST', (data) => {
				let items: SelectItem<string>[] = data.sessionList.map((qna) => ({
					value: qna.id,
					label: qna.command,
					disabled: !qna.open,
				}));
				if (items.length === 0) {
					items = [
						{
							value: '',
							label: streamDeck.i18n.translate('no-qna-session'),
							disabled: true,
						},
					];
				}
				items.unshift({
					value: '',
					label: streamDeck.i18n.translate('select-placeholder'),
				});
				streamDeck.logger.debug('Sending QNA sessions to PI', items);
				streamDeck.ui.sendToPropertyInspector({
					event: 'getQnas',
					items,
				});
			});
		}
	}
}

type SelectItem<V = string> = {
	value: V;
	label: string;
	disabled?: boolean;
};
