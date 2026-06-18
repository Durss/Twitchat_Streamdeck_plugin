import { html } from './lit-core.min.js';

console.debug('[COMMON.JS] Start');
document.body.classList.add('hide');
const loader = document.createElement('sdpi-item');
loader.className = 'loader';
loader.innerHTML = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="30 30 40 43" preserveAspectRatio="xMidYMid" class="lds-eclipse">
	<style keep="true">
		.spinner-adf6S66 {
			animation: spin-adf6S66 0.6s infinite steps(12);
			transform-origin: 50px 51px;
		}
		@keyframes spin-adf6S66 {
			to { transform: rotate(360deg); }
		}
	</style>
	<path class="spinner-adf6S66" stroke="none" d="M30 50A20 20 0 0 0 70 50A20 22 0 0 1 30 50" fill="#ffffff"></path>
</svg>
`;
document.body.prepend(loader);
console.debug('[COMMON.JS] Loader mounted');

// Shared "status overlay" injected on every property inspector page.
// Instead of navigating to another HTML file (which loses the Stream Deck
// registration), we show/hide this overlay on top of the action's own UI.
const statusOverlay = document.createElement('div');
statusOverlay.id = 'status-overlay';
statusOverlay.innerHTML = `
	<div id="offline" style="display: none">
		<sdpi-item label="__MSG_main.secret-key__">
			<sdpi-textfield id="secretField" global setting="secretKey" disabled></sdpi-textfield>
			<div class="ctas">
				<sdpi-button id="resetBt"><sdpi-i18n key="main.reset-key"></sdpi-i18n> </sdpi-button>
				<sdpi-button id="copyBt"><sdpi-i18n key="main.copy"></sdpi-i18n> </sdpi-button>
				<sdpi-button id="copySuccess" style="display: none" disabled>
					<sdpi-i18n key="main.copy-success"></sdpi-i18n>
				</sdpi-button>
			</div>
		</sdpi-item>
		<sdpi-item>
			<sdpi-i18n key="main.key-instructions"></sdpi-i18n>
		</sdpi-item>
		<sdpi-item>
			<sdpi-i18n key="main.offline">
				<slot name="twitchat"><a href="https://twitchat.fr" target="_blank">Twitchat.fr</a></slot>
				<slot name="discord"><a href="https://discord.gg/fmqD2xUYvP" target="_blank">Discord</a></slot>
			</sdpi-i18n>
		</sdpi-item>
	</div>

	<sdpi-item id="multiple-instances" style="display: none">
		<sdpi-i18n key="main.multiple-instances"></sdpi-i18n>
	</sdpi-item>
`;
document.body.appendChild(statusOverlay);
console.debug('[COMMON.JS] Status overlay mounted');

function copyKey() {
	const keyField = statusOverlay.querySelector('#secretField');
	navigator.clipboard.writeText(keyField.value);

	const copyBt = statusOverlay.querySelector('#copyBt');
	const copySuccess = statusOverlay.querySelector('#copySuccess');
	copyBt.style.display = 'none';
	copySuccess.style.display = 'block';
	setTimeout(() => {
		copyBt.style.display = 'block';
		copySuccess.style.display = 'none';
	}, 1000);
}

function resetKey() {
	SDPIComponents.streamDeckClient.send('sendToPlugin', {
		action: 'resetSecretKey',
	});
}

statusOverlay.querySelector('#copyBt').addEventListener('click', copyKey);
statusOverlay.querySelector('#resetBt').addEventListener('click', resetKey);
customElements
	.whenDefined('sdpi-i18n')
	.then(() => {
		console.debug('[COMMON.JS] Found <sdpi-i18n> CustomElement');
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
}
mark {
	background-color: rgba(255, 255, 255, 0.15);
	padding: 0 2px;
	border-radius: 3px;
}
`);
				this.shadowRoot.adoptedStyleSheets.push(sheet);

				return html`<span .innerHTML=${result}></span>`;
			};

			// Force re-render of existing elements
			document.querySelectorAll('sdpi-i18n').forEach((el) => el.requestUpdate());
			console.debug('[COMMON.JS] <sdpi-i18n> CustomElement overriden');
		}
	})
	.catch((error) => {
		console.error('[COMMON.JS] <sdpi-i18n> CustomElement not found');
	});
/**
 * Called any time global settings are received or updated.
 * Watches for Twitchat instances connection changes and shows/hides the shared
 * status overlay accordingly — without ever navigating to another HTML file
 * (a full page navigation would drop the Stream Deck registration and the page
 * would never reconnect).
 * @param {*} settings
 */
function onSettingsReceived(settings) {
	console.debug('[COMMON.JS] onSettingsReceived:', settings);
	const count = settings.mainAppCount || 0;

	// First settings have arrived: stop showing the loader.
	document.body.classList.remove('hide');

	if (count === 1) {
		// Exactly one Twitchat instance: show this action's own UI.
		document.body.classList.remove('show-status');
	} else {
		// No instance (0) or multiple ambiguous instances (>1): show the overlay.
		document.body.classList.add('show-status');
		document.getElementById('offline').style.display = count === 0 ? 'block' : 'none';
		document.getElementById('multiple-instances').style.display = count > 1 ? 'block' : 'none';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	console.debug('[COMMON.JS] DOMContentLoaded');
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
