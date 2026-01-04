import { evaluate as MathEval } from 'mathjs';
import { randomBytes } from 'crypto';

export function formatDuration(millis: number, forceMinutes: boolean = false): string {
	const d_ms = 24 * 3600 * 1000;
	const h_ms = 3600 * 1000;
	const m_ms = 60 * 1000;
	const d = Math.floor(millis / d_ms);
	const h = Math.floor((millis - d * d_ms) / h_ms);
	const m = Math.floor((millis - d * d_ms - h * h_ms) / m_ms);
	const s = Math.floor((millis - d * d_ms - h * h_ms - m * m_ms) / 1000);
	let res = toDigits(s);
	if (m > 0 || h > 0 || forceMinutes) res = toDigits(m) + ':' + res;
	if (h > 0 || d > 0) res = toDigits(h) + ':' + res;
	if (d > 0) res = d + '-' + ' ' + res;
	return res;
}

export function toDigits(num: number, digits = 2): string {
	let res = num.toString();
	while (res.length < digits) res = '0' + res;
	return res;
}

export function parseTimerValue(value: string): { isValid: boolean; value: number | string } {
	if (!value || value.trim().length === 0) return { isValid: false, value: 0 };

	try {
		const num = MathEval(value);
		return { isValid: true, value: num };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_error) {
		// Ignore
	}

	// Consider value is valid if it contains placeholders
	if (/\{.*?\}/gi.test(value)) return { isValid: true, value };

	return { isValid: false, value: 0 };
}

export function UUID(): string {
	let uuid = '';
	const chars = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid += '-';
		} else if (i === 14) {
			uuid += '4';
		} else {
			const randomNum = Math.floor(Math.random() * chars.length);
			uuid += chars[randomNum];
		}
	}
	return uuid;
}

/**
 * Generates a URL-safe base64 secret key
 * @param bytes
 * @returns
 */
export function generateSecret(bytes: number = 32): string {
	return randomBytes(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
