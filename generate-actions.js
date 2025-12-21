import fs from 'fs';
import path from 'path';

// Paths
const iconsSourceDir = './icons_source';
const actionsImgDir = './fr.twitchat.sdPlugin/imgs/actions';
const actionsUiDir = './fr.twitchat.sdPlugin/ui';
const actionsSrcDir = './src/actions';
const manifestPath = './fr.twitchat.sdPlugin/manifest.json';
const pluginPath = './src/plugin.ts';

/**
 * Convert icon filename to ID format (lowercase with dashes)
 * MY_ICON.svg -> my-icon
 */
function toId(filename) {
    return path.parse(filename).name.toLowerCase().replace(/_/g, '-');
}

/**
 * Convert icon filename to ID_ACTION format (name without extension)
 * MY_ICON.svg -> MY_ICON
 */
function toIdAction(filename) {
    return path.parse(filename).name;
}

/**
 * Convert icon filename to CamelCase
 * MY_ICON.svg -> MyIcon
 */
function toCamelCase(filename) {
    const name = path.parse(filename).name;
    return name.split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

/**
 * Convert icon filename to display name
 * MY_ICON.svg -> My icon
 */
function toDisplayName(filename) {
    const name = path.parse(filename).name;
    const words = name.toLowerCase().replace(/_/g, ' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Create action folder and copy icon
 * Returns true if created, false if skipped
 */
function createActionFolder(iconFile, id) {
    const targetDir = path.join(actionsImgDir, id);
    const targetPath = path.join(targetDir, 'icon.svg');
    
    // Check if icon already exists
    if (fs.existsSync(targetPath)) {
        console.log(`⊘ Skipped folder (already exists): ${targetDir}`);
        return false;
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy icon file
    const sourcePath = path.join(iconsSourceDir, iconFile);
    fs.copyFileSync(sourcePath, targetPath);
    
    console.log(`✓ Created folder and copied icon: ${targetDir}`);
    return true;
}

/**
 * Create action entry for manifest.json
 */
function createManifestEntry(iconFile, id) {
    return {
        "Name": toDisplayName(iconFile),
        "UUID": `fr.twitchat.action.${id}`,
        "Icon": `imgs/actions/${id}/icon`,
        "Tooltip": "",
        "PropertyInspectorPath": `ui/${id}.html`,
        "Controllers": [
            "Keypad"
        ],
        "States": [
            {
                "Image": `imgs/actions/${id}/icon`,
                "TitleAlignment": "middle"
            }
        ]
    };
}

/**
 * Update manifest.json with new actions
 */
function updateManifest(newActions) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Keep existing actions that aren't being regenerated
    const existingActionUUIDs = new Set(newActions.map(a => a.UUID));
    const keptActions = manifest.Actions.filter(a => !existingActionUUIDs.has(a.UUID));
    
    // Merge and sort alphabetically by UUID
    manifest.Actions = [...keptActions, ...newActions].sort((a, b) => 
        a.UUID.localeCompare(b.UUID)
    );
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t'));
    console.log(`✓ Updated manifest.json with ${newActions.length} actions`);
}

/**
 * Create HTML UI file
 * Returns true if created, false if skipped
 */
function createHtmlFile(iconFile, id) {
    const targetPath = path.join(actionsUiDir, `${id}.html`);
    
    // Check if HTML file already exists
    if (fs.existsSync(targetPath)) {
        console.log(`⊘ Skipped HTML file (already exists): ${targetPath}`);
        return false;
    }
    
    const displayName = toDisplayName(iconFile);
    
    const content = `<!DOCTYPE html>
<html>
	<head lang="en">
		<title>${displayName} Settings</title>
		<meta charset="utf-8" />
		<script src="https://sdpi-components.dev/releases/v3/sdpi-components.js"></script>
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
function createActionFile(iconFile, id) {
    const targetPath = path.join(actionsSrcDir, `${id}.ts`);
    
    // Check if action file already exists
    if (fs.existsSync(targetPath)) {
        console.log(`⊘ Skipped action file (already exists): ${targetPath}`);
        return false;
    }
    
    const idCamel = toCamelCase(iconFile);
    const idAction = toIdAction(iconFile);
    
    const content = `import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for ${toDisplayName(iconFile)}.
 */
@action({ UUID: "fr.twitchat.action.${id}" })
export class ${idCamel} extends SingletonAction<Settings> {
\toverride async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
\t\t// Your code here
\t\tTwitchatSocket.instance.broadcast("${idAction}");
\t}
}

/**
 * Settings for {@link ${idCamel}}.
 */
type Settings = {};
`;
    
    fs.writeFileSync(targetPath, content);
    console.log(`✓ Created action file: ${targetPath}`);
    return true;
}

/**
 * Update plugin.ts with imports and registrations
 */
function updatePluginFile(iconFiles) {
    let content = fs.readFileSync(pluginPath, 'utf8');
    
    // Generate new imports and registrations
    const newImports = iconFiles.map(iconFile => {
        const id = toId(iconFile);
        const idCamel = toCamelCase(iconFile);
        return `import { ${idCamel} } from "./actions/${id}";`;
    }).join('\n');
    
    const newRegistrations = iconFiles.map(iconFile => {
        const idCamel = toCamelCase(iconFile);
        return `streamDeck.actions.registerAction(new ${idCamel}());`;
    }).join('\n');
    
    // Remove old imports and registrations for regenerated actions
    const idsToReplace = iconFiles.map(toId);
    const camelCasesToReplace = iconFiles.map(toCamelCase);
    
    // Remove old imports
    idsToReplace.forEach(id => {
        const importPattern = new RegExp(`import \\{ \\w+ \\} from "\\.\\/actions\\/${id}";?\n?`, 'g');
        content = content.replace(importPattern, '');
    });
    
    // Remove old registrations
    camelCasesToReplace.forEach(camelCase => {
        const regPattern = new RegExp(`streamDeck\\.actions\\.registerAction\\(new ${camelCase}\\(\\)\\);?\n?`, 'g');
        content = content.replace(regPattern, '');
    });
    
    // Remove old "Register actions" comments
    content = content.replace(/\/\/ Register actions\n/g, '');
    content = content.replace(/\/\/ Finally, connect to the Stream Deck\.\n/g, '');
    
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
    
    // Insert new imports
    content = content.slice(0, importInsertIndex) + '\n' + newImports + '\n' + content.slice(importInsertIndex);
    
    // Insert new registrations (before streamDeck.connect())
    const connectIndex = content.indexOf('streamDeck.connect();');
    const beforeConnect = content.slice(0, connectIndex);
    const afterConnect = content.slice(connectIndex);
    
    // Add comment and registrations
    content = beforeConnect + '// Register actions\n' + newRegistrations + '\n\n// Finally, connect to the Stream Deck.\n' + afterConnect;
    
    fs.writeFileSync(pluginPath, content);
    console.log(`✓ Updated plugin.ts with ${iconFiles.length} imports and registrations`);
}

/**
 * Main function
 */
function main() {
    console.log('🚀 Starting action generation...\n');
    
    // Read all icon files
    const iconFiles = fs.readdirSync(iconsSourceDir)
        .filter(file => file.endsWith('.svg'))
        .sort();
    
    if (iconFiles.length === 0) {
        console.log('❌ No SVG files found in icons_source directory');
        return;
    }
    
    console.log(`Found ${iconFiles.length} icon(s):\n`);
    
    const newActions = [];
    const stats = {
        created: [],
        skipped: []
    };
    
    // Process each icon
    iconFiles.forEach(iconFile => {
        const id = toId(iconFile);
        const displayName = toDisplayName(iconFile);
        console.log(`\n📝 Processing: ${iconFile} -> ${id}`);
        
        // Check if this is a new action or existing one
        const folderCreated = createActionFolder(iconFile, id);
        const htmlCreated = createHtmlFile(iconFile, id);
        const fileCreated = createActionFile(iconFile, id);
        
        // Track creation status
        const isNew = folderCreated || htmlCreated || fileCreated;
        if (isNew) {
            stats.created.push(displayName);
        } else {
            stats.skipped.push(displayName);
        }
        
        // Create manifest entry
        const manifestEntry = createManifestEntry(iconFile, id);
        newActions.push(manifestEntry);
    });
    
    // Update manifest.json
    console.log('\n');
    updateManifest(newActions);
    
    // Update plugin.ts
    updatePluginFile(iconFiles);
    
    console.log('\n✅ Action generation complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total icons processed: ${iconFiles.length}`);
    console.log(`   Actions created: ${stats.created.length}`);
    console.log(`   Actions skipped (already exist): ${stats.skipped.length}`);
    
    if (stats.created.length > 0) {
        console.log('\n✨ Created actions:');
        stats.created.forEach(name => {
            console.log(`  ✓ ${name}`);
        });
    }
    
    if (stats.skipped.length > 0) {
        console.log('\n⊘ Skipped actions (already exist):');
        stats.skipped.forEach(name => {
            console.log(`  - ${name}`);
        });
    }
}

// Run the script
main();
