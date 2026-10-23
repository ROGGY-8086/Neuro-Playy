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
  AlertCircle
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameResult, setGameResult] = useState<DailyGameResult | null>(null);
  const [alreadyCompletedScore, setAlreadyCompletedScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Initialize or resume game
  useEffect(() => {
    let isMounted = true;

    async function initGame() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const status: DailyGameStatus = await ApiService.getDailyGameStatus();

        if (!isMounted) return;

        if (status.hasPlayedToday && status.todayScore !== null && status.todayScore !== undefined) {
          setAlreadyCompletedScore(status.todayScore);
          setIsLoading(false);
          return;
        }

        // Start or resume session
        const gameSession = await ApiService.startDailyGame();
        if (!isMounted) return;

        if (!gameSession || !gameSession.questions || gameSession.questions.length === 0) {
          setProfileIncomplete(true);
          setIsLoading(false);
          return;
        }

        setSession(gameSession);

        // Resume at first unanswered question
        const firstUnanswered = gameSession.questions.findIndex(q => !q.userAnswer);
        if (firstUnanswered !== -1) {
          setCurrentIndex(firstUnanswered);
          setSelectedOption(gameSession.questions[firstUnanswered].userAnswer || null);
        } else {
          // All answered but not finalized
          setCurrentIndex(gameSession.questions.length - 1);
          setSelectedOption(gameSession.questions[gameSession.questions.length - 1].userAnswer || null);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Could not load today’s memory game.';
        if (msg.includes('profile') || msg.includes('incomplete') || msg.includes('facts')) {
          setProfileIncomplete(true);
        } else {
          setErrorMessage(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initGame();
    return () => { isMounted = false; };
  }, []);

  // Update selected option when moving between questions
  useEffect(() => {
    if (session && session.questions && session.questions[currentIndex]) {
      setSelectedOption(session.questions[currentIndex].userAnswer || null);
    }
  }, [currentIndex, session]);

  const currentQuestion: ClientQuestion | null =
    session && session.questions && session.questions[currentIndex]
      ? session.questions[currentIndex]
      : null;

  const totalQuestions = session?.questions?.length || 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle Option Click
  const handleSelectOption = async (option: string) => {
    if (!session || isSubmitting) return;

    playClick();
    setSelectedOption(option);
    setIsSubmitting(true);

    try {
      // Save answer to session on backend
      const updatedSession = await ApiService.submitDailyGameAnswer(currentIndex, option);
      setSession(updatedSession);
    } catch (err) {
      console.warn('Failed to save answer immediately:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance or Complete
  const handleNextOrFinish = async () => {
    if (!session || !selectedOption) return;

    if (!isLastQuestion) {
      playClick();
      setCurrentIndex(prev => prev + 1);
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
    if (currentIndex > 0) {
      playClick();
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 font-sans selection:bg-emerald-200 selection:text-emerald-950 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b-2 border-stone-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/caregiver/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
              <span>Dashboard</span>
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
              className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 transition-colors shadow-2xs"
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
              Preparing Today’s Memory Exercises...
            </h2>
            <p className="text-sm text-stone-600">
              Gathering personalized questions from your guardian profile.
            </p>
          </div>
        )}

        {/* Profile Incomplete State */}
        {!isLoading && profileIncomplete && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink-950 tracking-tight">
                Guardian Profile Required
              </h2>
              <p className="mt-2 text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                To generate your personalized daily memory questions, please have a guardian or family member add your basic details, family members, or life events.
              </p>
            </div>
            <div>
              <Link
                to="/guardian/setup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Set Up Guardian Profile</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Already Played Today State */}
        {!isLoading && alreadyCompletedScore !== null && !gameResult && (
          <div className="bg-white rounded-3xl border-2 border-stone-300 p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                Daily Activity Completed
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
                Great effort exercising your episodic recall today. New questions will be generated for you tomorrow morning!
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/caregiver/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Return to Dashboard</span>
              </Link>
              <Link
                to="/guardian/setup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm transition-colors"
              >
                <span>Review Guardian Profile</span>
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
              <Link
                to="/caregiver/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Go to Dashboard</span>
              </Link>
              <Link
                to="/guardian/setup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm transition-colors"
              >
                <span>Edit Guardian Facts</span>
              </Link>
            </div>
          </div>
        )}

        {/* Active In-Progress Game Question */}
        {!isLoading && !profileIncomplete && alreadyCompletedScore === null && !gameResult && currentQuestion && (
          <div className="space-y-6">
            {/* Top Progress Bar */}
            <div className="bg-white rounded-2xl border-2 border-stone-300 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentQuestion.category || 'Personal Recall'}
                </span>
                <span className="font-mono text-stone-700">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
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
            <div className="bg-white rounded-3xl border-2 border-stone-300 p-6 sm:p-10 shadow-sm space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Memory Prompt
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-ink-950 tracking-tight leading-snug">
                  {currentQuestion.questionText}
                </h1>
              </div>

              {/* 4 Multiple Choice Options */}
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
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer text-sm font-semibold shadow-2xs ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-700/30'
                          : 'border-stone-300 bg-white hover:bg-stone-50 text-ink-950 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-800 text-white'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &larr; Previous
                </button>

                <button
                  type="button"
                  disabled={!selectedOption || isSubmitting}
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isLastQuestion ? (
                    <>
                      <span>Complete & See Score</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
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
        Personalized Daily Memory Game &bull; Cognitive Gaming & Memory Assistance Platform
      </footer>
    </div>
  );
}

export default DailyMemoryGamePage;
