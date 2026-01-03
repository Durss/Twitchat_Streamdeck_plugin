import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Paths
const actionsImgDir = './fr.twitchat.sdPlugin/imgs/actions';
const actionsUiDir = './fr.twitchat.sdPlugin/ui';
const actionsSrcDir = './src/actions';
const manifestPath = './fr.twitchat.sdPlugin/manifest.json';
const pluginPath = './src/plugin.ts';
const frJsonPath = './fr.twitchat.sdPlugin/fr.json';
const localeJsPath = './fr.twitchat.sdPlugin/ui/locale.js';

// Create readline interface for prompts
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Prompt user for input
 */
function prompt(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

/**
 * Convert action ID to CamelCase for class name
 * my-action -> MyAction
 */
function toCamelCase(id) {
	return id
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join('');
}

/**
 * Convert action ID to ID_ACTION format (uppercase with underscores)
 * my-action -> MY_ACTION
 */
function toIdAction(id) {
	return id.toUpperCase().replace(/-/g, '_');
}

/**
 * Create action folder (without icon, as it should be created manually)
 * Returns true if created, false if skipped
 */
function createActionFolder(id) {
	const targetDir = path.join(actionsImgDir, id);

	// Check if folder already exists
	if (fs.existsSync(targetDir)) {
		console.log(`⊘ Skipped folder (already exists): ${targetDir}`);
		return false;
	}

	// Create directory
	fs.mkdirSync(targetDir, { recursive: true });

	console.log(`✓ Created folder: ${targetDir}`);
	console.log(`  ⚠️  Remember to add an icon.svg file in this folder!`);
	return true;
}

/**
 * Create action entry for manifest.json
 */
function createManifestEntry(id, name) {
	return {
		Name: name,
		UUID: `fr.twitchat.action.${id}`,
		Icon: `imgs/actions/${id}/icon`,
		Tooltip: '',
		PropertyInspectorPath: `ui/${id}.html`,
		Controllers: ['Keypad'],
		States: [
			{
				Image: `imgs/actions/${id}/icon`,
				TitleAlignment: 'middle',
			},
		],
	};
}

/**
 * Update manifest.json with new action
 */
function updateManifest(newAction) {
	const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

	// Check if action already exists
	const existingIndex = manifest.Actions.findIndex((a) => a.UUID === newAction.UUID);

	if (existingIndex >= 0) {
		// Update existing action
		manifest.Actions[existingIndex] = newAction;
		console.log(`✓ Updated existing action in manifest.json: ${newAction.UUID}`);
	} else {
		// Add new action
		manifest.Actions.push(newAction);
		console.log(`✓ Added new action to manifest.json: ${newAction.UUID}`);
	}

	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t'));
}

/**
 * Update fr.json with action key and french name
 */
function updateFrenchLocalization(actionUUID, frenchName) {
	if (!fs.existsSync(frJsonPath)) {
		fs.writeFileSync(frJsonPath, JSON.stringify({}, null, '\t'));
	}

	// Read existing fr.json
	const frJson = JSON.parse(fs.readFileSync(frJsonPath, 'utf8'));

	// Add or update action key
	frJson[actionUUID] = {
		Name: frenchName,
		Tooltip: frJson[actionUUID]?.Tooltip || '',
	};

	// Sort keys alphabetically for consistency
	const sortedFrJson = Object.keys(frJson)
		.sort()
		.reduce((acc, key) => {
			acc[key] = frJson[key];
			return acc;
		}, {});

	// Write back to file
	fs.writeFileSync(frJsonPath, JSON.stringify(sortedFrJson, null, '\t'));

	console.log(`✓ Updated fr.json with french name: "${frenchName}"`);
}

/**
 * Update locale.js with action key
 */
function updateLocaleFile(id) {
	// Read existing locale.js file
	let localeContent = fs.readFileSync(localeJsPath, 'utf8');

	// Helper function to extract locale object content with proper brace matching
	function extractLocaleContent(content, localeName) {
		const startPattern = new RegExp(`${localeName}:\\s*\\{`);
		const match = content.match(startPattern);
		if (!match) return null;

		const startIndex = match.index + match[0].length;
		let braceCount = 1;
		let endIndex = startIndex;

		while (braceCount > 0 && endIndex < content.length) {
			if (content[endIndex] === '{') braceCount++;
			if (content[endIndex] === '}') braceCount--;
			endIndex++;
		}

		return content.substring(startIndex, endIndex - 1);
	}

	// Build locale objects
	const enLocale = {};
	const frLocale = {};

	// Parse existing entries using eval (safe here as we control the source)
	const enContent = extractLocaleContent(localeContent, 'en');
	const frContent = extractLocaleContent(localeContent, 'fr');

	if (enContent && enContent.trim()) {
		try {
			// Use eval to parse JavaScript object literal (wrap content in braces)
			const parsed = eval(`({${enContent}})`);
			Object.assign(enLocale, parsed);
		} catch (e) {
			console.warn('Warning: Could not parse existing en locale, starting fresh', e.message);
		}
	}

	if (frContent && frContent.trim()) {
		try {
			// Use eval to parse JavaScript object literal (wrap content in braces)
			const parsed = eval(`({${frContent}})`);
			Object.assign(frLocale, parsed);
		} catch (e) {
			console.warn('Warning: Could not parse existing fr locale, starting fresh', e.message);
		}
	}

	// Add action key if it doesn't exist
	if (!enLocale[id]) {
		enLocale[id] = {};
	}

	if (!frLocale[id]) {
		frLocale[id] = {};
	}

	// Sort keys alphabetically for consistency
	const sortedEnLocale = Object.keys(enLocale)
		.sort()
		.reduce((acc, key) => {
			acc[key] = enLocale[key];
			return acc;
		}, {});

	const sortedFrLocale = Object.keys(frLocale)
		.sort()
		.reduce((acc, key) => {
			acc[key] = frLocale[key];
			return acc;
		}, {});

	// Helper function to format a property name (quote if needed)
	function formatPropertyName(key) {
		// Quote if contains dashes, spaces, or other special characters
		if (/[^a-zA-Z0-9_$]/.test(key)) {
			return `'${key}'`;
		}
		return key;
	}

	// Helper function to format a value as JavaScript
	function formatValue(val, baseIndent) {
		if (typeof val === 'string') {
			// Escape quotes, backslashes and newlines in strings
			const escapedVal = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
			return `'${escapedVal}'`;
		} else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
			// Format nested objects
			const nestedProps = Object.keys(val)
				.map((k) => {
					return `${baseIndent}\t\t${formatPropertyName(k)}: ${formatValue(val[k], baseIndent + '\t')}`;
				})
				.join(',\n');
			return nestedProps ? `{\n${nestedProps},\n${baseIndent}\t}` : '{}';
		} else if (Array.isArray(val)) {
			return JSON.stringify(val);
		} else if (typeof val === 'number' || typeof val === 'boolean') {
			return String(val);
		} else if (val === null) {
			return 'null';
		} else {
			return "''";
		}
	}

	// Helper function to format locale object as JavaScript
	function formatLocaleObject(obj, indent = '\t\t') {
		const entries = Object.keys(obj).map((key) => {
			const value = obj[key];
			const props = Object.keys(value)
				.map((prop) => {
					const val = value[prop];
					return `${indent}\t${formatPropertyName(prop)}: ${formatValue(val, indent)}`;
				})
				.join(',\n');
			const v = props ? `{\n${props},\n${indent}}` : '{}';
			return `${indent}${formatPropertyName(key)}: ${v}`;
		});
		return entries.join(',\n');
	}

	// Generate new locale.js content
	const newContent = `SDPIComponents.i18n.locales = {
\ten: {
${formatLocaleObject(sortedEnLocale)}
\t},
\tfr: {
${formatLocaleObject(sortedFrLocale)}
\t},
};
`;

	fs.writeFileSync(localeJsPath, newContent);
	console.log(`✓ Updated locale.js with action key: ${id}`);
}

