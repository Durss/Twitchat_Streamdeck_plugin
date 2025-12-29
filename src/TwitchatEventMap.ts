/**
 * Twitchat event map
 *
 * Bellow that event list are shit loads of type definitions extracted from Twitchat
 */
export type TwitchatEventMap = {
	/**
	 * Twitchat completed initialization and is ready.
	 */
	TWITCHAT_READY: undefined;
	/**
	 * OBS Websocket connection established
	 */
	OBS_WEBSOCKET_CONNECTED: undefined;
	/**
	 * OBS Websocket connection lost
	 */
	OBS_WEBSOCKET_DISCONNECTED: undefined;
	/**
	 * Scene has changed in OBS
	 */
	OBS_SCENE_CHANGE: {
		sceneName: string;
	};
	/**
	 * Source mute state has changed in OBS
	 */
	OBS_MUTE_TOGGLE: {
		inputName: string;
		inputMuted: boolean;
	};
	/**
	 * Playback has started in an OBS media source
	 */
	OBS_PLAYBACK_STARTED: {
		inputName: string;
	};
	/**
	 * Playback has paused in an OBS media source
	 */
	OBS_PLAYBACK_PAUSED: {
		inputName: string;
	};
	/**
	 * Started
	 */
	OBS_PLAYBACK_NEXT: {
		inputName: string;
	};
	OBS_PLAYBACK_PREVIOUS: {
		inputName: string;
	};
	OBS_PLAYBACK_RESTARTED: {
		inputName: string;
	};
	OBS_PLAYBACK_ENDED: {
		inputName: string;
	};
	OBS_INPUT_NAME_CHANGED: {
		inputName: string;
		oldInputName: string;
	};
	OBS_SCENE_NAME_CHANGED: {
		sceneName: string;
		oldSceneName: string;
	};
	OBS_FILTER_NAME_CHANGED: {
		sourceName: string;
		filterName: string;
		oldFilterName: string;
	};
	OBS_SOURCE_TOGGLE: {
		item: OBSSourceItem;
		event: {
			sceneName: string;
			sceneItemId: number;
			sceneItemEnabled: boolean;
		};
	};
	OBS_FILTER_TOGGLE: {
		sourceName: string;
		filterName: string;
		filterEnabled: boolean;
	};
	OBS_STREAM_STATE: {
		outputActive: boolean;
		outputState: string;
	};
	OBS_RECORD_STATE: {
		outputActive: boolean;
		outputState: string;
		outputPath: string;
	};
	ENABLE_STT: undefined;
	DISABLE_STT: undefined;
	/**
	 * Live text when using speech-to-text
	 */
	STT_TEXT_UPDATE: { text: string };
	STT_RAW_TEXT_UPDATE: { text: string };
	STT_REMOTE_TEMP_TEXT_EVENT: { text: string };
	STT_REMOTE_FINAL_TEXT_EVENT: { text: string };
	STT_SPEECH_END: { text: string };
	STT_ACTION_BATCH: { id: keyof TwitchatEventMap; value?: { text: string } }[];
	STT_ERASE: undefined;
	STT_NEXT: undefined;
	STT_PREVIOUS: undefined;
	STT_SUBMIT: undefined;
	STT_CANCEL: undefined;
	/**
	 * Scroll a chat feed up
	 */
	CHAT_FEED_SCROLL_UP: {
		/**
		 * Number of pixels to scroll by
		 */
		scrollBy: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Scroll a chat feed down
	 */
	CHAT_FEED_SCROLL_DOWN: {
		/**
		 * Number of pixels to scroll by
		 */
		scrollBy: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SCROLL: {
		/**
		 * Number of pixels to scroll by
		 */
		scrollBy: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	/**
	 * Move read marker in chat feed
	 */
	CHAT_FEED_READ: {
		/**
		 * Number of messages to read
		 */
		count: number;
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_READ_ALL: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_PAUSE: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_UNPAUSE: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SCROLL_BOTTOM: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT: {
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
	CHAT_FEED_SELECT_ACTION_DELETE: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT_ACTION_BAN: {
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
	CHAT_FEED_SELECT_CHOOSING_ACTION: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT_ACTION_PIN: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT_ACTION_HIGHLIGHT: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT_ACTION_SHOUTOUT: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	CHAT_FEED_SELECT_ACTION_CANCEL: {
		/**
		 * Column index
		 */
		colIndex: number;
	};
	GREET_FEED_READ: {
		/**
		 * Number of messages to mark as read
		 */
		messageCount: number;
	};
	GREET_FEED_READ_ALL: undefined;

	VOICEMOD_VOICE_CHANGE: {
		/**
		 * Voice ID that got selected
		 */
		voiceId: string;
	};

	GET_ENDING_CREDITS_PRESENCE: undefined;
	SET_ENDING_CREDITS_PRESENCE: undefined;
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
	SET_ENDING_CREDITS_DATA: StreamSummaryData;
	ENDING_CREDITS_COMPLETE: undefined;
	ENDING_CREDITS_CONFIGS: EndingCreditsParams;
	ENDING_CREDITS_CONTROL: {
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

	GET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE: undefined;
	SET_CHAT_HIGHLIGHT_OVERLAY_PRESENCE: undefined;
	SET_CHAT_HIGHLIGHT_OVERLAY_CLIP: ChatHighlightInfo;
	SET_CHAT_HIGHLIGHT_OVERLAY_MESSAGE: ChatHighlightInfo | undefined;

	MESSAGE_MARKED_AS_READ: {
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

	GET_ANIMATED_TEXT_CONFIGS: {
		/**
		 * Animated text overlay ID
		 */
		id: string;
	};
	SET_ANIMATED_TEXT_CONFIGS: AnimatedTextData;
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
	ANIMATED_TEXT_SHOW_COMPLETE: {
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};
	ANIMATED_TEXT_HIDE_COMPLETE: {
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};
	ANIMATED_TEXT_CLOSE: {
		/**
		 * ID of the overlay that finished closing animation
		 */
		id: string;
		/**
		 * Query ID sent when setting the text from ANIMATED_TEXT_SET
		 */
		queryId: string;
	};

	GET_BINGO_GRID_CONFIGS: {
		/**
		 * Bingo grid ID to get parameters for
		 */
		id: string;
	};
	SET_BINGO_GRID_CONFIGS: {
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
	SET_BINGO_GRID_OVERLAY_PRESENCE: {
		/**
		 * Bingo grid ID to advertise presence of
		 */
		id: string;
	};
	BINGO_GRID_HEAT_CLICK: {
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
	BINGO_GRID_VIEWER_EVENT: {
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
	BINGO_GRID_LEADER_BOARD: {
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

	GET_ALL_COUNTERS: undefined;
	GET_COUNTER: {
		/**
		 * Counter ID to get value of
		 */
		id: string;
	};
	SET_COUNTER_LIST: {
		counters: {
			id: string;
			name: string;
			perUser: boolean;
		}[];
	};
	COUNTER_UPDATE: {
		counter: CounterData;
	};
	COUNTER_ADD: {
		id: string;
		action: 'ADD' | 'DEL' | 'SET';
		/**
		 * Value to add to the counter.
		 * Typed as string cause it can be an arithmetic expression or
		 * it can contain placeholders
		 */
		value: string;
	};

	GET_CUSTOM_TRAIN_DATA: {
		/**
		 * Custom train ID to get state for
		 * */
		id: string;
	};
	SET_CUSTOM_TRAIN_DATA: {
		configs: CustomTrainData;
		state: CustomTrainState;
	};

	SET_DISTORT_OVERLAY_CONFIGS: {
		params: HeatDistortionData;
	};
	GET_DISTORT_OVERLAY_CONFIGS: {
		/**
		 * Distortion overlay ID to get parameters for
		 */
		id: string;
	};

	GET_DONATION_GOALS_OVERLAY_CONFIGS: {
		/**
		 * Overlay ID to get parameters for
		 */
		id: string;
	};
	SET_DONATION_GOALS_OVERLAY_CONFIGS: {
		params: DonationGoalOverlayConfig;
		goal: number;
		raisedTotal: number;
		raisedPersonnal: number;
		skin: 'default' | string;
	};
	DONATION_EVENT: {
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

	GET_CURRENT_TRACK: undefined;
	SET_CURRENT_TRACK: {
		params: MusicPlayerParamsData;
		trackName?: string;
		artistName?: string;
		trackDuration?: number;
		trackPlaybackPos?: number;
		cover?: string;
		skin?: string;
	};
	TRACK_ADDED_TO_QUEUE: MusicTrackData;

	MUSIC_PLAYER_HEAT_CLICK: HeatClickData;

	SET_POLLS_OVERLAY_PRESENCE: undefined;
	GET_POLLS_OVERLAY_PRESENCE: undefined;
	GET_POLLS_OVERLAY_CONFIGS: undefined;
	SET_POLL_OVERLAY_CONFIGS: { parameters: PollOverlayParamStoreData };
	POLL_PROGRESS: { poll: MessagePollData } | undefined;

	SET_PREDICTIONS_OVERLAY_PRESENCE: undefined;
	GET_PREDICTIONS_OVERLAY_PRESENCE: undefined;
	GET_PREDICTIONS_OVERLAY_CONFIGS: undefined;
	SET_PREDICTIONS_OVERLAY_CONFIGS: { parameters: PredictionOverlayParamStoreData };
	PREDICTION_PROGRESS: { prediction: MessagePredictionData } | undefined;

	SET_TIMER_OVERLAY_PRESENCE: undefined;
	GET_TIMER_OVERLAY_PRESENCE: undefined;
	GET_TIMER_LIST: undefined;
	SET_TIMER_LIST: {
		timers: {
			id: string;
			title: string;
			enabled: boolean;
			type: 'timer' | 'countdown';
		}[];
	};

	GET_TIMER: {
		/**
		 * Timer ID to get configs for
		 */
		id: string;
	};
	TIMER_START: TimerData;
	TIMER_ADD: {
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
	TIMER_STOP: TimerData;
	COUNTDOWN_START: TimerData;
	COUNTDOWN_ADD: {
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
	COUNTDOWN_COMPLETE: TimerData;

	SET_WHEEL_OVERLAY_PRESENCE: undefined;
	GET_WHEEL_OVERLAY_PRESENCE: undefined;
	WHEEL_OVERLAY_START: WheelData;
	WHEEL_OVERLAY_ANIMATION_COMPLETE: {
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

	GET_AD_BREAK_OVERLAY_PRESENCE: undefined;
	SET_AD_BREAK_OVERLAY_PRESENCE: undefined;
	GET_AD_BREAK_OVERLAY_CONFIGS: undefined;
	SET_AD_BREAK_OVERLAY_CONFIGS: AdBreakOverlayData;
	SET_AD_BREAK_OVERLAY_DATA: CommercialData;

	GET_BITSWALL_OVERLAY_PRESENCE: undefined;
	SET_BITSWALL_OVERLAY_PRESENCE: undefined;
	GET_BITSWALL_OVERLAY_CONFIGS: undefined;
	SET_BITSWALL_OVERLAY_CONFIGS: BitsWallOverlayData;

	GET_CHAT_POLL_OVERLAY_PRESENCE: undefined;
	SET_CHAT_POLL_OVERLAY_PRESENCE: undefined;
	GET_CHAT_POLL_OVERLAY_CONFIGS: undefined;
	SET_CHAT_POLL_OVERLAY_CONFIGS: { parameters: PollOverlayParamStoreData };
	CHAT_POLL_PROGRESS: { poll: ChatPollData } | undefined;

	/**
	 * A chat message has been deleted
	 */
	MESSAGE_DELETED: {
		channel: string;
		message: string;
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	BITS: {
		channel: string;
		message: string;
		message_chunks?: ParseMessageChunk[];
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		bits: number;
		pinned: boolean;
		pinLevel: number;
	};
	MESSAGE_WHISPER: {
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
	MESSAGE_FROM_NON_FOLLOWER: {
		channel: string;
		message: string;
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	MENTION: {
		channel: string;
		message: string;
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	MESSAGE_FIRST_TODAY: {
		channel: string;
		message: string;
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	MESSAGE_FIRST_ALL_TIME: {
		channel: string;
		message: string;
		user: {
			id: string;
			login: string;
			displayName: string;
		};
	};
	REWARD_REDEEM: {
		channel: string;
		message?: string;
		message_chunks?: ParseMessageChunk[];
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		reward: {
			id: string;
			cost: number;
			title: string;
		};
	};
	SUBSCRIPTION: {
		channel: string;
		message: string;
		message_chunks: ParseMessageChunk[];
		user: {
			id: string;
			login: string;
			displayName: string;
		};
		tier: 1 | 2 | 3 | 'prime';
		months: number;
		recipients: { uid: string; login: string }[];
		streakMonths: number;
		totalSubDuration: number;
		giftCount: number;
		isPrimeUpgrade: boolean;
		isGift: boolean;
		isGiftUpgrade: boolean;
		isResub: boolean;
	};
	FOLLOW: {
		channel: string;
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
				enabled: boolean;
				/**
				 * If set to true, a confirmation modal will be shown
				 * to confirm the action
				 */
				promptConfirmation?: boolean;
		  }
		| undefined;
	EMERGENCY_MODE_CHANGED: {
		/**
		 * New emergency mode state
		 */
		enabled: boolean;
	};
	/**
	 * Internal event for development that tells when Twitchat labels
	 * have been updated. Labels being the localized text.
	 */
	LABELS_UPDATE: undefined;

	GET_LABEL_OVERLAY_PLACEHOLDERS: undefined;
	SET_LABEL_OVERLAY_PLACEHOLDERS: {
		[tag: string]: {
			value: string | number;
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
	GET_LABEL_OVERLAY_CONFIGS: {
		/**
		 * Label ID
		 */
		id: string;
	};
	SET_LABEL_OVERLAY_CONFIGS: {
		/**
		 * Label ID
		 */
		id: string;
		data: LabelItemData | null;
		exists?: boolean;
		isValid?: boolean;
	};

	GET_CHAT_COLUMNS_COUNT: undefined;
	SET_CHAT_COLUMNS_COUNT: {
		/**
		 * Number of chat columns
		 */
		count: number;
	};

	GET_QNA_SESSION_LIST: undefined;
	SET_QNA_SESSION_LIST: {
		sessionList: {
			id: string;
			command: string;
			open: boolean;
		}[];
	};
	/**
	 * Highlights the top most message of given Q&A session
	 */
	QNA_HIGHLIGHT: {
		/**
		 * Q&A session ID
		 */
		id: string;
	};
	/**
	 * Skips the top most message of given Q&A session
	 */
	QNA_SKIP: {
		/**
		 * Q&A session ID
		 */
		id: string;
	};

	EXECUTE_TRIGGER: {
		/**
		 * Trigger ID to execute
		 */
		id: string;
	};
	GET_TRIGGER_LIST: undefined;
	SET_TRIGGER_LIST: {
		triggerList: {
			id: string;
			name: string;
		}[];
	};
	TOGGLE_TRIGGER_STATE: {
		/**
		 * Trigger ID to change state of
		 */
		id: string;
		/**
		 * Force trigger state
		 * true to enable it
		 * false to disabled
		 *
		 * Don't set this field to just toggle current state
		 */
		forcedState?: boolean;
	};

	PLAY_SFXR: {
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
	AUTOMOD_ACCEPT: undefined;
	/**
	 * Rject latest message held by automod
	 */
	AUTOMOD_REJECT: undefined;
	/**
	 * Toggle merge feature
	 * See settings => chat features => Merge consecutive messages of a user
	 */
	MERGE_TOGGLE: undefined;
	/**
	 * Hide current chat alert
	 * See settings => chat features => Enable chat alert
	 */
	HIDE_CHAT_ALERT: undefined;
	/**
	 * Toggle current poll display
	 */
	POLL_TOGGLE: undefined;
	/**
	 * Toggle current prediction display
	 */
	PREDICTION_TOGGLE: undefined;
	/**
	 * Toggle current bingo display (NOT bingo GRID!)
	 */
	BINGO_TOGGLE: undefined;
	/**
	 * Toggle viewers count display
	 */
	VIEWERS_COUNT_TOGGLE: undefined;
	/**
	 * Toggle moderation tools display
	 */
	MOD_TOOLS_TOGGLE: undefined;
	/**
	 * Toggle censorship of deleted messages
	 */
	CENSOR_DELETED_MESSAGES_TOGGLE: undefined;
	/**
	 * Open poll creation form
	 */
	OPEN_POLL_CREATION_FORM: undefined;
	/**
	 * Open prediction creation form
	 */
	OPEN_PREDICTION_CREATION_FORM: undefined;
	SHOUTOUT: undefined;
	CLEAR_CHAT_HIGHLIGHT: undefined;
	STOP_POLL: undefined;
	STOP_PREDICTION: undefined;
	SEND_MESSAGE: {
		message: string;
	};
	/**
	 * Toggle current raffle display
	 */
	RAFFLE_TOGGLE: undefined;
	/**
	 * Start a new raffle
	 */
	OPEN_RAFFLE_CREATION_FORM: undefined;
	RAFFLE_PICK_WINNER: undefined;
	STOP_CURRENT_TTS_AUDIO: undefined;
	SEND_CUSTOM_CHAT_MESSAGE: {
		//Message to display
		message?: string;
		//Defines if the close button should be disaplay
		//defaults to "true" if omitted
		canClose?: boolean;
		//Defines if the message should be displayed on the "greet them" section
		todayFirst?: boolean;
		//User info
		user?: {
			name: string;
			color?: string;
		};
		//Column index to display the message to
		col?: number;
		//Button icon see list of values above
		icon?: string;
		//Color of the message for "highlight" style
		highlightColor?: string;
		//Message style
		style?: 'message' | 'highlight' | 'error';
		//Option quote displayed in a dedicated holder
		quote?: string;
		//buttons to add
		actions?: {
			//Button icon see list of values above
			icon?: string;
			//Button label
			label: string;
			//Type of action
			actionType?: 'url' | 'trigger' | 'message' | 'discord';
			//Page to open in a new tab for "url" actionType
			url?: string;
			//window target for "url" actionType
			urlTarget?: string;
			//Trigger to execute for "trigger" actionType.
			//Use CTRL+Alt+D on your triggers list to show their IDs
			triggerId?: string;
			//Message sent on chat for "message" and "discord" actionType values
			message?: string;
			//Button style
			theme?: 'default' | 'primary' | 'secondary' | 'alert';
		}[];
	};
};

interface OBSSourceItem {
	inputKind: string;
	isGroup: boolean | null;
	sceneItemId: number;
	sceneItemIndex: number;
	sourceName: string;
	sourceType: string;
	sceneItemTransform: SourceTransform;
	sceneName?: string;
}

interface SourceTransform {
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
	/**
	 * Center X of the source on the global space
	 */
	globalCenterX?: number;
	/**
	 * Center Y of the source on the global space
	 */
	globalCenterY?: number;
	/**
	 * Scale X of the source on the global space
	 */
	globalScaleX?: number;
	/**
	 * Scale Y of the source on the global space
	 */
	globalScaleY?: number;
	/**
	 * Rotation of the source on the global space
	 */
	globalRotation?: number;
	/**
	 * Top Left corner coordinates on the global space
	 */
	globalTL?: { x: number; y: number };
	/**
	 * Top Right corner coordinates on the global space
	 */
	globalTR?: { x: number; y: number };
	/**
	 * Bottom Left corner coordinates on the global space
	 */
	globalBL?: { x: number; y: number };
	/**
	 * Bottom Left corner coordinates on the global space
	 */
	globalBR?: { x: number; y: number };
}

type StreamSummaryData = {
	streamDuration: number;
	premiumWarningSlots?: { [slotType: string]: boolean };
	params?: EndingCreditsParams;
	follows: { uid: string; login: string }[];
	raids: { uid: string; login: string; raiders: number }[];
	subs: { uid: string; login: string; tier: 1 | 2 | 3 | 'prime'; subDuration?: number; fromActiveSubs?: true; platform: ChatPlatform }[];
	resubs: { uid: string; login: string; tier: 1 | 2 | 3 | 'prime'; subDuration?: number; fromActiveSubs?: true; platform: ChatPlatform }[];
	subgifts: { uid: string; login: string; tier: 1 | 2 | 3 | 'prime'; total: number; fromActiveSubs?: true; platform: ChatPlatform }[];
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
	tips: { login: string; amount: number; currency: string; platform: 'kofi' | 'streamlabs' | 'streamelements' | 'tipeee' | 'patreon' }[];
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
