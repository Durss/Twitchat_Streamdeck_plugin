import streamDeck, { PropertyInspectorDidAppearEvent, SingletonAction } from "@elgato/streamdeck";
import type { JsonObject } from "@elgato/utils";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Abstract action class.
 */
export class AbstractAction<T extends JsonObject = JsonObject > extends SingletonAction<T> {
	
	/**
	 * Init action
	*/
	override onPropertyInspectorDidAppear(ev: PropertyInspectorDidAppearEvent<T>): Promise<void>|void {
		TwitchatSocket.instance.subscribe("COUNTER_GET_ALL", "COUNTER_LIST", (data:{counters:{ perUser:boolean, id: string; name: string; }[]}) => {
			const items:{value:string, label:string, disabled?:true}[] = data.counters.filter(c=>c.perUser === false).map(counter => ({ value: counter.id, label: counter.name }));
			if(items.length === 0) {
				items.push({ value: "", label: streamDeck.i18n.translate("no-counter"), disabled: true });
			}else{
				items.unshift({ value: "", label: streamDeck.i18n.translate("select-placeholder") });
			}
			streamDeck.ui.sendToPropertyInspector({
				event: "getCounters",
				items
			});
		});

		TwitchatSocket.instance.subscribe("GET_COLS_COUNT", "SET_COLS_COUNT", (data:{count:number}) => {
			streamDeck.logger.debug("Received columns count:", data.count);
			streamDeck.ui.sendToPropertyInspector({
				event: "getColumns",
				items: Array.from({ length: data.count }, (_, i) => ({ value: i, label: (i + 1).toString() }))
			});
		});
	}
}
