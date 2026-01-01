import { html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

customElements.whenDefined('sdpi-i18n').then(() => {
	const originalElement = customElements.get('sdpi-i18n');
	if (originalElement) {
		// Override the render method
		originalElement.prototype.render = function () {
			// Get the i18n message
			const message = SDPIComponents?.i18n?.getMessage?.(this.key) || this.key;

			if (!this.key) return undefined;

			// Get all slot elements
			const slots = this.querySelectorAll('slot');

			if (slots.length === 0) {
				return html`${message}`;
			}

			// Replace placeholders with slotted content
			let result = message;
			slots.forEach((el) => {
				const slotName = el.getAttribute('name');
				const placeholder = `\{${slotName}\}`;
				result = result.replace(new RegExp(placeholder, 'gi'), el.outerHTML);
			});

			var sheet = new CSSStyleSheet();
			sheet.replaceSync(`a {
	color: #00aaff;
	text-decoration: none;
}`);
			this.shadowRoot.adoptedStyleSheets.push(sheet);

			return html`<span .innerHTML=${result}></span>`;
		};

		// Force re-render of existing elements
		document.querySelectorAll('sdpi-i18n').forEach((el) => el.requestUpdate());
	}
});

/**
 * Called any time global settings are received or updated
 * Watches for Twitchat instances connection changes to redirect or show messages accordingly
 * @param {*} settings
 */
function onSettingsReceived(settings) {
	const count = settings.mainAppCount || 0;
	//If on main page, check how many twitchat instances are connected
	if (document.location.href.endsWith('main.html')) {
		if (count === 0) {
			// If no twitchat is detected, show offline message
			document.getElementById('offline').style.display = 'block';
		} else if (count > 1) {
			// If multiple twitchat instances are detected, show multiple instances message
			document.getElementById('multiple-instances').style.display = 'block';
		} else {
			// If exactly one twitchat instance is detected, redirect to the action page
			(async function () {
				const info = await SDPIComponents.streamDeckClient.getConnectionInfo();
				const action = info.actionInfo.action.split('.').pop();
				document.location.href = `./${action}.html`;
			})();
		}
	} else if (count === 0 || count > 1) {
		document.location.href = './main.html';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Get global settings to check how many twitchat instances are connected
	SDPIComponents.streamDeckClient.getGlobalSettings().then((settings) => onSettingsReceived(settings));

	// Subscribe to global settings changes to detect Twitchat instances connection changes
	SDPIComponents.streamDeckClient.didReceiveGlobalSettings.subscribe((event) => {
		onSettingsReceived(event.payload.settings);
	});
	document.body.addEventListener('click', (event) => {
		const target = event.target;
		if (target.tagName === 'A' && target.href) {
			event.preventDefault();
			SDPIComponents.streamDeckClient.send('openUrl', { url: target.href });
		}
	});
});
