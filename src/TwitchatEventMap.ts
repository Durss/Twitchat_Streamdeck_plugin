/**
 * Union type of all possible event objects with discriminated type field
 */
export type TwitchatEvent = {
	[K in keyof TwitchatEventMap]: {
		type: K;
		data: TwitchatEventMap[K];
	};
}[keyof TwitchatEventMap];

/**
 * Converts a JSON string to a typed Twitchat event object.
 * The returned object has a discriminated union type, allowing TypeScript
 * to narrow the data type based on the "type" field.
 *
 * @example
 * const event = json2Event('{"type":"ON_TIMER_LIST","data":{...}}');
 * if(event.type === "ON_TIMER_LIST") {
 *   // TypeScript knows event.data is TwitchatEventMap["ON_TIMER_LIST"]
 *   event.data.timerList
 * }
 */
export function json2Event(json: string): TwitchatEvent {
	return JSON.parse(json) as TwitchatEvent;
}

/**
 * Twitchat event map
 *
 * Bellow that event list are shit loads of type definitions extracted from Twitchat
 */
export type TwitchatEventMap = {
	/**
	 * Twitchat completed initialization and is ready.
	 */
	ON_TWITCHAT_READY: undefined;
	/**
	 * OBS Websocket connection established
	 */
	ON_OBS_WEBSOCKET_CONNECTED: undefined;
	/**
	 * OBS Websocket connection lost
	 */
	ON_OBS_WEBSOCKET_DISCONNECTED: undefined;
	/**
	 * Set voice bot enabled/disabled state
	 */
	SET_VOICE_CONTROL_STATE: {
		/**
		 * Enable or disable voice control
		 * Omit to toggle current state
		 */
		enabled?: boolean;
	};
	/**
	 * Triggered when voice control state is updated
	 */
	ON_VOICE_CONTROL_STATE_CHANGE: {
		/**
		 * Voice control enabled state
		 */
		enabled: boolean;
	};
	/**
	 * Scroll a chat feed by a specific amount
	 */
	SET_CHAT_FEED_SCROLL: {
		/**
		 * Number of pixels to scroll by.
		 * Default value: 100
		 */
		scrollBy?: number;
		/**
		 * Column index
		 */
		colIndex: number;
		/**
		 * Scroll mode.
		 * Scroll by messages or by pixels.
		 */
		mode: 'messages' | 'pixels';
	};
	/**
	 * Move read marker in chat feed
	 */
	SET_CHAT_FEED_READ: {
		/**
		 * Number of messages to read
		 */
		count: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Mark all messages as read in a chat feed
	 */
	SET_CHAT_FEED_READ_ALL: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Pause auto-scrolling in a chat feed
	 */
	SET_CHAT_FEED_PAUSE_STATE: {
		/**
		 * Column index
		 */
		colIndex: number;
		/**
		 * Force paused state
		 * Omit to toggle current state
		 */
		pause?: boolean;
	};
	/**
	 * Scroll a chat feed to the bottom
	 */
	SET_CHAT_FEED_SCROLL_BOTTOM: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Move message selection in a chat feed
	 */
	SET_CHAT_FEED_SELECT: {
		/**
		 * Direction to move selection
		 * -1 = up
		 * 1 = down
		 * Can be greater than 1 or less than -1 to move multiple steps
		 */
		direction: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Delete the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_ACTION_DELETE: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Ban the user of the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_ACTION_BAN: {
		/**
		 * Column index
		 */
		colIndex: number;
		/**
		 * Optional ban duration in seconds.
		 * If not set, a permanent ban is done
		 */
		duration?: number;
	};
	/**
	 * Open action chooser for the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_CHOOSING_ACTION: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Save the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_ACTION_SAVE: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Highlight the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_ACTION_HIGHLIGHT: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Shoutout the user of the currently selected message in a chat feed
	 * First select a message with SET_CHAT_FEED_SELECT
	 */
	SET_CHAT_FEED_SELECT_ACTION_SHOUTOUT: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Cancel the action selection for the currently selected message in a chat feed
	 */
	SET_CHAT_FEED_SELECT_ACTION_CANCEL: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Mark messages as read in the greet them feed
	 */
	SET_GREET_FEED_READ: {
		/**
		 * Number of messages to mark as read
		 */
		messageCount: number;
	};
	/**
	 * Clears the greet them feed
	 */
	SET_GREET_FEED_READ_ALL: undefined;

	/**
	 * Triggered when the user changes Voicemod voice
	 */
	ON_VOICEMOD_VOICE_CHANGE: {
		/**
		 * Voice ID that got selected
		 */
		voiceId: string;
	};

	/**
	 * Request current ending credits overlay presence
	 * @answer SET_ENDING_CREDITS_PRESENCE
	 */
	GET_ENDING_CREDITS_PRESENCE: undefined;
	/**
	 * Response with current ending credits overlay presence
	 */
	SET_ENDING_CREDITS_PRESENCE: undefined;
	/**
	 * Request for ending credits data
	 * @answer SET_ENDING_CREDITS_DATA
	 */
	GET_ENDING_CREDITS_DATA: {
		/**
		 * Date offset to get data from
		 */
		dateOffset?: number;
		/**
		 * Include overlay parameters to response
		 */
		includeOverlayParams?: boolean;
	};
	/**
	 * Response with ending credits data
	 */
	SET_ENDING_CREDITS_DATA: StreamSummaryData;
	/**
	 * Triggered when ending credits animation completes
	 */
	ON_ENDING_CREDITS_COMPLETE: undefined;
	/**
	 * Receive ending credits configuration data
	 */
	ON_ENDING_CREDITS_CONFIGS: EndingCreditsParams;
	/**
	 * Control ending credits playback
	 */
	SET_ENDING_CREDITS_CONTROL: {
		/**
		 * Go to previous section
		 */
		prev?: true;
		/**
		 * Go to next section
		 */
		next?: true;
		/**
		 * Scrolling speed multiplier (can be negative for reverse direction)
		 */
		speed?: number;
		/**
		 * Section ID to jump to
		 */
		scrollToSectionID?: string;
	};

	/**
	 * Request current chat highlight overlay presence
	 * @answer SET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE
	 */
	GET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for highlight overlay presence
	 */
	SET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE: undefined;
	/**
	 * Send a clip to the chat highlight overlay
	 */
	SET_CHAT_HIGHLIGHT_OVERLAY_CLIP: ChatHighlightInfo;
	/**
	 * Send a message to the chat highlight overlay
	 */
	SET_CHAT_HIGHLIGHT_OVERLAY_MESSAGE: ChatHighlightInfo | undefined;

	/**
	 * Triggered when a message is marked or unmarked as read
	 */
	ON_MESSAGE_MARKED_AS_READ: {
		/**
		 * Manually marked as read
		 */
		manual: boolean;
		/**
		 * Message actually selected (marked as read) or unselected (unmarked)
		 */
		selected: boolean;
		/**
		 * Channel ID of the message
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};

	/**
	 * Request animated text overlay configuration
	 * @answer ON_ANIMATED_TEXT_CONFIGS
	 */
	GET_ANIMATED_TEXT_CONFIGS: {
		/**
		 * Animated text overlay ID
		 */
		id: string;
	};
	/**
	 * Receive animated text overlay configuration
	 */
	ON_ANIMATED_TEXT_CONFIGS: AnimatedTextData;
	/**
	 * Set text content for an animated text overlay
	 */
	SET_ANIMATED_TEXT_CONTENT: {
		/**
		 * Overlay ID to send the text to
		 */
		id: string;
		/**
		 * Query ID to identify this text set action
		 * Returned by the ANIMATED_TEXT_SHOW_COMPLETE, ANIMATED_TEXT_HIDE_COMPLETE and ANIMATED_TEXT_CLOSE events
		 */
		queryId: string;
		/**
		 * Text to display
		 */
		text: string;
		/**
		 * Auto hide after showing.
		 * Duration is based on the text length and animated text settings
		 */
		autoHide?: boolean;
		/**
		 * Hides current text immediately, bypassing any hide animation, empty the
		 * message queue and shows the new text right away.
		 */
		bypassAll?: boolean;
	};
	/**
	 * Triggered when an animated text show animation completes
	 */
	ON_ANIMATED_TEXT_SHOW_COMPLETE: {
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};
	/**
	 * Triggered when an animated text hide animation completes
	 */
	ON_ANIMATED_TEXT_HIDE_COMPLETE: {
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};
	/**
	 * Triggered when an animated text overlay close animation completes
	 */
	ON_ANIMATED_TEXT_CLOSE: {
		/**
		 * ID of the overlay that finished closing animation
		 */
		id: string;
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};

	/**
	 * Request bingo grid configuration
	 * @answer ON_BINGO_GRID_CONFIGS
	 */
	GET_BINGO_GRID_CONFIGS: {
		/**
		 * Bingo grid ID to get parameters for
		 */
		id: string;
	};
	/**
	 * Receive a bingo grid configuration
	 */
	ON_BINGO_GRID_CONFIGS: {
		/**
		 * Bingo grid ID
		 */
		id: string;
		/**
		 * Bingo configs
		 */
		bingo: BingoGridConfig | null;
		/**
		 * Row indexes to show a bingo animation on
		 */
		newVerticalBingos?: number[];
		/**
		 * Column indexes to show a bingo animation on
		 */
		newHorizontalBingos?: number[];
		/**
		 * Diagonal indexes to show a bingo animation on
		 * 0 => top-left to bottom-right
		 * 1 => bottom-left to top-right
		 */
		newDiagonalBingos?: (0 | 1)[];
	};
	/**
	 * Advertise bingo grid overlay presence
	 */
	SET_BINGO_GRID_OVERLAY_PRESENCE: {
		/**
		 * Bingo grid ID to advertise presence of
		 */
		id: string;
	};
	/**
	 * Set bingo grid visibility
	 */
	SET_BINGO_GRID_CONFIGS_VISIBILITY: {
		/**
		 * Bingo grid ID to change visibility of
		 **/
		id: string;
		/**
		 * Show or hide the bingo grid
		 * Omit to toggle current visibility
		 */
		show?: boolean;
	};
	/**
	 * Triggered when a heat click occurs on a bingo grid cell
	 */
	ON_BINGO_GRID_HEAT_CLICK: {
		/**
		 * Bingo grid ID to get parameters for
		 */
		id: string;
		/**
		 * Cell entry ID that was clicked
		 */
		entryId: string;
		/**
		 * Heat click data
		 */
		click: HeatClickData;
	};
	/**
	 * Triggered when a viewer completes a bingo
	 */
	ON_BINGO_GRID_VIEWER_EVENT: {
		/**
		 * Bingo grid ID
		 */
		id: string;
		/**
		 * User info
		 */
		user: {
			name: string;
			id: string;
			avatar: string;
		};
		/**
		 * Number of bingos completed (lines, rows, diagonals)
		 */
		count: number;
	};
	/**
	 * Receive bingo grid leaderboard
	 */
	ON_BINGO_GRID_LEADER_BOARD: {
		/**
		 * Bingo grid ID
		 */
		id: string;
		/**
		 * Scoreboard entries
		 * Set to undefined to hide the leaderboard
		 */
		scores?: {
			user_name: string;
			user_pic: string | undefined;
			score: number;
			pos: number;
		}[];
	};

	/**
	 * Request list of all counters
	 * @answer ON_COUNTER_LIST
	 */
	GET_ALL_COUNTERS: undefined;
	/**
	 * Receive the list of all counters
	 */
	ON_COUNTER_LIST: {
		counterList: {
			id: string;
			name: string;
			perUser: boolean;
		}[];
	};
	/**
	 * Request a specific counter entity
	 * @answer ON_COUNTER_UPDATE
	 */
	GET_COUNTER: {
		/**
		 * Counter ID to get value of
		 */
		id: string;
	};
	/**
	 * Receive counter update
	 */
	ON_COUNTER_UPDATE: {
		/**
		 * Counter data
		 */
		counter: CounterData;
	};
	/**
	 * Add a value to a counter
	 */
	SET_COUNTER_ADD: {
		/**
		 * Counter ID to add value to
		 */
		id: string;
		/**
		 * Action to perform
		 */
		action: TriggerActionCountDataAction;
		/**
		 * Value to add to the counter.
		 * Typed as string cause it can be an arithmetic expression or
		 * it can contain placeholders
		 */
		value: string;
	};

	/**
	 * Request custom train data and state
	 * @answer ON_CUSTOM_TRAIN_DATA
	 */
	GET_CUSTOM_TRAIN_DATA: {
		/**
		 * Custom train ID to get state for
		 * */
		id: string;
	};
	/**
	 * Receive custom train configuration and state
	 */
	ON_CUSTOM_TRAIN_DATA: {
		configs: CustomTrainData;
		state: CustomTrainState;
	};

	/**
	 * Request distortion overlay configuration
	 * @answer ON_DISTORT_OVERLAY_CONFIGS
	 */
	GET_DISTORT_OVERLAY_CONFIGS: {
		/**
		 * Distortion overlay ID to get parameters for
		 */
		id: string;
	};
	/**
	 * Receive a distortion overlay configuration data
	 */
	ON_DISTORT_OVERLAY_CONFIGS: {
		params: HeatDistortionData;
	};

	/**
	 * Request donation goals overlay configuration
	 * @answer ON_DONATION_GOALS_OVERLAY_CONFIGS
	 */
	GET_DONATION_GOALS_OVERLAY_CONFIGS: {
		/**
		 * Overlay ID to get parameters for
		 */
		id: string;
	};
	/**
	 * Receive a donation goals overlay configurations
	 */
	ON_DONATION_GOALS_OVERLAY_CONFIGS: {
		/**
		 * Overlay parameters
		 */
		params: DonationGoalOverlayConfig;
		/**
		 * Goal to reach
		 */
		goal: number;
		/**
		 * Amount raised so far
		 */
		raisedTotal: number;
		/**
		 * Amount raised on our personnal fundraiser account.
		 * Only used for Streamlabs Charity to differenciate between personal donations and
		 * the total amount raised for the charity
		 */
		raisedPersonnal: number;
		/**
		 * Optional skin name
		 * @private
		 */
		skin: 'default' | string;
	};
	/**
	 * Triggered when a donation event occurs
	 */
	ON_DONATION_EVENT: {
		/**
		 * Overlay ID the donation event should be displayed on
		 */
		overlayId: string;
		/**
		 * Donation event username
		 */
		username: string;
		/**
		 * Donation amount
		 */
		amount: string;
	};

	/**
	 * Request current playing track information
	 * @answer ON_CURRENT_TRACK
	 */
	GET_CURRENT_TRACK: undefined;
	/**
	 * Receive current track information
	 */
	ON_CURRENT_TRACK: {
		/**
		 * Music player parameters
		 */
		params: MusicPlayerParamsData;
		/**
		 * Current track title
		 */
		trackName?: string;
		/**
		 * Current track artist name
		 */
		artistName?: string;
		/***
		 * Current track duration in milliseconds
		 */
		trackDuration?: number;
		/**
		 * Current track playback position in milliseconds
		 */
		trackPlaybackPos?: number;
		/**
		 * Current track cover URL
		 */
		cover?: string;
		/**
		 * Optional skin name
		 * @private
		 */
		skin?: string;
	};
	/**
	 * Triggered when a track is added to the music queue
	 */
	ON_TRACK_ADDED_TO_QUEUE: MusicTrackData;

	/**
	 * Triggered when a heat click occurs on the music player
	 */
	ON_MUSIC_PLAYER_HEAT_CLICK: HeatClickData;

	/**
	 * Request polls overlay presence
	 * @answer ON_POLLS_OVERLAY_PRESENCE
	 */
	GET_POLLS_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for polls overlay presence
	 */
	ON_POLLS_OVERLAY_PRESENCE: undefined;
	/**
	 * Request polls overlay configuration
	 * @answer ON_POLL_OVERLAY_CONFIGS
	 */
	GET_POLLS_OVERLAY_CONFIGS: undefined;
	/**
	 * Receive poll overlay configuration
	 */
	ON_POLL_OVERLAY_CONFIGS: { parameters: PollOverlayParamStoreData };
	/**
	 * Triggered when poll progress updates.
	 * If no active poll, body is undefined
	 */
	ON_POLL_PROGRESS:
		| {
				/**
				 * Poll's data
				 */
				poll: MessagePollData;
		  }
		| undefined;

	/**
	 * Request predictions overlay presence
	 * @answer ON_PREDICTIONS_OVERLAY_PRESENCE
	 */
	GET_PREDICTIONS_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for predictions overlay presence
	 */
	ON_PREDICTIONS_OVERLAY_PRESENCE: undefined;
	/**
	 * Request predictions overlay configuration
	 * @answer ON_PREDICTION_OVERLAY_CONFIGS
	 */
	GET_PREDICTIONS_OVERLAY_CONFIGS: undefined;
	/**
	 * Receive prediction overlay configuration
	 */
	ON_PREDICTION_OVERLAY_CONFIGS: {
		/**
		 * Prediction overlay parameters
		 */
		parameters: PredictionOverlayParamStoreData;
	};
	/**
	 * Triggered when prediction progress updates
	 * If no active prediction, body is undefined
	 */
	ON_PREDICTION_PROGRESS:
		| {
				/**
				 * Prediction's data
				 */
				prediction: MessagePredictionData;
		  }
		| undefined;

	/**
	 * Request timer overlay presence
	 * @answer ON_TIMER_OVERLAY_PRESENCE
	 */
	GET_TIMER_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for timer overlay presence
	 */
	ON_TIMER_OVERLAY_PRESENCE: undefined;
	/**
	 * Request list of all timers
	 * @answer ON_TIMER_LIST
	 */
	GET_TIMER_LIST: undefined;
	/**
	 * Receive list of all timers and countdowns
	 */
	ON_TIMER_LIST: {
		/**
		 * List of timers and countdowns
		 */
		timerList: ({
			/**
			 * Timer ID
			 */
			id: string;
			/**
			 * Timer title
			 */
			title: string;
			/**
			 * Is the timer enabled ?
			 */
			enabled: boolean;
			/**
			 * Timer type
			 */
			type: 'timer' | 'countdown';
		} & Pick<
			TimerData,
			'isDefault' | 'startAt_ms' | 'endAt_ms' | 'offset_ms' | 'pauseDuration_ms' | 'paused' | 'pausedAt_ms' | 'duration_ms'
		>)[];
	};

	/**
	 * Request specific timer configuration
	 * @answer ON_TIMER_START
	 */
	GET_TIMER: {
		/**
		 * Timer ID to get configs for
		 */
		id: string;
	};
	/**
	 * Triggered when a timer starts
	 */
	ON_TIMER_START: TimerData;
	/**
	 * Add time to a timer
	 */
	SET_TIMER_ADD: {
		/**
		 * Timer ID to add time to
		 */
		id?: string;
		/**
		 * Value to add to the timer.
		 * Typed as string cause it can be an arithmetic expression or
		 * it can contain placeholders
		 */
		value: string;
	};
	/**
	 * Triggered when a timer stops
	 */
	ON_TIMER_STOP: TimerData;
	/**
	 * Triggered when a countdown starts
	 */
	ON_COUNTDOWN_START: TimerData;
	/**
	 * Add time to a countdown
	 */
	SET_COUNTDOWN_ADD: {
		/**
		 * Countdown ID to add time to
		 */
		id?: string;
		/**
		 * Value to add to the countdown.
		 * Typed as string cause it can be an arithmetic expression or
		 * it can contain placeholders
		 */
		value: string;
	};
	/**
	 * Triggered when a countdown completes
	 */
	ON_COUNTDOWN_COMPLETE: TimerData;

	/**
	 * Request wheel overlay presence
	 * @answer ON_WHEEL_OVERLAY_PRESENCE
	 */
	GET_WHEEL_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for wheel overlay presence
	 */
	ON_WHEEL_OVERLAY_PRESENCE: undefined;
	/**
	 * Triggered when wheel overlay animation starts
	 */
	ON_WHEEL_OVERLAY_START: WheelData;
	/**
	 * Triggered when wheel overlay animation completes
	 */
	ON_WHEEL_OVERLAY_ANIMATION_COMPLETE: {
		/**
		 * Winner info
		 */
		winner: EntryItem;
		/**
		 * Raffle session ID the animation is for
		 */
		sessionId: string;
		/**
		 * Delay in ms before sending a chat message about the result
		 */
		delay?: number;
	};

	/**
	 * Request ad break overlay presence
	 * @answer ON_AD_BREAK_OVERLAY_PRESENCE
	 */
	GET_AD_BREAK_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for ad break overlay presence
	 */
	ON_AD_BREAK_OVERLAY_PRESENCE: undefined;
	/**
	 * Request ad break overlay configuration
	 * @answer ON_AD_BREAK_OVERLAY_CONFIGS
	 */
	GET_AD_BREAK_OVERLAY_CONFIGS: undefined;
	/**
	 * Receive ad break overlay configuration
	 */
	ON_AD_BREAK_OVERLAY_CONFIGS: AdBreakOverlayData;
	/**
	 * Triggered when an ad break occurs
	 */
	ON_AD_BREAK_OVERLAY_DATA: CommercialData;

	/**
	 * Request bitswall overlay presence
	 * @answer ON_BITSWALL_OVERLAY_PRESENCE
	 */
	GET_BITSWALL_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for bitswall overlay presence
	 */
	ON_BITSWALL_OVERLAY_PRESENCE: undefined;
	/**
	 * Request bitswall overlay configuration
	 * @answer ON_BITSWALL_OVERLAY_CONFIGS
	 */
	GET_BITSWALL_OVERLAY_CONFIGS: undefined;
	/**
	 * Receive bitswall overlay configuration
	 */
	ON_BITSWALL_OVERLAY_CONFIGS: BitsWallOverlayData;

	/**
	 * Request chat poll overlay presence
	 * @answer ON_CHAT_POLL_OVERLAY_PRESENCE
	 */
	GET_CHAT_POLL_OVERLAY_PRESENCE: undefined;
	/**
	 * Advertise for chat poll overlay presence
	 */
	ON_CHAT_POLL_OVERLAY_PRESENCE: undefined;
	/**
	 * Request chat poll overlay configuration
	 * @answer ON_CHAT_POLL_OVERLAY_CONFIGS
	 */
	GET_CHAT_POLL_OVERLAY_CONFIGS: undefined;
	/**
	 * Receive chat poll overlay configuration
	 */
	ON_CHAT_POLL_OVERLAY_CONFIGS: { parameters: PollOverlayParamStoreData };
	/**
	 * Triggered when chat poll progress updates
	 */
	ON_CHAT_POLL_PROGRESS: { poll: ChatPollData } | undefined;

	/**
	 * A chat message has been deleted
	 */
	ON_MESSAGE_DELETED: {
		/**
		 * Channel ID the message was deleted from
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when a user sends bits (cheers)
	 */
	ON_BITS: {
		/**
		 * Channel ID where bits were sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * Parsed message chunks
		 */
		message_chunks?: ParseMessageChunk[];
		/**
		 * User who sent bits
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		/**
		 * Number of bits sent
		 */
		bits: number;
		/**
		 * Whether the message is pinned
		 */
		pinned: boolean;
		/**
		 * Pin level (1-10)
		 */
		pinLevel: number;
	};
	/**
	 * Triggered when a whisper message is received
	 */
	ON_MESSAGE_WHISPER: {
		/**
		 * Number of unread whispers
		 */
		unreadCount: number;
		/**
		 * Message received
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when a message is received from a non-follower
	 */
	ON_MESSAGE_FROM_NON_FOLLOWER: {
		/**
		 * Channel ID where the message was sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when the streamer is mentioned in a message
	 */
	ON_MENTION: {
		/**
		 * Channel ID where the message was sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when a user sends their first message of the day
	 */
	ON_MESSAGE_FIRST_TODAY: {
		/**
		 * Channel ID where the message was sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when a user sends their first message ever in the channel
	 */
	ON_MESSAGE_FIRST_ALL_TIME: {
		/**
		 * Channel ID where the message was sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	/**
	 * Triggered when a channel point reward is redeemed
	 */
	ON_REWARD_REDEEM: {
		/**
		 * Channel ID where the reward was redeemed
		 */
		channel: string;
		/**
		 * Optional message sent with the reward redemption
		 */
		message?: string;
		/**
		 * Parsed message chunks
		 */
		message_chunks?: ParseMessageChunk[];
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		/**
		 * Reward info
		 */
		reward: {
			id: string;
			cost: number;
			title: string;
		};
	};
	/**
	 * Triggered when a subscription event occurs (new sub, resub, gift, etc.)
	 */
	ON_SUBSCRIPTION: {
		/**
		 * Channel ID where the subscription event occurred
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * Parsed message chunks
		 */
		message_chunks: ParseMessageChunk[];
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		/**
		 * Subscription tier
		 */
		tier: MessageSubscriptionData['tier'];
		/**
		 * Number of months the user subscribed for
		 */
		months: number;
		/**
		 * List of gift recipients (empty if not a gift)
		 */
		recipients: { uid: string; login: string }[];
		/**
		 * Number of consecutive months the user has been subscribed
		 */
		streakMonths: number;
		/**
		 * Total number of months the user has been subscribed for
		 */
		totalSubDuration: number;
		/**
		 * Number of gifts sent
		 */
		giftCount: number;
		/**
		 * Is subscription a Prime upgrade (went from prime to normal sub)
		 */
		isPrimeUpgrade: boolean;
		/**
		 * Is subscription a gift
		 */
		isGift: boolean;
		/**
		 * Is subscription a gift upgrade (gifted sub upgraded to normal sub)
		 */
		isGiftUpgrade: boolean;
		/**
		 * Is subscription a resubscription
		 */
		isResub: boolean;
	};
	/**
	 * Triggered when a user follows the channel
	 */
	ON_FOLLOW: {
		/**
		 * Channel ID where the follow occurred
		 */
		channel: string;
		/**
		 * Message content
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};

	/**
	 * Enable/disable/toggle emergency mode
	 * Either give an object with "enabled" boolean to force a specific
	 * state, or don't give any parameter to toggle current state
	 */
	SET_EMERGENCY_MODE:
		| {
				/**
				 * New emergency mode state
				 */
				enabled: boolean;
				/**
				 * If set to true, a confirmation modal will be shown
				 * to confirm the action
				 */
				promptConfirmation?: boolean;
		  }
		| undefined;
	ON_EMERGENCY_MODE_CHANGED: {
		/**
		 * New emergency mode state
		 */
		enabled: boolean;
	};

	/**
	 * Request available label overlay placeholders
	 * @answer ON_LABEL_OVERLAY_PLACEHOLDERS
	 */
	GET_LABEL_OVERLAY_PLACEHOLDERS: undefined;
	/**
	 * Advertise for label overlay placeholders
	 */
	ON_LABEL_OVERLAY_PLACEHOLDERS: {
		/**
		 * Hashmap of available placeholders
		 */
		[tag: string]: {
			/**
			 * Placeholder value
			 */
			value: string | number;
			/**
			 * Placeholder type
			 */
			type:
				| 'string'
				| 'number'
				| 'date'
				| 'time'
				| 'datetime'
				| 'day'
				| 'month'
				| 'year'
				| 'hours'
				| 'minutes'
				| 'seconds'
				| 'duration'
				| 'image';
		};
	};
	/**
	 * Request label overlay configuration
	 * @answer ON_LABEL_OVERLAY_CONFIGS
	 */
	GET_LABEL_OVERLAY_CONFIGS: {
		/**
		 * Label ID
		 */
		id: string;
	};
	/**
	 * Receive label overlay configuration
	 */
	ON_LABEL_OVERLAY_CONFIGS: {
		/**
		 * Label ID
		 */
		id: string;
		/**
		 * Label data
		 */
		data: LabelItemData | null;
		/**
		 * Does the label actually exists ?
		 * If not, overlay will show an error
		 */
		exists?: boolean;
		/**
		 * False if label mode is "placeholder" but related placeholder doesn't exist
		 */
		isValid?: boolean;
	};

	/**
	 * Request number of chat columns
	 * @answer ON_CHAT_COLUMNS_COUNT
	 */
	GET_CHAT_COLUMNS_COUNT: undefined;
	/**
	 * Receive number of chat columns
	 */
	ON_CHAT_COLUMNS_COUNT: {
		/**
		 * Number of chat columns
		 */
		count: number;
	};

	/**
	 * Request list of all Q&A sessions
	 * @answer ON_QNA_SESSION_LIST
	 */
	GET_QNA_SESSION_LIST: undefined;
	/**
	 * Receive list of all Q&A sessions
	 */
	ON_QNA_SESSION_LIST: {
		/**
		 * Available Q&A sessions
		 */
		sessionList: {
			/**
			 * Q&A session ID
			 */
			id: string;
			/**
			 * Command to use to submit a new entry
			 */
			command: string;
			/**
			 * Is the Q&A session currently open for new entries
			 */
			open: boolean;
		}[];
	};
	/**
	 * Highlights the top most message of given Q&A session
	 */
	SET_QNA_HIGHLIGHT: {
		/**
		 * Q&A session ID
		 */
		id: string;
	};
	/**
	 * Skips the top most message of given Q&A session
	 */
	SET_QNA_SKIP: {
		/**
		 * Q&A session ID
		 */
		id: string;
	};

	/**
	 * Execute a specific trigger manually
	 */
	SET_EXECUTE_TRIGGER: {
		/**
		 * Trigger ID to execute
		 */
		id: string;
	};
	/**
	 * Request list of all triggers
	 * @answer ON_TRIGGER_LIST
	 */
	GET_TRIGGER_LIST: undefined;
	/**
	 * Receive list of all triggers
	 */
	ON_TRIGGER_LIST: {
		/**
		 * Available trigger list
		 */
		triggerList: {
			/**
			 * Trigger ID
			 */
			id: string;
			/**
			 * Trigger name
			 */
			name: string;
			/**
			 * Is the trigger currently disabled
			 */
			disabled: boolean;
		}[];
	};
	/**
	 * Enable or disable a specific trigger
	 */
	SET_TRIGGER_STATE: {
		/**
		 * Trigger ID to change state of
		 */
		id: string;
		/**
		 * Force trigger state:
		 * - true: enable it
		 * - false: disable it
		 *
		 * Omit this field to toggle current state
		 */
		forcedState?: boolean;
	};

	/**
	 * Play an SFXR sound
	 */
	SET_PLAY_SFXR: {
		/**
		 * SFXR sound parameters as a string
		 * Generate string at:
		 * https://tsfxr.jdmnk.dev
		 */
		params: string;
		/**
		 * Volume from 0 to 1
		 */
		volume: number;
	};

	/**
	 * Accept latest message held by automod
	 */
	SET_AUTOMOD_ACCEPT: undefined;
	/**
	 * Reject latest message held by automod
	 */
	SET_AUTOMOD_REJECT: undefined;
	/**
	 * Triggered when a message is held by automod
	 */
	ON_AUTOMOD_MESSAGE_HELD: {
		/**
		 * Channel ID where the message was sent
		 */
		channel: string;
		/**
		 * Message content
		 */
		message: string;
		/**
		 * User info
		 */
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	} | null;
	/**
	 * Toggle merge feature
	 * See settings => chat features => Merge consecutive messages of a user
	 */
	SET_MERGE_TOGGLE: undefined;
	/**
	 * Hide current chat alert
	 * See settings => chat features => Enable chat alert
	 */
	SET_HIDE_CHAT_ALERT: undefined;
	/**
	 * Toggle current poll display
	 */
	SET_POLL_TOGGLE: undefined;
	/**
	 * Toggle current prediction display
	 */
	SET_PREDICTION_TOGGLE: undefined;
	/**
	 * Toggle current bingo display (NOT bingo GRID!)
	 */
	SET_BINGO_TOGGLE: undefined;
	/**
	 * Toggle viewers count display
	 */
	SET_VIEWERS_COUNT_TOGGLE: undefined;
	/**
	 * Toggle moderation tools display
	 */
	SET_MOD_TOOLS_TOGGLE: undefined;
	/**
	 * Toggle censorship of deleted messages
	 */
	SET_CENSOR_DELETED_MESSAGES_TOGGLE: undefined;
	/**
	 * Toggle current raffle display
	 */
	SET_RAFFLE_TOGGLE: undefined;
	/**
	 * Shoutout the user that raided the channel the most recently
	 */
	SET_SHOUTOUT_LAST_RAIDER: undefined;
	/**
	 * Clear any current message or clip displayed in chat highlight overlay
	 */
	SET_CLEAR_CHAT_HIGHLIGHT: undefined;
	/**
	 * Stop any Twitch poll currently running
	 */
	SET_STOP_POLL: undefined;
	/**
	 * Stop any Twitch prediction currently running
	 */
	SET_STOP_PREDICTION: undefined;
	/**
	 * Send a message to chat
	 */
	SET_SEND_MESSAGE: {
		/**
		 * Message content to send
		 */
		message: string;
	};
	/**
	 * Pick a winner for the first active raffle.
	 * If multiple raffles are active, only the first one started will be considered.
	 */
	SET_RAFFLE_PICK_WINNER: undefined;
	/**
	 * Stop any current text-to-speech audio playback
	 */
	SET_STOP_CURRENT_TTS_AUDIO: undefined;
	/**
	 * Send a custom message to the chat feed with optional styling and actions
	 */
	SET_SEND_CUSTOM_CHAT_MESSAGE: {
		/**
		 * Message to display
		 */
		message?: string;
		/**
		 * Defines if the close button should be displayed
		 * Defaults to "true" if omitted
		 */
		canClose?: boolean;
		/**
		 * Defines if the message should be displayed on the "greet them" section
		 */
		todayFirst?: boolean;
		/**
		 * User info
		 */
		user?: {
			name: string;
			color?: string;
		};
		/**
		 * Column index to display the message to
		 */
		col?: number;
		/**
		 * Button icon see list of values above
		 */
		icon?:
			| 'ad'
			| 'add'
			| 'alert'
			| 'animate'
			| 'announcement'
			| 'anon'
			| 'api'
			| 'automod'
			| 'badge'
			| 'ban'
			| 'bingo'
			| 'bits'
			| 'block'
			| 'boost'
			| 'bot'
			| 'broadcast'
			| 'broadcaster'
			| 'change'
			| 'channelPoints'
			| 'chatCommand'
			| 'chatPoll'
			| 'checkmark'
			| 'clearChat'
			| 'click'
			| 'clip'
			| 'coffee'
			| 'coin'
			| 'color'
			| 'commands'
			| 'conversation'
			| 'copy'
			| 'count'
			| 'countdown'
			| 'credits'
			| 'cross'
			| 'date'
			| 'debug'
			| 'delete'
			| 'dice'
			| 'discord'
			| 'donor'
			| 'download'
			| 'dragZone'
			| 'easing'
			| 'edit'
			| 'elevated'
			| 'elgato'
			| 'emergency'
			| 'emote'
			| 'enter'
			| 'filters'
			| 'firstTime'
			| 'fix'
			| 'follow'
			| 'follow_outline'
			| 'font'
			| 'fontSize'
			| 'fullscreen'
			| 'gift'
			| 'github'
			| 'goxlr'
			| 'goxlr_bleep'
			| 'goxlr_fx'
			| 'hand'
			| 'heat'
			| 'help'
			| 'hide'
			| 'highlight'
			| 'history'
			| 'hypeChat'
			| 'idea'
			| 'info'
			| 'internet'
			| 'kofi'
			| 'leave'
			| 'list'
			| 'live'
			| 'loader'
			| 'lock'
			| 'loop'
			| 'magnet'
			| 'markRead'
			| 'max'
			| 'merge'
			| 'microphone'
			| 'microphone_mute'
			| 'microphone_recording'
			| 'min'
			| 'minus'
			| 'mod'
			| 'move'
			| 'music'
			| 'mute'
			| 'newtab'
			| 'next'
			| 'noMusic'
			| 'notification'
			| 'number'
			| 'obs'
			| 'offline'
			| 'online'
			| 'orderable'
			| 'overlay'
			| 'params'
			| 'partner'
			| 'patreon'
			| 'pause'
			| 'paypal'
			| 'pin'
			| 'pipette'
			| 'placeholder'
			| 'play'
			| 'poll'
			| 'polygon'
			| 'prediction'
			| 'premium'
			| 'presentation'
			| 'press'
			| 'prev'
			| 'prime'
			| 'pros'
			| 'qna'
			| 'raid'
			| 'read'
			| 'refresh'
			| 'reply'
			| 'returning'
			| 'reward_highlight'
			| 'rightClick'
			| 'rotate'
			| 'save'
			| 'scale'
			| 'scroll'
			| 'scrollDown'
			| 'scrollUp'
			| 'search'
			| 'shadow'
			| 'shield'
			| 'shieldMode'
			| 'shoutout'
			| 'show'
			| 'skip'
			| 'slow'
			| 'spotify'
			| 'stars'
			| 'stop'
			| 'sub'
			| 'test'
			| 'thickness'
			| 'ticket'
			| 'tiktok'
			| 'timeout'
			| 'timer'
			| 'train'
			| 'train_boost'
			| 'translate'
			| 'trash'
			| 'tts'
			| 'twitch'
			| 'twitchat'
			| 'twitter'
			| 'ulule'
			| 'unban'
			| 'unblock'
			| 'unfollow'
			| 'unlock'
			| 'unmod'
			| 'unmute'
			| 'unpin'
			| 'unvip'
			| 'update'
			| 'upload'
			| 'url'
			| 'user'
			| 'vibrate'
			| 'vip'
			| 'voice'
			| 'voicemod'
			| 'volume'
			| 'watchStreak'
			| 'whispers'
			| 'youtube';
		/**
		 * Color of the message for "highlight" style
		 */
		highlightColor?: string;
		/**
		 * Message style
		 */
		style?: 'message' | 'highlight' | 'error';
		/**
		 * Option quote displayed in a dedicated holder
		 */
		quote?: string;
		/**
		 * buttons to add
		 */
		actions?: {
			/**
			 * Button icon see list of values above
			 */
			icon?: string;
			/**
			 * Button label
			 */
			label: string;
			/**
			 * Type of action
			 */
			actionType?: 'url' | 'trigger' | 'message' | 'discord';
			/**
			 * Page to open in a new tab for "url" actionType
			 */
			url?: string;
			/**
			 * Window target for "url" actionType
			 */
			urlTarget?: string;
			/**
			 * Trigger to execute for "trigger" actionType.
			 * Use CTRL+Alt+D on your triggers list to show their IDs
			 */
			triggerId?: string;
			/**
			 * Message sent on chat for "message" and "discord" actionType values
			 */
			message?: string;
			/**
			 * Button style
			 */
			theme?: 'default' | 'primary' | 'secondary' | 'alert';
		}[];
	};

	/**
	 * Requests for global states
	 * @answer ON_GLOBAL_STATES
	 */
	GET_GLOBAL_STATES: undefined;

	/**
	 * Response to GET_GLOBAL_STATES
	 */
	ON_GLOBAL_STATES: {
		/**
		 * List of active timer and their state
		 */
		activeTimers: Pick<
			TimerData,
			| 'id'
			| 'duration_ms'
			| 'enabled'
			| 'endAt_ms'
			| 'isDefault'
			| 'offset_ms'
			| 'pauseDuration_ms'
			| 'paused'
			| 'pausedAt_ms'
			| 'startAt_ms'
			| 'type'
		>[];
		/**
		 * List of active countdowns and their state
		 */
		activeCountdowns: Pick<
			TimerData,
			| 'id'
			| 'duration_ms'
			| 'enabled'
			| 'endAt_ms'
			| 'isDefault'
			| 'offset_ms'
			| 'pauseDuration_ms'
			| 'paused'
			| 'pausedAt_ms'
			| 'startAt_ms'
			| 'type'
		>[];
		/**
		 * Current counter values
		 */
		counterValues: { id: string; value: number }[];
		/**
		 * Current emergency mode state
		 */
		emergencyMode: boolean;
		/**
		 * Is any text-to-speech currently speaking
		 */
		ttsSpeaking: boolean;
		/**
		 * Last raider's name
		 */
		lastRaiderName: string | undefined;
		/**
		 * Is the viewers count visible on chat bar
		 */
		moderationToolsVisible: boolean;
		/**
		 * Are deleted messages being censored
		 */
		censorshipEnabled: boolean;
		/**
		 * Is there an active chat alert being shown
		 */
		hasActiveChatAlert: boolean;
		/**
		 * Is voice control enabled
		 */
		voiceControlEnabled: boolean;
		/**
		 * Is viewer count visible
		 */
		showViewerCount: boolean;
		/**
		 * Is message merging enabled
		 */
		messageMergeEnabled: boolean;
		/**
		 * Is there a message highlighted
		 */
		isMessageHighlighted: boolean;
		/**
		 * Is there an active poll
		 */
		hasActivePoll: boolean;
		/**
		 * Is there an active prediction
		 */
		hasActivePrediction: boolean;
		/**
		 * Is there an active bingo
		 */
		hasActiveBingo: boolean;
		/**
		 * Is there an active raffle
		 */
		hasActiveRaffle: boolean;
		/**
		 * Is there an active raffle with at least one entry
		 */
		hasActiveRaffleWithEntries: boolean;
		/**
		 * Chat columns configurations
		 */
		chatColConfs: {
			paused: boolean;
		}[];
		/**
		 * List of animated texts overlays
		 */
		animatedTextList: {
			/**
			 * Animated text ID
			 */
			id: string;
			/**
			 * Animated text name
			 */
			name: string;
			/**
			 * Is the animated text enabled ?
			 */
			enabled: boolean;
		}[];
		/**
		 * List of bingo grids overlays
		 */
		bingoGridList: {
			/**
			 * Animated text ID
			 */
			id: string;
			/**
			 * Animated text name
			 */
			name: string;
			/**
			 * Is the animated text enabled ?
			 */
			enabled: boolean;
		}[];
		pendingAutomodMessage: {
			/**
			 * Channel ID where the message was sent
			 */
			channel: string;
			/**
			 * Message content
			 */
			message: string;
			/**
			 * User info
			 */
			user: {
				id: string;
				login: string;
				displayName: string;
			};
		} | null;
	};

	/**
	 * @private
	 */
	SET_STREAMDECK_AUTHENTICATE: {
		/**
		 * Declare as an actual twitchat instance.
		 * If more than one is declared a warning will be shown on PI of the SD
		 */
		isMainApp: boolean;
		/**
		 * Secret key.
		 * Key is provided by SD, Twitchat must give it back to SD to validate connection.
		 * This avoids risks of unauthorized connections.
		 */
		secretKey: string;
	};
	/**
	 * Sent by SD to inform Twitchat about authentication result
	 * @private
	 */
	ON_STREAMDECK_AUTHENTICATION_RESULT: {
		success: boolean;
	};
	/**
	 * Live text when using speech-to-text
	 * @private
	 */
	ON_STT_TEXT_UPDATE: { text: string };
	/**
	 * @private
	 */
	ON_STT_RAW_TEXT_UPDATE: { text: string };
	/**
	 * @private
	 */
	ON_STT_REMOTE_TEMP_TEXT_EVENT: { text: string };
	/**
	 * @private
	 */
	ON_STT_REMOTE_FINAL_TEXT_EVENT: { text: string };
	/**
	 * @private
	 */
	ON_STT_SPEECH_END: { text: string };
	/**
	 * @private
	 */
	ON_STT_ACTION_BATCH: { id: keyof TwitchatEventMap; value?: { text: string } }[];
	/**
	 * @private
	 */
	ON_STT_ERASE: undefined;
	/**
	 * @private
	 */
	ON_STT_NEXT: undefined;
	/**
	 * @private
	 */
	ON_STT_PREVIOUS: undefined;
	/**
	 * @private
	 */
	ON_STT_SUBMIT: undefined;
	/**
	 * @private
	 */
	ON_STT_CANCEL: undefined;
	/**
	 * Internal event for development that tells when Twitchat labels
	 * have been updated. Labels being the localized text.
	 * @private
	 */
	ON_LABELS_UPDATE: undefined;
	/**
	 * Start a new raffle
	 * @private
	 */
	ON_OPEN_RAFFLE_CREATION_FORM: undefined;
	/**
	 * Open poll creation form
	 * @private
	 */
	ON_OPEN_POLL_CREATION_FORM: undefined;
	/**
	 * Open prediction creation form
	 * @private
	 */
	SET_OPEN_PREDICTION_CREATION_FORM: undefined;
	/**
	 * Scene has changed in OBS
	 * @private
	 */
	ON_OBS_SCENE_CHANGE: {
		sceneName: string;
	};
	/**
	 * Source mute state has changed in OBS
	 * @private
	 */
	ON_OBS_MUTE_TOGGLE: {
		inputName: string;
		inputMuted: boolean;
	};
	/**
	 * Playback has started in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_STARTED: {
		inputName: string;
	};
	/**
	 * Playback has paused in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_PAUSED: {
		inputName: string;
	};
	/**
	 * Started playing next item in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_NEXT: {
		inputName: string;
	};
	/**
	 * Started playing previous item in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_PREVIOUS: {
		inputName: string;
	};
	/**
	 * Playback has restarted in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_RESTARTED: {
		inputName: string;
	};
	/**
	 * Playback has ended in an OBS media source
	 * @private
	 */
	ON_OBS_PLAYBACK_ENDED: {
		inputName: string;
	};
	/**
	 * An input name has changed in OBS
	 * @private
	 */
	ON_OBS_INPUT_NAME_CHANGED: {
		inputName: string;
		oldInputName: string;
	};
	/**
	 * A scene name has changed in OBS
	 * @private
	 */
	ON_OBS_SCENE_NAME_CHANGED: {
		sceneName: string;
		oldSceneName: string;
	};
	/**
	 * A source filter name has changed in OBS
	 * @private
	 */
	ON_OBS_FILTER_NAME_CHANGED: {
		sourceName: string;
		filterName: string;
		oldFilterName: string;
	};
	/**
	 * A source has been added to a scene in OBS
	 * @private
	 */
	ON_OBS_SOURCE_TOGGLE: {
		item: OBSSourceItem;
		event: {
			sceneName: string;
			sceneItemId: number;
			sceneItemEnabled: boolean;
		};
	};
	/**
	 * A source filter has been enabled/disabled in OBS
	 * @private
	 */
	ON_OBS_FILTER_TOGGLE: {
		sourceName: string;
		filterName: string;
		filterEnabled: boolean;
	};
	/**
	 * Stream state has changed in OBS
	 * @private
	 */
	ON_OBS_STREAM_STATE: {
		outputActive: boolean;
		outputState: string;
	};
	/**
	 * Recording state has changed in OBS
	 * @private
	 */
	ON_OBS_RECORD_STATE: {
		outputActive: boolean;
		outputState: string;
		outputPath: string;
	};
	/**
	 * Alias of SET_ANIMATED_TEXT_CONTENT but that's listend by Twitchat.
	 * Twitchat will then broadcast SET_ANIMATED_TEXT_CONTENT to the overlay.
	 * This way SD can send animated text to the overlay even though it's not
	 * directly connected to it.
	 * @private
	 */
	SET_ANIMATED_TEXT_CONTENT_FROM_SD: TwitchatEventMap['SET_ANIMATED_TEXT_CONTENT'];
	/**
	 * Alias of SET_BINGO_GRID_CONFIGS_VISIBILITY but that's listend by Twitchat.
	 * Twitchat will then broadcast SET_BINGO_GRID_CONFIGS_VISIBILITY to the overlay.
	 * This way SD can change bingo grid visibility even though it's not
	 * directly connected to it.
	 * @private
	 */
	SET_BINGO_GRID_VISIBILITY_FROM_SD: TwitchatEventMap['SET_BINGO_GRID_CONFIGS_VISIBILITY'];
};

type StreamSummaryData = {
	streamDuration: number;
	premiumWarningSlots?: { [slotType: string]: boolean };
	params?: EndingCreditsParams;
	follows: { uid: string; login: string }[];
	raids: { uid: string; login: string; raiders: number }[];
	subs: {
		uid: string;
		login: string;
		tier: 1 | 2 | 3 | 'prime';
		subDuration?: number;
		fromActiveSubs?: true;
		platform: ChatPlatform;
	}[];
	resubs: {
		uid: string;
		login: string;
		tier: 1 | 2 | 3 | 'prime';
		subDuration?: number;
		fromActiveSubs?: true;
		platform: ChatPlatform;
	}[];
	subgifts: {
		uid: string;
		login: string;
		tier: 1 | 2 | 3 | 'prime';
		total: number;
		fromActiveSubs?: true;
		platform: ChatPlatform;
	}[];
	bits: { uid: string; login: string; bits: number; pinned: boolean }[];
	hypeChats: { uid: string; login: string; amount: number; currency: string }[];
	rewards: { uid: string; login: string; reward: { name: string; id: string; icon: string } }[];
	shoutouts: { uid: string; login: string; received: boolean; viewers: number }[];
	hypeTrains: {
		level: number;
		percent: number;
		conductorBits?: { uid: string; login: string; bits: number };
		conductorSubs?: { uid: string; login: string; subs: number };
	}[];
	polls: { title: string; votes: number; choices: { title: string; votes: number; win: boolean }[] }[];
	predictions: { title: string; points: number; outcomes: { title: string; points: number; voters: number; win: boolean }[] }[];
	chatters: {
		uid: string;
		login: string;
		count: number;
		vip: boolean;
		mod: boolean;
		sub: boolean;
		bans: number;
		tos: number;
		tosDuration: number;
	}[];
	tips: {
		login: string;
		amount: number;
		currency: string;
		platform: 'kofi' | 'streamlabs' | 'streamelements' | 'tipeee' | 'patreon';
	}[];
	merch: { login: string; products: string[]; total: number; currency: string; platform: 'kofi' | 'streamlabs' }[];
	powerups: {
		login: string;
		skinID?: 'simmer' | 'rainbow-eclipse' | 'cosmic-abyss';
		emoteUrl?: string;
		type: 'animation' | 'gigantifiedemote' | 'celebration';
	}[];
	superChats: { uid: string; login: string; amount: number; currency: string }[];
	superStickers: { uid: string; login: string; amount: number; currency: string; stickerUrl: string }[];
	tiktokGifts: { uid: string; login: string; count: number; amount: number; imageUrl: string }[];
	tiktokLikes: { uid: string; login: string; count: number }[];
	tiktokShares: { uid: string; login: string; count: number }[];
	patreonMembers: { uid: string; login: string; months: number; tier: string; lifetimeAmount: number }[];
	labels: {
		no_entry: string;
		train: string;
		premium_only: string;
		sub_duration: string;
	};
};

type EndingCreditsParams = {
	scale: number;
	padding: number;
	paddingTitle: number;
	stickyTitle: boolean;
	colorTitle: string;
	colorEntry: string;
	fontTitle: string;
	fontEntry: string;
	ignoreBots: boolean;
	ignoreCustomBots: string[];
	textShadow: number;
	timing: 'speed' | 'duration';
	duration: number;
	startDelay: number;
	loop: boolean;
	showIcons: boolean;
	powerUpEmotes: boolean;
	speed: number;
	fadeSize: number;
	slots: EndingCreditsSlotParams[];
	hideEmptySlots?: boolean; //Optional because added later
};

type EndingCreditsSlotParams = {
	id: string;
	slotType: EndingCreditsSlotStringTypes;
	label: string;
	maxEntries: number;
	enabled: boolean;
	layout: 'colLeft' | 'col' | 'colRight' | 'left' | 'center' | 'right' | '2cols' | '3cols';
	customHTML?: boolean;
	htmlTemplate?: string;
	showAmounts?: boolean;
	showSubMonths?: boolean;
	showBadges?: boolean;
	showMods?: boolean;
	showVIPs?: boolean;
	showSubs?: boolean;
	showResubs?: boolean;
	showSubgifts?: boolean;
	showSubsPrime?: boolean;
	showSubsT1?: boolean;
	showSubsT2?: boolean;
	showSubsT3?: boolean;
	showAllSubs?: boolean;
	showAllSubgifters?: boolean;
	showSubsYoutube?: boolean;
	showSubsTiktok?: boolean;
	showSubgiftsYoutube?: boolean;
	showTipsKofi?: boolean;
	showSubsKofi?: boolean;
	showTipsTipeee?: boolean;
	showTipsPatreon?: boolean;
	showTipsStreamlabs?: boolean;
	showTipsStreamelements?: boolean;
	showMerchKofi?: boolean;
	showMerchStreamlabs?: boolean;
	sortByNames?: boolean;
	sortByRoles?: boolean;
	sortByAmounts?: boolean;
	sortByTotalAmounts?: boolean;
	sortBySubTypes?: boolean;
	showChatters?: boolean;
	showTrainConductors?: boolean;
	showPuSkin?: boolean;
	showPuEmote?: boolean;
	showPuCeleb?: boolean;
	showTotalAmounts?: boolean;
	uniqueUsers?: boolean;
	text?: string;
	currency?: string;
	filterRewards?: boolean;
	showRewardUsers?: boolean;
	showNormalCheers?: boolean;
	showPinnedCheers?: boolean;
	anonLastNames?: boolean;
	patreonTiers?: string[];
	rewardIds?: string[];
	/**
	 * @deprecated only here for data migration typing
	 */
	showPremiumWarning?: boolean;
};

type EndingCreditsSlotStringTypes =
	| 'text'
	| 'bans'
	| 'mods'
	| 'subs'
	| 'vips'
	| 'raids'
	| 'polls'
	| 'so_in'
	| 'so_out'
	| 'cheers'
	| 'follows'
	| 'rewards'
	| 'chatters'
	| 'timeouts'
	| 'hypechats'
	| 'hypetrains'
	| 'predictions'
	| 'tips'
	| 'shoutouts'
	| 'merch'
	| 'patreonMembers'
	| 'powerups'
	| 'ytSuperchat'
	| 'ytSuperSticker'
	| 'tiktokLikes'
	| 'tiktokShares'
	| 'tiktokGifts';

type ScreenPosition = 'tl' | 't' | 'tr' | 'l' | 'm' | 'r' | 'bl' | 'b' | 'br';

type ChatHighlightInfo = {
	date?: number;
	message?: string;
	user?: TwitchatUser;
	clip?: ClipInfo;
	params: ChatHighlightParams;
	dateLabel: string;
	message_id: string;
	skin?: string;
};
type ChatHighlightParams = {
	position: ScreenPosition;
};
type ClipInfo = {
	duration: number;
	url: string;
	mp4?: string;
};

type TwitchatUser = {
	id: string;
	platform: ChatPlatform;
	login: string;
	/**
	 * Get the display name of the user.
	 * Returns eith the actual twitch display name, or the custom one defined
	 * on twitchat.
	 */
	displayName: string;
	/**
	 * Original twitch display name of the user
	 */
	displayNameOriginal: string;
	/**
	 * URL of the avatar
	 */
	avatarPath?: string;
	/**
	 * Account createion date
	 */
	created_at_ms?: number;
	/**
	 * Nickname chat color
	 */
	color?: string;
	/**
	 * Is a twitch partner?
	 */
	is_partner: boolean;
	/**
	 * Is a twitch affiliate?
	 */
	is_affiliate: boolean;
	/**
	 * Should this user's messages be highlighted?
	 */
	is_tracked: boolean;
	/**
	 * Is this a known bot account?
	 */
	is_bot: boolean;
	/**
	 * Is the user blocked by me?
	 */
	is_blocked: boolean;
	/**
	 * When a user is blocked, their messages are censored until we click
	 * on of them in which case messages stop being censored until next
	 * app start.
	 * This flag is here for this, stopping censor to ignore "is_blocked" state
	 */
	stop_block_censor?: boolean;
	/**
	 * Is a Twitchat admin?
	 */
	is_admin?: boolean;
	/**
	 * undefined=no loaded yet; false=no pronouns found; string=pronouns code
	 */
	pronouns: string | false | null;
	/**
	 * Pronouns label
	 */
	pronounsLabel: string | false;
	/**
	 * Pronouns tooltip
	 */
	pronounsTooltip: string | false;
	/**
	 * Contains one entry per connected channel with
	 * channel specific info.
	 */
	channelInfo: { [key: string]: UserChannelInfo };
	/**
	 * true when the details are loading
	 */
	temporary?: boolean;
	/**
	 * true if user data loading failed
	 */
	errored?: boolean;
	/**
	 * true if data respresents an anonymous user.
	 * For exemple an anonymous Heat user
	 */
	anonymous?: boolean;
	/**
	 * If set to true, this user's messages won't be automatically set
	 * as spoiler if the related option is enabled on the spoiler section
	 */
	noAutospoil?: boolean;
};

type AnimatedTextData = {
	id: string;
	enabled: boolean;
	/**
	 * Optional overlay title
	 */
	title: string;
	/**
	 * Animation style
	 */
	animStyle: 'wave' | 'typewriter' | 'bounce' | 'wobble' | 'rotate' | 'elastic' | 'neon' | 'swarm' | 'caterpillar';
	/**
	 * Animation duration scale
	 * The higher the slower.
	 * Represents the delay between each letter
	 */
	animDurationScale: number;
	/**
	 * Animation strength
	 * The higher the value, the strong the animation effect
	 */
	animStrength: number;
	/**
	 * Text color
	 */
	colorBase: string;
	/**
	 * Highlighted text color
	 */
	colorHighlights: string;
	/**
	 * Text font
	 */
	textFont: string;
	/**
	 * Text size
	 */
	textSize: number;
};

type BingoGridConfig = {
	id: string;
	title: string;
	enabled: boolean;
	showGrid: boolean;
	entries: {
		id: string;
		label: string;
		lock: boolean;
		check: boolean;
	}[];
	additionalEntries?: BingoGridConfig['entries'];
	cols: number;
	rows: number;
	textColor: string;
	backgroundColor: string;
	backgroundAlpha: number;
	textSize: number;
	chatCmd?: string;
	chatCmdPermissions: PermissionsData;
	winSoundVolume: number;
	autoShowHide: boolean;
	heatClick: boolean;
	heatClickPermissions: PermissionsData;
	chatAnnouncement: string;
	chatAnnouncementEnabled: boolean;
	overlayAnnouncement: boolean;
	overlayAnnouncementPermissions: PermissionsData;
};

type PermissionsData = {
	broadcaster: boolean;
	follower: boolean;
	follower_duration_ms: number;
	mods: boolean;
	vips: boolean;
	subs: boolean;
	all: boolean;
	usersAllowed: string[];
	usersRefused: string[];

	/**
	 * @deprecated Only here for typings on data migration. Removed in favor of the new "usersAllowed" prop
	 */
	users?: string;
};

type HeatClickData = {
	id: string;
	channelId: string;
	anonymous: boolean;
	x: number;
	y: number;
	rotation: number;
	scaleX: number;
	scaleY: number;
	uid: string;
	login: string;
	isSub: boolean;
	isBan: boolean;
	isMod: boolean;
	isVip: boolean;
	isBroadcaster: boolean;
	isFollower: boolean;
	followDate: number;
	testMode: boolean;
	alt: boolean;
	ctrl: boolean;
	shift: boolean;
	page: string;
	twitchatOverlayID: string;
};

type ChatPlatform = 'twitchat' | 'twitch' | 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'kick';
type CounterData = {
	id: string;
	/**
	 * Counter name
	 */
	name: string;
	/**
	 * Counter placeholder for use in triggers
	 * If value is "XXX", the placeholder {COUNTER_VALUE_XXX} will be usable
	 * in all triggers
	 */
	placeholderKey: string;
	/**
	 * Current counter's value (if not "per user")
	 */
	value: number;
	/**
	 * Min value of the counter
	 */
	min: number | false;
	/**
	 * Max value of the counter
	 */
	max: number | false;
	/**
	 * Should the value loop to the opposite limit when reaching the min or max value
	 */
	loop: boolean;
	/**
	 * Is the counter is global (false) or per user (true)
	 */
	perUser: boolean;
	/**
	 * Users values
	 */
	users?: {
		[userId: string]: {
			platform: ChatPlatform;
			value: number;
			login?: string;
		};
	};
	/**
	 * Only available for counters overlay related to a "per user" counter
	 * Contains user info necessary for display on screen.
	 * Only contains 10 first users
	 */
	leaderboard?: {
		login: string;
		avatar: string;
		points: number;
	}[];
	/**
	 * Is the counter disabled ?
	 * It can be disabled if the user has to disable counters they're not
	 * premium and have more than the maximum counters allowed
	 */
	enabled?: boolean;
};

type CustomTrainData = {
	id: string;
	enabled: boolean;
	/**
	 * Is train being tested ?
	 */
	testing: boolean;
	/**
	 * Optional overlay title
	 */
	title: string;
	/**
	 * Level name "LVL" by default
	 */
	levelName: string;
	/**
	 * Fill color
	 */
	colorFill: string;
	/**
	 * Background color
	 */
	colorBg: string;
	/**
	 * Text font
	 */
	textFont: string;
	/**
	 * Text size
	 */
	textSize: number;
	/**
	 * Train unit currency
	 */
	currency: string;
	/**
	 * Number of events to get the train approaching
	 */
	approachEventCount: number;
	/**
	 * Number of events to start the train
	 */
	triggerEventCount: number;
	/**
	 * Duration to wait after a train before starting a new one
	 */
	cooldownDuration_s: number;
	/**
	 * Duration to complete a level
	 */
	levelsDuration_s: number;
	/**
	 * Date at which the current train/level expires
	 */
	expires_at: number;
	/**
	 * Contains the date at which the cooldown will end
	 */
	coolDownEnd_at: number;
	/**
	 * Post progress on chat?
	 */
	postLevelUpOnChat: boolean;
	/**
	 * Message to post on chat on level up
	 */
	postLevelUpChatMessage: string;
	/**
	 * Post success on chat?
	 */
	postSuccessOnChat: boolean;
	/**
	 * Message to post on chat on success
	 */
	postSuccessChatMessage: string;
	/**
	 * Text for the "level X complete"
	 */
	levelUpLabel: string;
	/**
	 * Text for the "train appraoching"
	 */
	approachingLabel: string;
	/**
	 * Emote for the "train appraoching"
	 */
	approachingEmote: string;
	/**
	 * Text displayed if train is failed
	 */
	failedLabel: string;
	/**
	 * Emote for the "train failed"
	 */
	failedEmote: string;
	/**
	 * Text displayed when train complete
	 */
	successLabel: string;
	/**
	 * Text displayed when train complete with level and percent reached
	 */
	successLabelSummary: string;
	/**
	 * Emote for the "train complete"
	 */
	successEmote: string;
	/**
	 * Text displayed on all time record
	 */
	recordLabel: string;
	/**
	 * Emote for all time record
	 */
	recordEmote: string;
	/**
	 * Fill color for all time record
	 */
	recordColorFill: string;
	/**
	 * Background color for all time record
	 */
	recordColorBg: string;
	/**
	 * Emote for the "level up" sequence
	 */
	levelUpEmote: string;
	/**
	 * Levels amounts.
	 * coma seperated numbers
	 */
	levelAmounts: number[];
	/**
	 * Current all time record info
	 */
	allTimeRecord?: {
		date: number;
		amount: number;
	};
	/**
	 * Platforms allowed to make train progress
	 */
	platforms: {
		kofi: boolean;
		streamelements: boolean;
		patreon: boolean;
		streamlabs: boolean;
		tipeee: boolean;
		tiltify: boolean;
		streamlabs_charity: boolean;
		twitch_charity: boolean;
	};
};

type CustomTrainState = {
	/**
	 * Date at which the train approached (0 if not yet)
	 */
	approached_at: number;
	/**
	 * Date at which the train started (0 if not yet)
	 */
	levelStarted_at: number;
	/**
	 * Current train amount
	 */
	amount: number;
	/**
	 * Reference to internal timeout
	 */
	timeoutRef?: string;
	/**
	 * Activities for this train
	 */
	activities: {
		id: string;
		/**
		 * Platform used to make the donation
		 */
		platform: keyof CustomTrainData['platforms'] | 'trigger';
		/**
		 * Donation amount
		 */
		amount: number;
		/**
		 * Activity date
		 */
		created_at: number;
		/**
		 * Message that created this activity
		 */
		messageId: string;
	}[];
};
type HeatDistortionData = {
	id: string;
	name: string;
	obsItemPath: {
		sceneName: string;
		groupName: string;
		source: {
			id: number;
			name: string;
		};
	};
	permissions: PermissionsData;
	refuseAnon: boolean;
	effect: 'liquid' | 'expand' | 'shrink' | 'heart';
	filterName: string;
	browserSourceName: string;
	enabled: boolean;
	triggerOnly: boolean;
};

type DonationGoalOverlayConfig = {
	id: string;
	title: string;
	enabled: boolean;
	/**
	 * Notify donations on current goal
	 */
	notifyTips: boolean;
	/**
	 * Automatically show/hide all goals depending on activities
	 */
	autoDisplay: boolean;
	/**
	 * Close completed goals
	 */
	hideDone: boolean;
	/**
	 * Delay after which hide the goal
	 */
	hideDelay: number;
	/**
	 * Should the number of items bellow the current one be limited
	 */
	limitEntryCount: boolean;
	/**
	 * Maximum donation goals to display
	 */
	maxDisplayedEntries: number;
	/**
	 * Source to link this donation goal to
	 */
	dataSource: 'streamlabs_charity' | 'tiltify' | 'counter' | 'twitch_subs' | 'twitch_followers' | 'twitch_charity';
	/**
	 * Optional campaign ID.
	 * Not used by "streamlabs_charity" as the campaign
	 * is defined globaly and only one can be active
	 */
	campaignId?: string;
	/**
	 * Counter ID if "dataSource" is set to "counter"
	 */
	counterId?: string;
	/**
	 * Theme color
	 */
	color: string;
	/**
	 * Currency value
	 */
	currency: string;
	/**
	 * List of donation goal entries
	 */
	goalList: {
		id: string;
		title: string;
		amount: number;
		/**
		 * If true, the goal's title will be censored until
		 * the goal is completed
		 */
		secret: boolean;
		/**
		 * Defines the secret type.
		 * blur (default): blurs the whole text and shows it only on complete
		 * progressive: shows random letter progressively
		 */
		secret_type?: 'blur' | 'progressive';
	}[];
};

type MusicPlayerParamsData = {
	autoHide: boolean;
	erase: boolean;
	showCover: boolean;
	showArtist: boolean;
	showTitle: boolean;
	showProgressbar: boolean;
	openFromLeft: boolean;
	noScroll: boolean;
	customInfoTemplate: string;
};

/**
 * Represents info about a music track
 */
type MusicTrackData = {
	id: string;
	title: string;
	artist: string;
	album: string;
	cover: string;
	duration: number;
	url: string;
};

type TimerData = {
	id: string;
	/**
	 * Is timer/countdown enabled
	 */
	enabled: boolean;
	/**
	 * Is the default timer/countdown
	 * These are static instances that cannot be deleted
	 * for use with the /timer and /countdown commands
	 */
	isDefault: boolean;
	/**
	 * Name of the timer/countdown
	 */
	title: string;
	/**
	 * Type of entry, timer or countdown
	 */
	type: 'timer' | 'countdown';
	/**
	 * Timer/countdown's placeholder for trigger
	 */
	placeholderKey: string;
	/**
	 * Date in ms the timer/countdown has been started at
	 */
	startAt_ms?: number;
	/**
	 * Duration added to the timer/countdown
	 */
	offset_ms: number;
	/**
	 * Duration the countdown has been paused for
	 */
	pauseDuration_ms: number;
	/**
	 * Is timer/countdown paused
	 */
	paused: boolean;
	/**
	 * Date in ms the timer/countdown has been paused at
	 */
	pausedAt_ms?: number;
	/**
	 * Date in ms the countdown has ended
	 */
	endAt_ms?: number;
	/**
	 * Duration of the countdown in ms
	 */
	duration_ms: number;
	/**
	 * Contains overlay's params
	 */
	overlayParams: {
		/**
		 * Style of display
		 * text: legacy mode
		 * bar: new render style for countdown with a progress bar reducing
		 */
		style: 'text' | 'bar';
		/**
		 * Background color
		 */
		bgColor: string;
		/**
		 * Show background
		 */
		bgEnabled: boolean;
		/**
		 * Show icon
		 */
		showIcon: boolean;
		/**
		 * Text font
		 */
		textFont: string;
		/**
		 * Text size
		 */
		textSize: number;
		/**
		 * Text color
		 */
		textColor: string;
		/**
		 * Size of the progress bar
		 */
		progressSize: number;
		/**
		 * Progress style for "bar" style
		 */
		progressStyle: 'fill' | 'empty';
	};
};

type WheelData = {
	items: EntryItem[];
	winner: string;
	sessionId: string;
	skin?: string;
};

/**
 * Generic item entry
 */
type EntryItem = {
	id: string;
	label: string;
};

type AdBreakOverlayData = {
	showApproaching: boolean;
	showRunning: boolean;
	approachingDelay: number;
	approachingStyle: 'bar' | 'text';
	runningStyle: 'bar' | 'text';
	approachingSize: number;
	runningSize: number;
	approachingThickness: number;
	runningThickness: number;
	approachingColor: string;
	runningColor: string;
	approachingPlacement: ScreenPosition;
	runningPlacement: ScreenPosition;
	approachingLabel: string;
	runningLabel: string;
};

/**
 * Contains params about the bits wall overlay
 */
type BitsWallOverlayData = {
	size: number;
	break: boolean;
	opacity: number;
	break_senderOnly: boolean;
	break_durations?: { 1: number; 100: number; 1000: number; 5000: number; 10000: number };
};

type CommercialData = {
	/**
	 * Date in milliseconds the previous mid-roll started
	 */
	prevAdStart_at: number;
	/**
	 * Date in milliseconds the next mid-roll will start
	 */
	nextAdStart_at: number;
	/**
	 * Duration in milliseconds of the current md-roll
	 */
	currentAdDuration_ms: number;
	/**
	 * Number of snooze remaining
	 */
	remainingSnooze: number;
	/**
	 * Date in milliseconds a snooze will be unlocked
	 */
	nextSnooze_at: number;
};

type PollOverlayParamStoreData = {
	listMode: boolean;
	listModeOnlyMore2: boolean;
	showTitle: boolean;
	showLabels: boolean;
	showVotes: boolean;
	showPercent: boolean;
	showTimer: boolean;
	showOnlyResult: boolean;
	resultDuration_s: number;
	placement: ScreenPosition;
};

type ChatPollData = {
	/**
	 * Poll title
	 */
	title: string;
	/**
	 * Poll choices
	 */
	choices: MessagePollDataChoice[];
	/**
	 * Poll duration in seconds
	 */
	duration_s: number;
	/**
	 * Timestamp when the poll has been started
	 */
	started_at: number;
	/**
	 * Timestamp when the poll has ended
	 */
	ended_at?: number;
	/**
	 * Winning choice
	 */
	winner?: MessagePollDataChoice;
	/**
	 * Permissions params
	 */
	permissions: PermissionsData;
	/**
	 * Stores the poll's votes
	 */
	votes: { [uid: string]: { indices: number[]; login: string; platform: ChatPlatform } };
	/**
	 * Maximum answers a user can vote for
	 */
	maxVotePerUser: number;
};

type MessagePollDataChoice = {
	id: string;
	/**
	 * Text of the choice
	 */
	label: string;
	/**
	 * Number of "votes", represents the total channel points spent on it
	 */
	votes: number;
};

type ParseMessageChunk = {
	type: 'text' | 'emote' | 'cheermote' | 'url' | 'highlight' | 'user';
	/**
	 * Possible values for each chunk types:
	 * - text: text content
	 * - emote: emote name
	 * - cheermote: cheermote name
	 * - url: url with protocol striped out
	 * - highlight: highlighted text
	 * - user: user name
	 */
	value: string;
	/**
	 * Emote or cheermote URL (low res) for "emote" and "cheermote" chunks
	 */
	emote?: string;
	/**
	 * Emote or cheermote URL (high def) for "emote" and "cheermote" chunks
	 */
	emoteHD?: string;
	/**
	 * Url of a "url" chunk
	 */
	href?: string;
	/**
	 * User login with potential "@" striped out
	 * if "@durss" is on the message, "value" will contain "@durss"
	 * but "username" will only contain "durss"
	 */
	username?: string;

	/**
	 * Only declared by the ChatMessageChunkParser component to define if
	 * the chunk sshould be displayed as spoiler
	 */
	spoiler?: boolean;
	/**
	 * Only declared by the ChatMessageChunkParser component to define if
	 * the chunk is a spoiler tag (||)
	 */
	spoilerTag?: boolean;
};

type LabelItemData = {
	id: string;
	title: string;
	enabled: boolean;
	placeholder: string;
	html: string;
	css: string;
	mode: 'placeholder' | 'html';
	fontSize: number;
	fontFamily: string;
	fontColor: string;
	textAlign: 'left' | 'center' | 'right';
	scrollContent: boolean;
	backgroundEnabled: boolean;
	backgroundColor: string;
};

type UserChannelInfo = {
	/**
	 * true if user is connected on the channel's chat
	 */
	online: boolean;
	/**
	 * true if user talked for the first time ever on our chat during this session
	 */
	is_new: boolean;
	/**
	 * true if user raided us
	 * Stays to "true" for the specified amount of duration on the parameters
	 * then switched back to false
	 */
	is_raider: boolean;
	/**
	 * Defines if user is a follower of the channel
	 * null = don't know yet
	 * true = is a follower
	 * false = is not a follower
	 */
	is_following: boolean | null;
	/**
	 * true if user is banned on the channel
	 */
	is_banned: boolean;
	/**
	 * true if user is a VIP of the channel
	 */
	is_vip: boolean;
	/**
	 * true if user is a moderator of the channel
	 */
	is_moderator: boolean;
	/**
	 * true if user is the broadcaster of the channel
	 */
	is_broadcaster: boolean;
	/**
	 * true if user is subscribed to the channel
	 */
	is_subscriber?: boolean;
	/**
	 * true if user has gifted subs on the channel
	 */
	is_gifter: boolean;
	/**
	 * Date at which the user followed the channel
	 * Value = 0 if not checked yet, -1 not following
	 */
	following_date_ms: number;
	/**
	 * User badges for this channel
	 */
	badges: {
		icon: {
			sd: string;
			hd?: string;
		};
		id:
			| 'predictions'
			| 'subscriber'
			| 'vip'
			| 'premium'
			| 'moderator'
			| 'lead_moderator'
			| 'staff'
			| 'broadcaster'
			| 'partner'
			| 'founder'
			| 'ambassador';
		title?: string;
		version?: string;
	}[];
	/**
	 * Date at which the ban expires on this channel
	 */
	banEndDate?: number;
	/**
	 * Contains the ban reason
	 */
	banReason?: string;
	/**
	 * Last date the user interracted on this channel
	 */
	lastActivityDate?: number;
	/**
	 * Number of subgifts the user made on this channel
	 * Only available after making a subgift
	 */
	totalSubgifts?: number;
	/**
	 * Store the date at which this user last got a shoutout
	 */
	lastShoutout?: number;
	/**
	 * Defines if the user should be moded back after their timeout completes
	 */
	autoRemod?: boolean;
};

type PredictionOverlayParamStoreData = {
	listMode: boolean;
	listModeOnlyMore2: boolean;
	showTitle: boolean;
	showLabels: boolean;
	showVotes: boolean;
	showVoters: boolean;
	showPercent: boolean;
	showTimer: boolean;
	showOnlyResult: boolean;
	hideUntilResolved: boolean;
	resultDuration_s: number;
	placement: ScreenPosition;
};

type AbstractTwitchatMessage = {
	type: string;
	id: string;
	date: number;
	channel_id: string;
	platform: ChatPlatform;
	/**
	 * Defines infos about the channel this message comes from.
	 * Only set for messages received from channels other than ours
	 */
	channelSource?: {
		color: string;
		name: string;
		pic?: string;
	};
	/**
	 * Defines if messages originates from a shared chat session.
	 */
	twitchSharedChat?: boolean;
	/**
	 * true if message has been deleted
	 */
	deleted?: boolean;
	/**
	 * true if message has been part of the cleared messages
	 * when using /clear command
	 */
	cleared?: boolean;
	/**
	 * Is it a fake message ?
	 */
	fake?: boolean;
	/**
	 * Optional column index to display the message to
	 * Can be an array of column indices
	 */
	col?: number | number[];
};

/**
 * Represents a poll's data
 */
type MessagePollData = AbstractTwitchatMessage & {
	channel_id: string;
	type: 'poll';
	/**
	 * Poll creator
	 */
	creator?: TwitchatUser;
	/**
	 * Poll title
	 */
	title: string;
	/**
	 * Poll choices
	 */
	choices: MessagePollDataChoice[];
	/**
	 * Poll duration in seconds
	 */
	duration_s: number;
	/**
	 * Timestamp when the poll has been started
	 */
	started_at: number;
	/**
	 * Timestamp when the poll has ended
	 */
	ended_at?: number;
	/**
	 * Winning choice
	 */
	winner?: MessagePollDataChoice;
	/**
	 * Defines if it's the first event of the poll
	 * which means it's just been started
	 */
	isStart?: boolean;
	/**
	 * Set to true when simulating a poll for the overlay
	 */
	isFake?: boolean;
};

/**
 * Represents a prediction's data
 */
type MessagePredictionData = AbstractTwitchatMessage & {
	channel_id: string;
	type: 'prediction';
	/**
	 * Prediction creator
	 */
	creator?: TwitchatUser;
	/**
	 * Prediction title
	 */
	title: string;
	/**
	 * Prediction duration in seconds
	 */
	duration_s: number;
	/**
	 * Prediction possible outcomes
	 */
	outcomes: MessagePredictionDataOutcome[];
	/**
	 * true if the prediction is pending for choosing the winning outcome
	 */
	pendingAnswer: boolean;
	/**
	 * Timestamp when the Prediction has been started
	 */
	started_at: number;
	/**
	 * Timestamp when the Prediction has ended
	 */
	ended_at?: number;
	/**
	 * Winning choice
	 */
	winner?: MessagePredictionDataOutcome;
	/**
	 * Total channel points bet
	 */
	totalPoints: number;
	/**
	 * Total users participating
	 */
	totalUsers: number;
	/**
	 * Defines if it's the first event of the prediction
	 * which means it's just been started
	 */
	isStart?: boolean;
	/**
	 * Set to true when simulating a poll for the overlay
	 */
	isFake?: boolean;
};

type MessagePredictionDataOutcome = {
	id: string;
	/**
	 * Text of the choice
	 */
	label: string;
	/**
	 * Number of "votes", represents the total channel points spent on it
	 */
	votes: number;
	/**
	 * Number of users that voted for this answer
	 */
	voters: number;
};

type TriggerActionCountDataAction = 'ADD' | 'DEL' | 'SET';

type OBSInputKind =
	| 'image_source'
	| 'color_source_v3'
	| 'slideshow'
	| 'browser_source'
	| 'ffmpeg_source'
	| 'text_gdiplus_v2'
	| 'text_ft2_source_v2'
	| 'text_ft2_source_v3'
	| 'vlc_source'
	| 'monitor_capture'
	| 'window_capture'
	| 'game_capture'
	| 'dshow_input'
	| 'wasapi_input_capture'
	| 'wasapi_output_capture'
	| 'wasapi_process_output_capture'
	| null;
export type OBSSourceType = 'OBS_SOURCE_TYPE_INPUT' | 'OBS_SOURCE_TYPE_SCENE';

type OBSSourceItem = {
	inputKind: OBSInputKind;
	isGroup: boolean | null;
	sceneItemId: number;
	sceneItemIndex: number;
	sourceName: string;
	sourceType: OBSSourceType;
	sceneItemTransform: SourceTransform;
	sceneName?: string | undefined;
};

type SourceTransform = {
	alignment: number;
	boundsAlignment: number;
	boundsHeight: number;
	boundsType: string;
	boundsWidth: number;
	cropBottom: number;
	cropLeft: number;
	cropRight: number;
	cropTop: number;
	height: number;
	positionX: number;
	positionY: number;
	rotation: number;
	scaleX: number;
	scaleY: number;
	sourceHeight: number;
	sourceWidth: number;
	width: number;
};

type MessageSubscriptionData = {
	/**
	 * Sub tier
	 */
	tier: 1 | 2 | 3 | 'prime';
};
