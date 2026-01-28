import {
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	PropertyInspectorDidAppearEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from '@elgato/streamdeck';
import type { JsonObject } from '@elgato/utils';
import { readFileSync } from 'fs';
import { clearInterval, setInterval } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Abstract action class.
 */
export class AbstractAction<Settings extends JsonObject = JsonObject> extends SingletonAction<Settings> {
	private _actionStateCache: Map<string, 'default' | 'disabled' | 'deprecated' | 'error'> = new Map();
	private _actionStateTitleCache: Map<string, string> = new Map();
	private _actionStateImageCache: Map<string, string> = new Map();

	protected _actionToRefreshInterval: Map<string, ReturnType<typeof setInterval>> = new Map();
	protected _forceOfflineState = false;

	override onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> | void {
		this._forceOfflineState = !TwitchatSocket.instance.isMainAppConnected;
		TwitchatSocket.instance.subscribeTwitchatConnection(ev.action.id, async (isConnected) => {
			this.onConnectionStateChange(ev.action, isConnected);
		});
		TwitchatSocket.instance.on('ON_COUNTER_LIST', ev.action.id, async (data) =>
			this.onCounterListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_CHAT_COLUMNS_COUNT', ev.action.id, async (data) =>
			this.onChatColumnsListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_TRIGGER_LIST', ev.action.id, async (data) =>
			this.onTriggerListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_TIMER_LIST', ev.action.id, async (data) =>
			this.onTimerListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_QNA_SESSION_LIST', ev.action.id, async (data) =>
			this.onQnaSessionListUpdate(data, await ev.action.getSettings(), ev.action),
		);
		TwitchatSocket.instance.on('ON_GLOBAL_STATES', ev.action.id, async (data) =>
			this.onGlobalStatesUpdate(data, await ev.action.getSettings(), ev.action),
		);
		this.applyState(ev.action);
	}

	override onWillDisappear(ev: WillDisappearEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.off('ON_COUNTER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_CHAT_COLUMNS_COUNT', ev.action.id);
		TwitchatSocket.instance.off('ON_TRIGGER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_TIMER_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_QNA_SESSION_LIST', ev.action.id);
		TwitchatSocket.instance.off('ON_GLOBAL_STATES', ev.action.id);
		if (this._actionToRefreshInterval.has(ev.action.id)) {
			clearInterval(this._actionToRefreshInterval.get(ev.action.id));
			this._actionToRefreshInterval.delete(ev.action.id);
		}
		TwitchatSocket.instance.unsubscribeTwitchatConnection(ev.action.id);
	}

	/**
	 * Init action
	 */
	override onPropertyInspectorDidAppear(_ev: PropertyInspectorDidAppearEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcast('GET_ALL_COUNTERS');
		TwitchatSocket.instance.broadcast('GET_CHAT_COLUMNS_COUNT');
		TwitchatSocket.instance.broadcast('GET_TRIGGER_LIST');
		TwitchatSocket.instance.broadcast('GET_TIMER_LIST');
		TwitchatSocket.instance.broadcast('GET_QNA_SESSION_LIST');
		TwitchatSocket.instance.broadcast('GET_GLOBAL_STATES');
	}

	override onDidReceiveSettings(_ev: DidReceiveSettingsEvent<Settings>): Promise<void> | void {
		TwitchatSocket.instance.broadcastCachedEvents();
	}

	protected getActionState(
		action: DialAction<{}> | KeyAction<{}>,
	): typeof this._actionStateCache extends Map<string, infer U> ? U : never {
		return this._actionStateCache.get(action.id) || 'default';
	}

	protected setErrorState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'error');
		this.applyState(action);
	}

	protected setEnabledState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'default');
		this.applyState(action);
	}

	protected setDisabledState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'disabled');
		this.applyState(action);
	}

	protected setDeprecatedState(action: DialAction<{}> | KeyAction<{}>): void {
		this._actionStateCache.set(action.id, 'deprecated');
		this.applyState(action);
	}

	protected setText(action: DialAction<{}> | KeyAction<{}>, text: string): void {
		this._actionStateTitleCache.set(action.id, text);
		this.applyState(action);
	}

	protected setImage(action: DialAction<{}> | KeyAction<{}>, imagePath: string): void {
		this._actionStateImageCache.set(action.id, imagePath);
		this.applyState(action);
	}

	private async onConnectionStateChange(action: DialAction<{}> | KeyAction<{}>, isConnected: boolean): Promise<void> {
		this._forceOfflineState = isConnected === false;
		this.applyState(action);
	}

	private applyState(action: DialAction<{}> | KeyAction<{}>): void {
		let state = this._actionStateCache.get(action.id);
		const actionId = action.manifestId.split('.').pop();
		let svg = '';
		if (this._actionStateImageCache.has(action.id)) {
			const imagePath = this._actionStateImageCache.get(action.id)!;
			svg = readFileSync(imagePath, 'utf-8');
		} else {
			svg = readFileSync('imgs/actions/' + actionId + '/icon.svg', 'utf-8');
		}

		if (this._forceOfflineState) {
			svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .35;`).replace(
				'</svg>',
				`
			<path style="fill: white; stroke: #000; stroke-miterlimit: 10; stroke-width: 5px;" d="M68.61,91.79c-.55.34-4.49,10.06-5.61,11.71-2.7,4-7.81,1.13-6.78-2.72l27.88-58.58c2.43-3.28,7.24-1.35,6.6,2.85l-5.56,12.13,3.91,5.18c19.7-3.2,25.2,24.74,5.74,29.23l-26.18.19Z"/>
			<path style="fill: white; stroke: #000; stroke-miterlimit: 10; stroke-width: 5px;" d="M72.31,51.48l-18.88,39.95c-5.49,1.24-11.61-.73-14.58-5.72-5.46-9.16,1.77-20.32,12.25-19.07,2.4-9.4,11.46-16.3,21.21-15.17Z"/>
			</svg>`,
			);
		} else {
			switch (state) {
				case 'deprecated': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .85;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `$1 stroke-opacity: .85;`);
					svg = svg.replace(/<image/gi, `<image style="opacity: .85;"`);
					svg = svg.replace(
						'</svg>',
						`
						<path style="fill:#cc0000; fill-opacity:.45" d="M132.66,11.34v121.32H11.34V11.34h121.32M144,0H0v144h144V0h0Z"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="11.34 11.34 11.34 15.99 15.99 11.34 11.34 11.34"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="37.2 11.34 11.34 37.2 11.34 58.42 58.42 11.34 37.2 11.34"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="79.63 11.34 11.34 79.63 11.34 100.84 100.84 11.34 79.63 11.34"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="132.66 11.34 122.05 11.34 11.34 122.05 11.34 132.66 21.95 132.66 132.66 21.95 132.66 11.34"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="132.66 43.16 43.16 132.66 64.37 132.66 132.66 64.37 132.66 43.16"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="132.66 85.58 85.58 132.66 106.8 132.66 132.66 106.8 132.66 85.58"/>
						<polygon style="fill:#cc0000; fill-opacity:.45" points="132.66 132.66 132.66 128.01 128.01 132.66 132.66 132.66"/>
						</svg>`,
					);
					break;
				}
				case 'disabled': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `$1 fill-opacity: .35;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `$1 stroke-opacity: .35;`);
					svg = svg.replace(/<image/gi, `<image style="opacity: .35;"`);
					break;
				}
				case 'error': {
					svg = svg.replace(/(fill: ?#.*;)/gi, `fill: #ff3333; fill-opacity: .8;`);
					svg = svg.replace(/(stroke: ?#.*;)/gi, `stroke: #ff3333; stroke-opacity: .8;`);
					break;
				}
			}
			const label = this._actionStateTitleCache.get(action.id);
			if (label) {
				svg = this.injectText(svg, label, state === 'error');
			}
		}

		svg = this.injectLogo(svg);
		// eslint-disable-next-line no-undef
		const img = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
		if (action.isKey()) {
			action.setImage(img);
		} else if (action.isDial()) {
			action.setFeedback({
				icon: { value: img },
			});
		}
	}

	private injectLogo(svg: string): string {
		return svg.replace(
			'</svg>',
			`
				<path style="fill: white; fill-opacity:.5; stroke: #000; stroke-miterlimit: 10; stroke-width: 2px;" d="M123.48,123.91c-.01,1.9-.01,3.79,0,5.69,0,.39-.15.49-.52.49-1.61-.02-3.21,0-4.82-.03-.43-.01-.6.09-.59.56.03,1.05,0,1.05,1.07,1.05,1.44,0,2.87.01,4.31-.01.42-.01.56.13.55.56-.02,1.85-.02,3.69,0,5.54.01.47-.17.58-.6.57-2.74-.01-5.46.01-8.2-.02-.3,0-.66-.17-.88-.38-.84-.77-1.63-1.61-2.47-2.39-.39-.37-.55-.75-.55-1.29.04-2.6.03-5.23.03-7.86s.01-4.71-.01-7.4c0-.47.11-.67.63-.66,1.86.03,3.72.02,5.59,0,.44,0,.58.13.58.58-.03,1.56,0,2.41-.02,3.97-.01.42.11.56.55.55,1.62-.02,3.25,0,4.87-.02.38,0,.51.11.5.49Z"/>
				<path style="fill: white; fill-opacity:.5; stroke: #000; stroke-miterlimit: 10; stroke-width: 2px;" d="M138.33,123.91c-.01,1.9-.01,3.79,0,5.69,0,.39-.15.49-.52.49-1.61-.02-3.21,0-4.82-.03-.43-.01-.6.09-.59.56.03,1.05,0,1.05,1.07,1.05,1.44,0,2.87.01,4.31-.01.42-.01.56.13.55.56-.02,1.85-.02,3.69,0,5.54.01.47-.17.58-.6.57-2.74-.01-5.46.01-8.2-.02-.3,0-.66-.17-.88-.38-.84-.77-1.63-1.61-2.47-2.39-.39-.37-.55-.75-.55-1.29.04-2.6.03-5.23.03-7.86s.01-4.71-.01-7.4c0-.47.11-.67.63-.66,1.86.03,3.72.02,5.59,0,.44,0,.58.13.58.58-.03,1.56,0,2.41-.02,3.97-.01.42.11.56.55.55,1.62-.02,3.25,0,4.87-.02.38,0,.51.11.5.49Z"/>
			</svg>`,
		);
	}

	private injectText(svg: string, text: string, isError: boolean): string {
		const color = isError ? '#ff0000' : '#008667';
		const lines = this.wrapText(text, 15);
		const svgLines: string[] = [];
		lines.forEach((line, index) => {
			line = line.replace(/&/, '&amp;');
			const py = 20 + index * 20;
			svgLines.push(`
			<text
				x="74px"
				y="${py + 2 * (index + 1)}px"
				text-anchor="middle"
				font-family="sans-serif"
				font-size="20"
				fill="black"
			>${line}</text>
			<text
				x="72px"
				y="${py}px"
				text-anchor="middle"
				font-family="sans-serif"
				font-size="20"
				fill="white"
			>${line}</text>`);
		});
		return svg.replace(
			'</svg>',
			`
				<rect x="0" y="-20" width="144px" height="${svgLines.length * 20 + 10 + 20}px" rx="12px" ry="12px" style="fill: ${color}; fill-opacity: .7; stroke: #000000; stroke-opacity: .7; stroke-miterlimit: 10; stroke-width: 3px;"/>
				${svgLines.join('\n')}
			</svg>`,
		);
	}

	/**
	 * @override
	 */
	protected onTriggerListUpdate(
		_data: TwitchatEventMap['ON_TRIGGER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onCounterListUpdate(
		_data: TwitchatEventMap['ON_COUNTER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onChatColumnsListUpdate(
		_data: TwitchatEventMap['ON_CHAT_COLUMNS_COUNT'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onTimerListUpdate(
		_data: TwitchatEventMap['ON_TIMER_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onQnaSessionListUpdate(
		_data: TwitchatEventMap['ON_QNA_SESSION_LIST'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}
	/**
	 * @override
	 */
	protected onGlobalStatesUpdate(
		_data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		_action: DialAction<{}> | KeyAction<{}>,
	): void {}

	/**
	 * Wraps text to a maximum line length, prioritizing breaks at spaces.
	 * Words longer than maxLength are split mid-word.
	 * [generated with copilot]
	 */
	private wrapText(text: string, maxLength: number): string[] {
		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			if (word.length > maxLength) {
				// Word is longer than maxLength, need to split it
				if (currentLine) {
					// First, check if we can fit part of the word on current line
					const spaceLeft = maxLength - currentLine.length - 1; // -1 for space
					if (spaceLeft > 0) {
						lines.push(currentLine + ' ' + word.slice(0, spaceLeft));
						let remaining = word.slice(spaceLeft);
						while (remaining.length > maxLength) {
							lines.push(remaining.slice(0, maxLength));
							remaining = remaining.slice(maxLength);
						}
						currentLine = remaining;
					} else {
						lines.push(currentLine);
						let remaining = word;
						while (remaining.length > maxLength) {
							lines.push(remaining.slice(0, maxLength));
							remaining = remaining.slice(maxLength);
						}
						currentLine = remaining;
					}
				} else {
					// No current line, just split the word
					let remaining = word;
					while (remaining.length > maxLength) {
						lines.push(remaining.slice(0, maxLength));
						remaining = remaining.slice(maxLength);
					}
					currentLine = remaining;
				}
			} else if (currentLine.length + 1 + word.length <= maxLength) {
				// Word fits on current line
				currentLine = currentLine ? currentLine + ' ' + word : word;
			} else {
				// Word doesn't fit, start new line
				if (currentLine) {
					lines.push(currentLine);
				}
				currentLine = word;
			}
		}

		if (currentLine) {
			lines.push(currentLine);
		}

		return lines.length > 0 ? lines : [''];
	}
}