/**
 * Create HTML UI file
 * Returns true if created, false if skipped
 */
function createHtmlFile(id, name) {
	const targetPath = path.join(actionsUiDir, `${id}.html`);

	// Check if HTML file already exists
	if (fs.existsSync(targetPath)) {
		console.log(`⊘ Skipped HTML file (already exists): ${targetPath}`);
		return false;
	}

	const content = `<!doctype html>
<html>
	<head lang="en">
		<title>Chat feed select Settings</title>
		<meta charset="utf-8" />
		<script src="https://sdpi-components.dev/releases/v3/sdpi-components.js"></script>
		<script type="module" src="./common.js"></script>
		<script src="./locale.js"></script>
		<link rel="stylesheet" href="./styles.css" />
	</head>

	<body>
	<!-- Property inspector components documentation https://sdpi-components.dev/docs/components -->
	</body>
</html>

`;

	fs.writeFileSync(targetPath, content);
	console.log(`✓ Created HTML file: ${targetPath}`);
	return true;
}

/**
 * Create TypeScript action file
 * Returns true if created, false if skipped
 */
function createActionFile(id, name) {
	const targetPath = path.join(actionsSrcDir, `${id}.ts`);

	// Check if action file already exists
	if (fs.existsSync(targetPath)) {
		console.log(`⊘ Skipped action file (already exists): ${targetPath}`);
		return false;
	}

	const className = toCamelCase(id);
	const eventName = toIdAction(id);

	const content = `import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for ${name}.
 */
@action({ UUID: 'fr.twitchat.action.${id}' })
export class ${className} extends AbstractAction<Settings> {
\toverride async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
\t\tTwitchatSocket.instance.broadcast('${eventName}');
\t}
}

/**
 * Settings for {@link ${className}}.
 */
type Settings = {};
`;

	fs.writeFileSync(targetPath, content);
	console.log(`✓ Created action file: ${targetPath}`);
	return true;
}

/**
 * Update plugin.ts with import and registration
 */
