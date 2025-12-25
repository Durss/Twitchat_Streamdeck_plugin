import { action, KeyDownEvent } from '@elgato/streamdeck';
import TwitchatSocket from '../TwitchatSocket';
import { AbstractAction } from './AbstractActions';

/**
 * Action for Mod tools toggle.
 */
@action({ UUID: 'fr.twitchat.action.mod-tools-toggle' })
export class ModToolsToggle extends AbstractAction<Settings> {
	override async onKeyDown(_ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast('MOD_TOOLS_TOGGLE');
	}
}

/**
 * Settings for {@link ModToolsToggle}.
 */
type Settings = {};
