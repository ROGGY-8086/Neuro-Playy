import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Volume2,
  VolumeX,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Award,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { ApiService } from '../../services/api';
import {
  DailyGameSession,
  DailyGameStatus,
  DailyGameResult,
  ClientQuestion
} from '../../types';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export function DailyMemoryGamePage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];
  const { playSuccess, playNotice, playClick, soundEnabled, toggleSound } = useSound();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<DailyGameSession | null>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Store answers locally by question index
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const [gameResult, setGameResult] = useState<DailyGameResult | null>(null);
  const [alreadyCompletedScore, setAlreadyCompletedScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [unconfiguredNotice, setUnconfiguredNotice] = useState<string | null>(null);

  const currentUser = ApiService.getCurrentUser();
  const exitRoute = currentUser?.role === 'CAREGIVER' ? '/caregiver/dashboard' : '/';

  // Initialize or resume game
  useEffect(() => {
    let isMounted = true;

    async function initGame() {
      setIsLoading(true);
      setErrorMessage('');
      setUnconfiguredNotice(null);

      try {
        const status: DailyGameStatus = await ApiService.getDailyGameStatus();

        if (!isMounted) return;

        // If today's game is already completed and scored, show completed state
        if (status.hasPlayedToday && status.todayScore !== null && status.todayScore !== undefined) {
          setAlreadyCompletedScore(status.todayScore);
          setIsLoading(false);
          return;
        }

        // Start or resume session
        const gameSession = await ApiService.startDailyGame();
        if (!isMounted) return;

        if (!gameSession || !gameSession.questions || gameSession.questions.length === 0) {
          setUnconfiguredNotice('Your caregiver hasn\'t configured your 5 personalized memory questions yet.');
          setIsLoading(false);
          return;
        }

        setSession(gameSession);
        setQuestions(gameSession.questions);

        // Resume previous answers if any exist from server session
        const initialAnswers: Record<number, string> = {};
        if (gameSession.answerState) {
          Object.entries(gameSession.answerState).forEach(([idxStr, ans]) => {
            const numIdx = parseInt(idxStr, 10);
            if (!isNaN(numIdx) && ans) {
              initialAnswers[numIdx] = ans;
            }
          });
        }
        setUserAnswers(initialAnswers);

        // Resume at first unanswered question
        const firstUnanswered = gameSession.questions.findIndex((_, idx) => !initialAnswers[idx]);
        if (firstUnanswered !== -1) {
          setCurrentIndex(firstUnanswered);
        } else {
          // All answered, sit on last question
          setCurrentIndex(gameSession.questions.length - 1);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Could not load today’s memory game.';
        if (
          msg.toLowerCase().includes('caregiver') ||
          msg.toLowerCase().includes('configured') ||
          msg.toLowerCase().includes('profile') ||
          msg.toLowerCase().includes('incomplete')
        ) {
          setUnconfiguredNotice('Your caregiver has not configured your 5 personalized memory game questions yet. Please check back soon!');
        } else {
          setErrorMessage(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initGame();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalQuestions = questions.length;
  const currentQuestion: ClientQuestion | null = questions[currentIndex] || null;
  const selectedOption = userAnswers[currentIndex] || null;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  // Handle Option Click
  const handleSelectOption = async (option: string) => {
    if (isSubmitting || isAdvancing) return;

    playClick();

    // 1. Immediately record in local state so the UI updates and Next button enables instantly
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));

    // 2. Persist answer to backend session asynchronously
    try {
      await ApiService.submitDailyGameAnswer(currentIndex, option);
    } catch (err) {
      console.warn('Failed to save answer immediately on backend:', err);
    }
  };

  // Advance or Complete
  const handleNextOrFinish = async () => {
    if (!selectedOption || isAdvancing || isSubmitting) return;

    if (!isLastQuestion) {
      // Advance to next question
      setIsAdvancing(true);
      playClick();
      setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      setTimeout(() => {
        setIsAdvancing(false);
      }, 150);
    } else {
      // Finalize and complete game
      setIsSubmitting(true);
      try {
        const result = await ApiService.completeDailyGame();
        playSuccess();
        setGameResult(result);
      } catch (err: unknown) {
        playNotice();
        const msg = err instanceof Error ? err.message : 'Could not finalize game score.';
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAdvancing) {
      playClick();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Play Again (Practice / Rehearsal mode)
  const handlePlayAgain = () => {
    playClick();
    setUserAnswers({});
    setCurrentIndex(0);
    setGameResult(null);
    setAlreadyCompletedScore(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 font-sans selection:bg-emerald-200 selection:text-emerald-950 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b-2 border-stone-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={exitRoute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-stone-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-ink-950 tracking-tight">
                Daily Memory Game
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="inline-flex rounded-lg border border-stone-300 bg-white p-1 text-xs font-semibold shadow-xs">
              {(['EN', 'MR', 'HI'] as SupportedLanguage[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    lang === code ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 transition-colors shadow-2xs cursor-pointer"
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-extrabold text-ink-950">
              Loading Your Daily Memory Questions...
            </h2>
            <p className="text-sm text-stone-600">
              Personalized questions prepared especially for you.
            </p>
          </div>
        )}

        {/* Unconfigured / Gentle Guidance State */}
        {!isLoading && unconfiguredNotice && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink-950 tracking-tight">
                Questions Being Prepared
              </h2>
              <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
                {unconfiguredNotice}
              </p>
              <p className="mt-2 text-xs text-stone-500">
                Your caregiver can configure 5 personalized questions anytime from the Caregiver Portal.
              </p>
            </div>
            <div>
              <Link
                to={exitRoute}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Return to Portal</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Already Played Today State */}
        {!isLoading && !unconfiguredNotice && alreadyCompletedScore !== null && !gameResult && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                Daily Activity Recorded
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink-950 tracking-tight mt-3">
                You’ve Finished Today’s Memory Game!
              </h2>
              <div className="my-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-100 border-2 border-stone-300">
                <Award className="w-6 h-6 text-amber-700" />
                <span className="text-lg font-extrabold text-ink-950">
                  Today’s Score: <span className="text-emerald-800 font-black">{alreadyCompletedScore}</span> / 5
                </span>
              </div>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Great job exercising your memory today! You can play again for practice or return to the main portal.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Play Again for Practice</span>
              </button>
              <Link
                to={exitRoute}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm transition-colors"
              >
                <span>Return to Portal</span>
              </Link>
            </div>
          </div>
        )}

        {/* Game Completed Just Now Screen */}
        {gameResult && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-8 sm:p-12 text-center shadow-md space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                Game Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink-950 tracking-tight mt-3">
                {gameResult.score >= 4
                  ? 'Fantastic Recall Today!'
                  : gameResult.score >= 2
                  ? 'Great Effort on Today’s Game!'
                  : 'Thank You for Playing Today!'}
              </h2>
              <div className="my-5 inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-50 border-2 border-stone-300">
                <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Final Daily Score
                </span>
                <span className="text-4xl sm:text-5xl font-black text-emerald-800 mt-1">
                  {gameResult.score} <span className="text-stone-400 text-2xl font-normal">/ {gameResult.totalQuestions}</span>
                </span>
                <span className="text-xs font-semibold text-stone-600 mt-1">
                  Accuracy: {gameResult.percentage}%
                </span>
              </div>
              <p className="text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
                {gameResult.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Play Again</span>
              </button>
              <Link
                to={exitRoute}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm transition-colors"
              >
                <span>Back to Portal</span>
              </Link>
            </div>
          </div>
        )}

        {/* Active In-Progress Game Question */}
        {!isLoading && !unconfiguredNotice && alreadyCompletedScore === null && !gameResult && currentQuestion && (
          <div className="space-y-6">
            {/* Top Progress Bar */}
            <div className="bg-white rounded-2xl border-2 border-stone-300 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-800 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentQuestion.category || 'Memory Question'}
                </span>
                <span className="font-mono text-stone-700 text-sm font-bold">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-950 text-sm flex items-start gap-3 shadow-xs"
              >
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Question Card */}
            <div className="bg-white rounded-3xl border-2 border-stone-300 p-6 sm:p-10 shadow-sm space-y-6">
              {/* Optional Photo / Image */}
              {currentQuestion.imageUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-stone-200 max-h-72 w-full bg-stone-50 flex items-center justify-center shadow-inner">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Memory Prompt Clue"
                    className="max-h-72 w-full object-cover sm:object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
                  Memory Prompt
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-ink-950 tracking-tight leading-snug">
                  {currentQuestion.questionText}
                </h1>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="radiogroup" aria-label="Answer options">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedOption === option;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(option)}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer text-sm sm:text-base font-bold shadow-2xs ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-700/30'
                          : 'border-stone-300 bg-white hover:bg-stone-50 text-ink-950 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-800 text-white'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Gentle Feedback Notification when answered */}
              {selectedOption ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Selected: <strong className="font-bold">{selectedOption}</strong>. Click below to continue.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Please choose an answer above to proceed.</span>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0 || isAdvancing}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  &larr; Previous
                </button>

                <button
                  type="button"
                  disabled={!selectedOption || isSubmitting || isAdvancing}
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Score...</span>
                    </>
                  ) : isLastQuestion ? (
                    <>
                      <span>Complete & See Score</span>
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ChevronRight className="w-5 h-5 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
        Neuro Playy &bull; Personalized Daily Memory Game &bull; Cognitive Health Lab
      </footer>
    </div>
  );
}

export default DailyMemoryGamePage;
