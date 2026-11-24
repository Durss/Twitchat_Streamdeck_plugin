SDPIComponents.i18n.locales = {
	en: {
		automod: {
			fields: {
				automodAction: 'Action',
			},
			action: {
				accept: 'Accept message',
				reject: 'Reject message',
			},
		},
		'automod-accept': {},
		'automod-reject': {},
		'bid-war-update': {
			'loading-bidwars': 'Loading bid wars...',
			fields: {
				id: 'Bid war',
				action: 'Action',
				value: 'Value',
			},
		},
		'bingo-grid': {
			'loading-grids': 'Loading grid list...',
			fields: {
				gridId: 'Grid',
				gridAction: 'Action',
			},
			action: {
				ENABLE: 'Enable grid',
				DISABLE: 'Disable grid',
				TOGGLE: 'Toggle grid',
				VISIBILITY: 'Show/hide active grid',
			},
			hint: 'ℹ️ Short press: show or hide\nℹ️ Long press: show, hide on release',
		},
		'bingo-toggle': {},
		'censor-deleted-messages-toggle': {},
		'chat-feed-control': {
			fields: {
				chatAction: 'Action',
				scrollAmount: 'Scroll amount',
				readMode: 'Messages',
				readCount: 'Number of messages',
			},
			action: {
				pause: 'Pause/Unpause',
				scroll: 'Scroll',
				read: 'Mark messages as read',
			},
			mode: {
				count: 'Mark X messages as read',
				all: 'Mark all messages as read',
			},
			encoder: {
				scroll: 'ℹ️ Rotate the dial to scroll the column.\nPush or touch it to scroll back to the bottom.',
				read: 'ℹ️ Rotate the dial to move the read marker.\nPush or touch it to mark all messages as read.',
			},
		},
		'chat-feed-pause': {},
		'chat-feed-read': {
			fields: {
				readCount: 'Number of messages',
				'col-index': 'Column index',
			},
		},
		'chat-feed-read-all': {},
		'chat-feed-read-encoder': {},
		'chat-feed-scroll': {
			fields: {
				amount: 'Scroll amount',
			},
		},
		'chat-feed-scroll-down': {
			fields: {
				amount: 'Scroll amount',
			},
		},
		'chat-feed-scroll-up': {
			fields: {
				amount: 'Scroll amount',
			},
		},
		'chat-feed-select': {},
		'chat-feed-unpause': {},
		'clear-chat-highlight': {},
		'countdown-add': {
			'loading-countdowns': 'Loading countdowns...',
			fields: {
				countdownId: 'Countdown',
				duration: 'Duration',
			},
		},
		'counter-add': {
			'loading-counters': 'Loading counters...',
			fields: {
				counterId: 'Counter',
				counterAction: 'Action',
				countAdd: 'Value',
			},
			action: {
				ADD: 'Add value to counter',
				DEL: 'Remove value from counter',
				SET: 'Set counter value',
			},
		},
		deprecated: {
			automod: '⛔ This action is deprecated. Please use the new action "Accept or reject last automoded message" instead.',
			'bingo-grid':
				'⛔ This action is deprecated. Please use the new action "Enable/Disable a bingo grid or show/hide it" instead.',
			'chat-feed-control': '⛔ This action is deprecated. Please use the new action "Control a chat column" instead.',
			dismiss:
				'⛔ This action is deprecated. Please use the new action "Dismiss highlight, alert, TTS or pinned message" instead.',
			'greet-feed-mark-read':
				'⛔ This action is deprecated. Please use the new action "Remove messages from "Greet them" section" instead.',
			prompt: '⛔ This action is deprecated. Please use the new action "Validate or reject a prompt window" instead.',
			qna: '⛔ This action is deprecated. Please use the new action "Highlight or skip top-most Q&A entry" instead.',
			raffle: '⛔ This action is deprecated. Please use the new action "Show/Hide current raffle or pick a winner" instead.',
			timer: '⛔ This action is deprecated. Please use the new action "Add or remove time on a timer or countdown" instead.',
			'toggle-activity':
				'⛔ This action is deprecated. Please use the new action "Show/Hide current poll, prediction or bingo" instead.',
			'toggle-chat-option': '⛔ This action is deprecated. Please use the new action "Toggle a chat option" instead.',
			trigger: '⛔ This action is deprecated. Please use the new action "Execute, enable or disable a trigger" instead.',
		},
		'disable-stt': {
			deprecated: '⛔ This action is deprecated. Please use the new action "Enable/Disable voice control" instead.',
		},
		dismiss: {
			fields: {
				dismissTarget: 'Action',
			},
			target: {
				highlight: 'Close highlighted message',
				alert: 'Hide !alert message',
				tts: 'Stop current text to speech',
				pinned: 'Unpin Twitch message',
			},
			'alert-info': 'For more details, in Twitchat, head over settings 🠞 chat features 🠞 Enable chat alert.',
		},
		'enable-stt': {
			deprecated: '⛔ This action is deprecated. Please use the new action "Enable/Disable voice control" instead.',
		},
		'execute-trigger': {
			'loading-triggers': 'Loading trigger list...',
			fields: {
				triggerId: 'Trigger',
			},
		},
		global: {
			'loading-data': 'Loading data...',
			'no-data': 'No data available.',
			'error-loading-data': 'Error loading data.',
			'col-index': 'Column index',
			'loading-columns': 'Loading columns...',
			'scroll-amount': 'Scroll amount',
			'no-trigger': 'No trigger available.',
		},
		'greet-feed-mark-read': {
			fields: {
				readMode: 'Action',
				readCount: 'Messages to clear',
			},
			mode: {
				count: 'Remove X messages',
				all: 'Clear section',
			},
		},
		'greet-feed-read': {
			fields: {
				readCount: 'Messages to clear',
			},
		},
		'greet-feed-read-all': {},
		'hide-alert': {
			info: 'For more details, in Twitchat, head over settings 🠞 chat features 🠞 Enable chat alert.',
		},
		main: {
			'secret-key': '🔑 Secret key',
			copy: '📋Copy secret key',
			'copy-success': '✔️Key copied !',
			'reset-key': '🔃Reset secret key',
			'key-instructions': 'ℹ️Set this key in Twitchat under settings 🠞 connections 🠞 Stream Deck',
			offline:
				'⚠️ {TWITCHAT} not detected.\nIf you have issues connecting Twitchat with Stream Deck, come seek help on {DISCORD}.',
			'multiple-instances':
				'⚠️ More than 1 Twitchat instance detected. This may cause issues.\n\nPlease close all other instances except one.',
		},
		'merge-toggle': {},
		'mod-tools-toggle': {},
		'poll-toggle': {},
		'prediction-toggle': {},
		prompt: {
			fields: {
				promptAction: 'Action',
			},
			action: {
				accept: 'Validate',
				reject: 'Reject',
			},
			info: 'ℹ️ Prompt windows can be opened from the triggers thanks to "Prompt me for input" action.',
		},
		'prompt-accept': {
			info: 'Accepts a prompt window.\n\nSuch window can be opened from the triggers thanks to "Prompt me for input" action.',
		},
		'prompt-reject': {
			info: 'Rejects a prompt window.\n\nSuch window can be opened from the triggers thanks to "Prompt me for input" action.',
		},
		qna: {
			'loading-qnas': 'Loading Q&A sessions...',
			fields: {
				qnaId: 'Q&A Session',
				qnaAction: 'Action',
			},
			action: {
				highlight: 'Highlight top-most entry',
				skip: 'Skip top-most entry',
			},
		},
		'qna-highlight': {
			'loading-qnas': 'Loading Q&A sessions...',
			fields: {
				qnaId: 'Q&A Session',
			},
		},
		'qna-skip': {
			'loading-qnas': 'Loading Q&A sessions...',
			fields: {
				qnaId: 'Q&A Session',
			},
		},
		quiz: {
			info: 'ℹ️ Simply press the button to reveal the answer to the current question or move to the next question. Once the last answer is revealed, pressing the button will display the the leaderboard.',
		},
		raffle: {
			fields: {
				raffleAction: 'Action',
			},
			action: {
				toggle: 'Show/hide current raffle',
				'pick-winner': 'Pick a winner',
			},
			'pick-winner-info': 'ℹ️ Acts on the first raffle started currently running.',
		},
		'raffle-pick-winner': {},
		'raffle-toggle': {},
		'send-message': {
			info: 'ℹ️ You can use any Twitch command (ex: {TWITCH}), any Twitchat command (ex: {TWITCHAT}) or any of your custom /command created on the triggers.',
			fields: {
				message: 'Message',
			},
		},
		'set-animated-text': {
			'loading-animated-texts': 'Loading overlay list...',
			fields: {
				animatedTextId: 'Overlay',
				message: 'Message',
				autoHide: 'Auto hide text after animation completes',
			},
		},
		'set-emergency-mode': {},
		shoutout: {},
		'show-bingo-grid': {
			hint: 'ℹ️ Short press: show or hide\nℹ️ Long press: show, hide on release',
			'loading-bingo-grids': 'Loading bingo grids...',
			'no-active-bingo-grid': 'no active grid',
		},
		'stop-tts': {},
		timer: {
			'loading-timers': 'Loading timers...',
			fields: {
				timerId: 'Timer / Countdown',
				duration: 'Duration',
			},
		},
		'timer-add': {
			'loading-timers': 'Loading timers...',
			fields: {
				timerId: 'Timer',
				duration: 'Duration',
			},
		},
		'toggle-activity': {
			fields: {
				activity: 'Activity',
			},
			activity: {
				poll: 'Poll',
				prediction: 'Prediction',
				bingo: 'Bingo',
			},
		},
		'toggle-area': {
			'loading-areas': 'Loading clickable areas...',
			fields: {
				areaId: 'Clickable area',
				state: 'Action',
			},
			state: {
				ENABLE: 'Enable',
				DISABLE: 'Disable',
				TOGGLE: 'Toggle',
			},
		},
		'toggle-bingo-grid': {
			'loading-grids': 'Loading grid list...',
			fields: {
				gridId: 'Grid',
				gridAction: 'Action',
			},
			action: {
				ENABLE: 'Enable',
				DISABLE: 'Disable',
				TOGGLE: 'Toggle',
			},
		},
		'toggle-chat-option': {
			fields: {
				chatOption: 'Option',
			},
			option: {
				merge: 'Merge consecutive messages',
				censor: 'Censor deleted messages',
				'mod-tools': 'Moderation tools display',
				'viewers-count': 'Viewers count display',
			},
		},
		'toggle-trigger': {
			'loading-triggers': 'Loading trigger list...',
			fields: {
				triggerId: 'Trigger',
				triggerAction: 'Action',
			},
			action: {
				ENABLE: 'Enable',
				DISABLE: 'Disable',
				TOGGLE: 'Toggle',
			},
		},
		trigger: {
			'loading-triggers': 'Loading trigger list...',
			fields: {
				triggerId: 'Trigger',
				triggerAction: 'Action',
			},
			action: {
				EXECUTE: 'Execute',
				ENABLE: 'Enable',
				DISABLE: 'Disable',
				TOGGLE: 'Toggle',
			},
		},
		'unpin-twitch-message': {},
		'viewers-count-toggle': {},
		'voice-control': {},
	},
	fr: {
		automod: {
			fields: {
				automodAction: 'Action',
			},
			action: {
				accept: 'Accepter le message',
				reject: 'Rejeter le message',
			},
		},
		'automod-accept': {},
		'automod-reject': {},
		'bid-war-update': {
			'loading-bidwars': 'Chargement des bid wars...',
			fields: {
				id: 'Bid war',
				action: 'Action',
				value: 'Valeur',
			},
		},
		'bingo-grid': {
			'loading-grids': 'Chargement des grilles...',
			fields: {
				gridId: 'Grille',
				gridAction: 'Action',
			},
			action: {
				ENABLE: 'Activer la grille',
				DISABLE: 'Désactiver la grille',
				TOGGLE: 'Basculer la grille',
				VISIBILITY: 'Afficher/masquer la grille active',
			},
			hint: 'ℹ️ Pression courte : afficher ou masquer\nℹ️ Pression longue : afficher, masquer au relâchement',
		},
		'bingo-toggle': {},
		'censor-deleted-messages-toggle': {},
		'chat-feed-control': {
			fields: {
				chatAction: 'Action',
				scrollAmount: 'Distance',
				readMode: 'Messages',
				readCount: 'Nombre de messages',
			},
			action: {
				pause: 'Arrêter/Reprendre le défilement',
				scroll: 'Faire défiler',
				read: 'Marquer des messages comme lus',
			},
			mode: {
				count: 'Marquer X messages comme lus',
				all: 'Marquer tous les messages comme lus',
			},
			encoder: {
				scroll: "ℹ️ Tournez le bouton pour faire défiler la colonne.\nAppuyez dessus ou touchez l'écran pour revenir en bas.",
				read: "ℹ️ Tournez le bouton pour déplacer le marqueur de lecture.\nAppuyez dessus ou touchez l'écran pour tout marquer comme lu.",
			},
		},
		'chat-feed-pause': {},
		'chat-feed-read': {
			fields: {
				readCount: 'Nombre de messages',
			},
		},
		'chat-feed-read-all': {},
		'chat-feed-read-encoder': {},
		'chat-feed-scroll': {
			fields: {
				amount: 'Distance',
			},
		},
		'chat-feed-scroll-down': {
			fields: {
				amount: 'Distance',
			},
		},
		'chat-feed-scroll-up': {
			fields: {
				amount: 'Distance',
			},
		},
		'chat-feed-select': {},
		'chat-feed-unpause': {},
		'clear-chat-highlight': {},
		'countdown-add': {
			'loading-countdowns': 'Chargement des compte à rebours...',
			fields: {
				countdownId: 'Compte à rebours',
				duration: 'Durée',
			},
		},
		'counter-add': {
			'loading-counters': 'Chargement des compteurs...',
			fields: {
				counterId: 'Counter',
				counterAction: 'Action',
				countAdd: 'Value',
			},
			action: {
				ADD: 'Ajouter une valeur au compteur',
				DEL: 'Retirer une valeur du compteur',
				SET: 'Définir la valeur du compteur',
			},
		},
		deprecated: {
			automod:
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Accepter/Rejeter le dernier message retenu par l\'automod" à la place.',
			'bingo-grid':
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Activer/Désactiver une grille de bingo ou l\'afficher/masquer" à la place.',
			'chat-feed-control':
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Contrôler une colonne de tchat" à la place.',
			dismiss:
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Fermer mise en avant, alerte, TTS ou message épinglé" à la place.',
			'greet-feed-mark-read':
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Retirer des messages de la section "Dîtes bonjour"" à la place.',
			prompt: '⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Valider/Refuser une demande de paramètres" à la place.',
			qna: '⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Mettre en avant ou retirer la 1ère question d\'une session de Q&R" à la place.',
			raffle: '⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Afficher/Masquer le tirage au sort en cours ou tirer un·e gagnant·e" à la place.',
			timer: '⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Ajouter ou retirer du temps à un minuteur ou compte à rebours" à la place.',
			'toggle-activity':
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Afficher/Masquer le sondage, la prédiction ou le bingo en cours" à la place.',
			'toggle-chat-option':
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Activer/Désactiver une option du tchat" à la place.',
			trigger:
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Exécuter, activer ou désactiver un trigger" à la place.',
		},
		'disable-stt': {
			deprecated:
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Activer/Désactiver le contrôle vocal" à la place.',
		},
		dismiss: {
			fields: {
				dismissTarget: 'Action',
			},
			target: {
				highlight: 'Fermer le message mis en avant',
				alert: "Masquer l'alerte de tchat",
				tts: 'Arrêter la synthèse vocale en cours',
				pinned: 'Désépingler le message sur Twitch',
			},
			'alert-info':
				"Pour plus d'info, rendez-vous dans Twitchat dans paramètres 🠞 fonctionnalités de tchat 🠞 Activer la fenêtre d'alerte.",
		},
		'enable-stt': {
			deprecated:
				'⛔ Cette action est obsolète. Veuillez utiliser la nouvelle action "Activer/Désactiver le contrôle vocal" à la place.',
		},
		'execute-trigger': {
			'loading-triggers': 'Chargement des triggers...',
			fields: {
				triggerId: 'Trigger',
			},
		},
		global: {
			'loading-data': 'Chargement des données...',
			'no-data': 'Aucune donnée disponible.',
			'error-loading-data': 'Erreur lors du chargement des données.',
			'col-index': 'Colonne',
			'loading-columns': 'Chargement des colonnes...',
		},
		'greet-feed-mark-read': {
			fields: {
				readMode: 'Action',
				readCount: 'Messages à supprimer',
			},
			mode: {
				count: 'Retirer X messages',
				all: 'Vider la section',
			},
		},
		'greet-feed-read': {
			fields: {
				readCount: 'Messages à supprimer',
			},
		},
		'greet-feed-read-all': {},
		'hide-alert': {
			info: "Pour plus d'info, rendez-vous dans Twitchat dans paramètres 🠞 fonctionnalités de tchat 🠞 Activer la fenêtre d'alerte.",
		},
		main: {
			'secret-key': '🔑 Clé secrète',
			copy: '📋Copier la clé',
			'copy-success': '✔️Clé copiée !',
			'reset-key': '🔃Réinitialiser la clé',
			'key-instructions': 'ℹ️Renseignez cette clé dans Twitchat dans paramètres 🠞 connexions 🠞 Stream Deck dans Twitchat',
			offline:
				"⚠️ {TWITCHAT} non détecté.\nSi vous rencontrez des problèmes rendez-vous sur {DISCORD} pour demander de l'aide.",
			'multiple-instances':
				"⚠️ Twitchat est lancé plus d'une fois.\nCeci peut causer des problèmes.\n\nVeuillez fermer toutes les instances sauf une.",
		},
		'merge-toggle': {},
		'mod-tools-toggle': {},
		'poll-toggle': {},
		'prediction-toggle': {},
		prompt: {
			fields: {
				promptAction: 'Action',
			},
			action: {
				accept: 'Valider',
				reject: 'Refuser',
			},
			info: 'ℹ️ Ce type de fenêtre peut être ouverte depuis les triggers avec l\'action "Me demander des paramètres".',
		},
		'prompt-accept': {
			info: 'Accepte une fenêtre de demande de paramètres.\n\nCe type de fenêtre peut être ouverte depuis les triggers avec l\'aciton "Me demander des paramètres".',
		},
		'prompt-reject': {
			info: 'Refuser une fenêtre de demande de paramètres.\n\nCe type de fenêtre peut être ouverte depuis les triggers avec l\'aciton "Me demander des paramètres".',
		},
		qna: {
			'loading-qnas': 'Chargement des sessions Q&R...',
			fields: {
				qnaId: 'Sessions de Q&R',
				qnaAction: 'Action',
			},
			action: {
				highlight: 'Mettre en avant la 1ère question',
				skip: 'Retirer la 1ère question',
			},
		},
		'qna-highlight': {
			'loading-qnas': 'Chargement des sessions Q&R...',
			fields: {
				qnaId: 'Sessions de Q&R',
			},
		},
		'qna-skip': {
			'loading-qnas': 'Chargement des sessions Q&R...',
			fields: {
				qnaId: 'Sessions de Q&R',
			},
		},
		quiz: {
			info: 'ℹ️ Pressez simplement le bouton pour révéler la réponse de la question en cours ou passer à la question suivante. Une fois la dernière réponse révélée le bouton affichera le classement.',
		},
		raffle: {
			fields: {
				raffleAction: 'Action',
			},
			action: {
				toggle: 'Afficher/masquer le tirage en cours',
				'pick-winner': 'Tirer un·e gagnant·e',
			},
			'pick-winner-info': 'ℹ️ Agit sur le premier tirage au sort démarré encore en cours.',
		},
		'raffle-pick-winner': {},
		'raffle-toggle': {},
		'send-message': {
			info: "ℹ️ Vous pouvez utiliser n'importe quelle commande Twitch (ex: {TWITCH}), n'importe quelle commande Twitchat (ex: {TWITCHAT}) ou n'importe laquelle de vos /commande personnalisées créées dans les triggers.",
			fields: {
				message: 'Message',
			},
		},
		'set-animated-text': {
			'loading-animated-texts': 'Chargement de la liste...',
			fields: {
				animatedTextId: 'Overlay',
				message: 'Message',
				autoHide: "Masquer automatiquement le texte après l'animation",
			},
		},
		'set-emergency-mode': {},
		shoutout: {},
		'show-bingo-grid': {
			hint: 'ℹ️ Pression courte : afficher ou masquer\nℹ️ Pression longue : afficher, masquer au relâchement',
			'loading-bingo-grids': 'Chargement des grilles de bingo...',
		},
		'stop-tts': {},
		timer: {
			'loading-timers': 'Chargement des minuteurs...',
			fields: {
				timerId: 'Minuteur / Compte à rebours',
				duration: 'Durée',
			},
		},
		'timer-add': {
			'loading-timers': 'Chargement des minuteurs...',
			fields: {
				timerId: 'Minuteur',
				duration: 'Durée',
			},
		},
		'toggle-activity': {
			fields: {
				activity: 'Activité',
			},
			activity: {
				poll: 'Sondage',
				prediction: 'Prédiction',
				bingo: 'Bingo',
			},
		},
		'toggle-area': {
			'loading-areas': 'Chargement des zones cliquables...',
			fields: {
				areaId: 'Zone cliquable',
				state: 'Action',
			},
			state: {
				ENABLE: 'Activer',
				DISABLE: 'Désactiver',
				TOGGLE: 'Basculer',
			},
		},
		'toggle-bingo-grid': {
			'loading-grids': 'Chargement des grilles...',
			fields: {
				gridId: 'Grille',
				gridAction: 'Action',
			},
			action: {
				ENABLE: 'Activer',
				DISABLE: 'Désactiver',
				TOGGLE: 'Basculer',
			},
		},
		'toggle-chat-option': {
			fields: {
				chatOption: 'Option',
			},
			option: {
				merge: 'Fusion des messages consécutifs',
				censor: 'Censure des messages supprimés',
				'mod-tools': 'Affichage des outils de modération',
				'viewers-count': 'Affichage du nombre de spectateurices',
			},
		},
		'toggle-trigger': {
			'loading-triggers': 'Chargement des triggers...',
			fields: {
				triggerId: 'Trigger',
				triggerAction: 'Action',
			},
			action: {
				ENABLE: 'Activer',
				DISABLE: 'Désactiver',
				TOGGLE: 'Basculer',
			},
		},
		trigger: {
			'loading-triggers': 'Chargement des triggers...',
			fields: {
				triggerId: 'Trigger',
				triggerAction: 'Action',
			},
			action: {
				EXECUTE: 'Exécuter',
				ENABLE: 'Activer',
				DISABLE: 'Désactiver',
				TOGGLE: 'Basculer',
			},
		},
		'unpin-twitch-message': {},
		'viewers-count-toggle': {},
		'voice-control': {},
	},
};
