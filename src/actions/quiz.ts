import streamDeck, { action, DialAction, KeyAction, KeyDownEvent } from '@elgato/streamdeck';
import { clearInterval, setInterval } from 'timers';
import { TwitchatEventMap } from '../TwitchatEventMap';
import { AbstractAction } from './AbstractActions';
import { formatDuration } from '../Utils';
import TwitchatSocket from '../TwitchatSocket';

/**
 * Action for Control current quiz.
 */
@action({ UUID: 'fr.twitchat.action.quiz' })
export class Quiz extends AbstractAction<Settings> {
	private _actionToState: Map<string, 'reveal' | 'next' | 'leaderboard'> = new Map();
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		if (this.getActionState(ev.action) !== 'default') {
			ev.action.showAlert();
		} else {
			const state = this._actionToState.get(ev.action.id);
			switch (state) {
				case 'reveal':
					TwitchatSocket.instance.broadcast('SET_QUIZ_REVEAL');
					break;
				case 'next':
					TwitchatSocket.instance.broadcast('SET_QUIZ_NEXT_QUESTION');
					break;
				case 'leaderboard':
					TwitchatSocket.instance.broadcast('SET_QUIZ_TOGGLE_LEADERBOARD');
					break;
			}
		}
	}

	protected override onGlobalStatesUpdate(
		data: TwitchatEventMap['ON_GLOBAL_STATES'] | undefined,
		_settings: Settings,
		action: DialAction<{}> | KeyAction<{}>,
	): void {
		if (this._forceOfflineState) return;
		const currentQuiz = data?.currentQuiz;
		if (!currentQuiz) {
			this.setText(action, streamDeck.i18n.translate('no-active-quiz'));
			this.setErrorState(action);
		} else {
			this.setEnabledState(action);
			const startedAt = new Date(currentQuiz.timerStartedAt);
			const quizStarted = currentQuiz.timerStartedAt !== '' || currentQuiz.questionIndex > 0;
			if (quizStarted) {
				action.setTitle(currentQuiz.questionIndex + 1 + '/' + currentQuiz.totalQuestions);
			}

			const renderTimer = () => {
				if (this.getActionState(action) === 'disabled' || this.getActionState(action) === 'error') {
					return;
				}

				const duration = currentQuiz.questionDuration_ms;
				const elapsed = Date.now() - startedAt.getTime();

				if (quizStarted && duration > 0 && elapsed < duration) {
					this.setText(action, formatDuration(duration - elapsed));
					this.setEnabledState(action);
					this._actionToState.set(action.id, 'reveal');
					this.setImage(action, 'imgs/actions/quiz/reveal.svg');
				} else {
					this.setText(action, currentQuiz.name);
					this.setEnabledState(action);

					if (!quizStarted) {
						this.setImage(action, 'imgs/actions/quiz/start.svg');
						this._actionToState.set(action.id, 'next');
					} else if (!currentQuiz.answerRevealed) {
						this.setImage(action, 'imgs/actions/quiz/reveal.svg');
						this._actionToState.set(action.id, 'reveal');
					} else if (currentQuiz.questionIndex < currentQuiz.totalQuestions - 1) {
						this.setImage(action, 'imgs/actions/quiz/next.svg');
						this._actionToState.set(action.id, 'next');
					} else {
						this.setImage(action, 'imgs/actions/quiz/leaderboard.svg');
						this._actionToState.set(action.id, 'leaderboard');
					}
					clearInterval(this._actionToRefreshInterval.get(action.id));
				}
			};
			if (this._actionToRefreshInterval.has(action.id)) {
				clearInterval(this._actionToRefreshInterval.get(action.id));
			}
			const interval = setInterval(() => {
				renderTimer();
			}, 100);
			renderTimer();
			this._actionToRefreshInterval.set(action.id, interval);
		}
	}
}

/**
 * Settings for {@link Quiz}.
 */
type Settings = {};