function updatePluginFile(id) {
	let content = fs.readFileSync(pluginPath, 'utf8');

	const className = toCamelCase(id);
	const newImport = `import { ${className} } from "./actions/${id}";`;
	const newRegistration = `streamDeck.actions.registerAction(new ${className}());`;

	// Check if import already exists
	const importPattern = new RegExp(`import \\{ ${className} \\} from "\\.\\/actions\\/${id}";`, 'g');
	const hasImport = importPattern.test(content);

	// Check if registration already exists
	const regPattern = new RegExp(`streamDeck\\.actions\\.registerAction\\(new ${className}\\(\\)\\);`, 'g');
	const hasRegistration = regPattern.test(content);

	if (hasImport && hasRegistration) {
		console.log(`⊘ Skipped plugin.ts update (already has import and registration)`);
		return false;
	}

	// Add import if not exists
	if (!hasImport) {
		// Find where to insert imports (after TwitchatSocket import, before any code)
		const twitchatImportMatch = content.match(/import TwitchatSocket from ["']\.\/TwitchatSocket["'];?\n/);
		let importInsertIndex;

		if (twitchatImportMatch) {
			importInsertIndex = content.indexOf(twitchatImportMatch[0]) + twitchatImportMatch[0].length;
		} else {
			// Fallback: insert after the last import statement
			const importRegex = /import.*from.*["'];?\n/g;
			const imports = content.match(importRegex);
			if (imports && imports.length > 0) {
				importInsertIndex = content.lastIndexOf(imports[imports.length - 1]) + imports[imports.length - 1].length;
			} else {
				importInsertIndex = content.indexOf('\n') + 1;
			}
		}

		// Insert new import
		content = content.slice(0, importInsertIndex) + newImport + '\n' + content.slice(importInsertIndex);
	}

	// Add registration if not exists
	if (!hasRegistration) {
		// Find the registration section (before streamDeck.connect())
		const connectMatch = content.match(/streamDeck\.connect\(\)/);

		if (!connectMatch) {
			console.warn('Warning: Could not find streamDeck.connect() call');
			return false;
		}

		const connectIndex = connectMatch.index;

		// Find the last registration before connect
		const beforeConnect = content.slice(0, connectIndex);
		const lastRegMatch = beforeConnect.match(/streamDeck\.actions\.registerAction\(new \w+\(\)\);/g);

		if (lastRegMatch && lastRegMatch.length > 0) {
			// Add after the last registration
			const lastReg = lastRegMatch[lastRegMatch.length - 1];
			const lastRegIndex = beforeConnect.lastIndexOf(lastReg) + lastReg.length;
			content = content.slice(0, lastRegIndex) + '\n' + newRegistration + content.slice(lastRegIndex);
		} else {
			// Add before connect with proper comments
			const beforeConnectContent = content.slice(0, connectIndex);
			const afterConnectContent = content.slice(connectIndex);
			content =
				beforeConnectContent +
				'// Register actions\n' +
				newRegistration +
				'\n\n// Finally, connect to the Stream Deck.\n' +
				afterConnectContent;
		}
	}

	fs.writeFileSync(pluginPath, content);
	console.log(`✓ Updated plugin.ts with import and registration`);
	return true;
}

/**
 * Main function
 */
async function main() {
	console.log('🚀 Stream Deck Action Generator\n');

	try {
		// Prompt for action ID
		const actionId = await prompt('Enter the action ID (e.g., my-action): ');
		if (!actionId) {
			console.error('❌ Action ID is required');
			rl.close();
			process.exit(1);
		}

		// Validate action ID format (lowercase with dashes)
		if (!/^[a-z0-9-]+$/.test(actionId)) {
			console.error('❌ Action ID must be lowercase with dashes only (e.g., my-action)');
			rl.close();
			process.exit(1);
		}

		// Prompt for English name
		const englishName = await prompt('Enter the action name (English): ');
		if (!englishName) {
			console.error('❌ English name is required');
			rl.close();
			process.exit(1);
		}

		// Prompt for French name
		const frenchName = await prompt('Enter the action name (French): ');
		if (!frenchName) {
			console.error('❌ French name is required');
			rl.close();
			process.exit(1);
		}

		rl.close();

		const fullUUID = `fr.twitchat.action.${actionId}`;
		console.log(`\n📝 Creating action with:`);
		console.log(`   UUID: ${fullUUID}`);
		console.log(`   English Name: ${englishName}`);
		console.log(`   French Name: ${frenchName}`);
		console.log('');

		// Create action folder
		const folderCreated = createActionFolder(actionId);

		// Create HTML file
		const htmlCreated = createHtmlFile(actionId, englishName);

		// Create TypeScript action file
		const actionFileCreated = createActionFile(actionId, englishName);

		// Create manifest entry
		const manifestEntry = createManifestEntry(actionId, englishName);
		updateManifest(manifestEntry);

		// Update French localization
		updateFrenchLocalization(fullUUID, frenchName);

		// Update locale.js
		updateLocaleFile(actionId);

		// Update plugin.ts with import and registration
		updatePluginFile(actionId);

		console.log('\n✅ Action generation complete!');

		if (folderCreated) {
			console.log(`\n⚠️  Don't forget to add an icon.svg file in: ${path.join(actionsImgDir, actionId)}`);
		}
	} catch (error) {
		console.error('\n❌ Error:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run the script
main();
