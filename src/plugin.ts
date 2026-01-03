import streamDeck from '@elgato/streamdeck';

import TwitchatSocket from './TwitchatSocket';

import { AutomodAccept } from './actions/automod-accept';
import { AutomodReject } from './actions/automod-reject';
import { BingoToggle } from './actions/bingo-toggle';
import { CensorDeletedMessagesToggle } from './actions/censor-deleted-messages-toggle';
import { ChatFeedRead } from './actions/chat-feed-read';
import { ChatFeedReadAll } from './actions/chat-feed-read-all';
import { ChatFeedReadEncoder } from './actions/chat-feed-read-encoder';
import { ChatFeedScroll } from './actions/chat-feed-scroll';
import { ChatFeedScrollDown } from './actions/chat-feed-scroll-down';
import { ChatFeedScrollUp } from './actions/chat-feed-scroll-up';
import { ChatFeedSelect } from './actions/chat-feed-select';
import { ClearChatHighlight } from './actions/clear-chat-highlight';
import { CountdownAdd } from './actions/countdown-add';
import { CounterAdd } from './actions/counter-add';
import { ExecuteTrigger } from './actions/execute-trigger';
import { GreetFeedRead } from './actions/greet-feed-read';
import { GreetFeedReadAll } from './actions/greet-feed-read-all';
import { HideAlert } from './actions/hide-alert';
import { MergeToggle } from './actions/merge-toggle';
import { ModToolsToggle } from './actions/mod-tools-toggle';
import { PollToggle } from './actions/poll-toggle';
import { PredictionToggle } from './actions/prediction-toggle';
import { QnaHighlight } from './actions/qna-highlight';
import { QnaSkip } from './actions/qna-skip';
import { RafflePickWinner } from './actions/raffle-pick-winner';
import { RaffleToggle } from './actions/raffle-toggle';
import { SendMessage } from './actions/send-message';
import { SetEmergencyMode } from './actions/set-emergency-mode';
import { Shoutout } from './actions/shoutout';
import { StopTts } from './actions/stop-tts';
import { TimerAdd } from './actions/timer-add';
import { ToggleTrigger } from './actions/toggle-trigger';
import { ViewersCountToggle } from './actions/viewers-count-toggle';
import { VoiceControl } from './actions/voice-control';
import { ChatFeedPause } from './actions/chat-feed-pause';
import { SetAnimatedText } from './actions/set-animated-text';
import { ShowBingoGrid } from './actions/show-bingo-grid';

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel('debug');

// Register actions
streamDeck.actions.registerAction(new AutomodAccept());
streamDeck.actions.registerAction(new AutomodReject());
streamDeck.actions.registerAction(new BingoToggle());
streamDeck.actions.registerAction(new CensorDeletedMessagesToggle());
streamDeck.actions.registerAction(new ChatFeedRead());
streamDeck.actions.registerAction(new ChatFeedReadAll());
streamDeck.actions.registerAction(new ChatFeedReadEncoder());
streamDeck.actions.registerAction(new ChatFeedScroll());
streamDeck.actions.registerAction(new ChatFeedScrollDown());
streamDeck.actions.registerAction(new ChatFeedScrollUp());
streamDeck.actions.registerAction(new ChatFeedSelect());
streamDeck.actions.registerAction(new ClearChatHighlight());
streamDeck.actions.registerAction(new CountdownAdd());
streamDeck.actions.registerAction(new CounterAdd());
streamDeck.actions.registerAction(new ExecuteTrigger());
streamDeck.actions.registerAction(new GreetFeedRead());
streamDeck.actions.registerAction(new GreetFeedReadAll());
streamDeck.actions.registerAction(new HideAlert());
streamDeck.actions.registerAction(new MergeToggle());
streamDeck.actions.registerAction(new ModToolsToggle());
streamDeck.actions.registerAction(new PollToggle());
streamDeck.actions.registerAction(new PredictionToggle());
streamDeck.actions.registerAction(new QnaHighlight());
streamDeck.actions.registerAction(new QnaSkip());
streamDeck.actions.registerAction(new RafflePickWinner());
streamDeck.actions.registerAction(new RaffleToggle());
streamDeck.actions.registerAction(new SendMessage());
streamDeck.actions.registerAction(new SetEmergencyMode());
streamDeck.actions.registerAction(new Shoutout());
streamDeck.actions.registerAction(new StopTts());
streamDeck.actions.registerAction(new TimerAdd());
streamDeck.actions.registerAction(new ToggleTrigger());
streamDeck.actions.registerAction(new ViewersCountToggle());
streamDeck.actions.registerAction(new VoiceControl());
streamDeck.actions.registerAction(new ChatFeedPause());
streamDeck.actions.registerAction(new SetAnimatedText());
streamDeck.actions.registerAction(new ShowBingoGrid());

// Finally, connect to the Stream Deck.
streamDeck.settings.useExperimentalMessageIdentifiers = true;
streamDeck.connect().then(() => {
	streamDeck.settings.setGlobalSettings<GlobalSettings>({
		clientCount: 0,
		mainAppCount: 0,
	});
});

TwitchatSocket.instance.initialize();

export type GlobalSettings = {
	/**
	 * Number of connected clients
	 */
	clientCount: number;
	/**
	 * Number of connected main applications
	 */
	mainAppCount: number;
};
