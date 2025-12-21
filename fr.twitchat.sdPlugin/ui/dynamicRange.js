/**
 * This is a workaround to display live value of sdpi-range.
 * Current sdpi-range UX isn't perfect as it doesn't display the current value
 * unless you hover the slider for 1 full second.
 * This script shows its value below the range.
 * 
 * Just add this within <sdpi-item> that contains an <sdpi-range>:
 * <span class="rangeValue">0</span>
 * And add the class "rangeWithValue" to the <sdpi-item>:
 * 
 * Full example:
 * 	<sdpi-item class="rangeWithValue" title="Range title" label="Label">
 *		<sdpi-range setting="readCount" min="0" max="100" step="1" default="1">
 *		</sdpi-range>
 *		<span class="rangeValue">0</span>
 *	</sdpi-item>
 */
document.addEventListener('DOMContentLoaded', () => {
	const rangeWithValue = document.querySelectorAll('.rangeWithValue');

	[...rangeWithValue].forEach(container => {
		const input = container.querySelector('sdpi-range').shadowRoot.querySelector('input');
		const valueDisplay = container.querySelector(".rangeValue");
		valueDisplay.style.display = "block";
		valueDisplay.style.textAlign = "center";
		valueDisplay.style.marginTop = "-8px";
		valueDisplay.style.fontStyle = "italic";
		valueDisplay.style.fontSize = ".9em";

		// Function to get the input from shadow root and display value
		function updateValue() {
			if (input) {
				valueDisplay.textContent = input.value;
			}
		}

		// Force initial update
		let updateCount = 1000/10;
		const interval = setInterval(() => {
			updateValue();
			if(--updateCount <= 0) {
				clearInterval(interval);
			}
		}, 10);

		// Listen for input changes
		if (input) {
			input.addEventListener('input', updateValue);
		}
	});
});