import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Heart, Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export const LandingChoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, playClick } = useSound(true);
  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const currentUser = ApiService.getCurrentUser();
  const isAuthenticated = ApiService.isAuthenticated();

  const handleRoleSelect = (route: string) => {
    playClick();
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 font-sans selection:bg-emerald-200 selection:text-emerald-950 flex flex-col justify-between">
      {/* Top Header & Accessible Controls */}
      <header className="w-full max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-ink-950 block leading-none">
              Cognitive Companion
            </span>
            <span className="text-[11px] font-medium text-stone-500 font-mono tracking-wide">
              Memory & Care Assistance
            </span>
          </div>
        </div>

        {/* Accessibility Tools: Language & Sound */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div
            className="inline-flex rounded-xl border border-stone-300 bg-white p-1 text-xs font-semibold shadow-xs"
            role="group"
            aria-label="Language selection"
          >
            {(['EN', 'MR', 'HI'] as SupportedLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === code
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                aria-pressed={lang === code}
              >
                {code === 'EN' ? 'English' : code === 'MR' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-ink-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label={soundEnabled ? t.soundOn : t.soundOff}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">{t.soundOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">{t.soundOff}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Choice Body */}
      <main className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        {/* Welcome Banner */}
        <div className="text-center mb-8 sm:mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300/60 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gentle &bull; Non-Clinical &bull; Supportive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink-950 leading-tight">
            {t.welcomeTitle}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Existing Session Shortcut if logged in */}
        {isAuthenticated && currentUser && (
          <div className="w-full max-w-xl mb-8 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-amber-800 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-950">
                  {currentUser.role === 'PATIENT' ? t.alreadyLoggedInPatient : t.alreadyLoggedInCaregiver}{' '}
                  <span className="underline">{currentUser.name || currentUser.username}</span>
                </p>
                <p className="text-xs text-amber-800 font-mono">
                  Role: {currentUser.role} &bull; @{currentUser.username}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRoleSelect(currentUser.role === 'PATIENT' ? '/player' : '/caregiver/dashboard')}
              className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Enter Now &rarr;
            </button>
          </div>
        )}

        {/* The Two Main Role Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Patient / Player */}
          <div className="bg-white rounded-3xl border-3 border-emerald-800/25 p-7 sm:p-9 shadow-md hover:border-emerald-700 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-9 h-9 text-emerald-800" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Patient &bull; Player Space
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-950 mt-1 mb-3">
                {t.patientCardTitle}
              </h2>

              <p className="text-base text-stone-600 leading-relaxed mb-6">
                {t.patientCardDesc}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('/patient/login')}
                className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-800 text-white font-extrabold text-lg hover:bg-emerald-900 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30"
              >
                <span>{t.patientCardLogin}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center">
                <Link
                  to="/patient/signup"
                  onClick={playClick}
                  className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm inline-block py-1"
                >
                  {t.patientCardSignup}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Caregiver / Family Member */}
          <div className="bg-white rounded-3xl border-3 border-stone-300 p-7 sm:p-9 shadow-md hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Heart className="w-9 h-9 text-amber-800 fill-amber-800/20" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
                Caregiver &bull; Family Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-950 mt-1 mb-3">
                {t.caregiverCardTitle}
              </h2>

              <p className="text-base text-stone-600 leading-relaxed mb-6">
                {t.caregiverCardDesc}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('/caregiver/login')}
                className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-ink-950 text-white font-extrabold text-lg hover:bg-ink-800 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-ink-950/30"
              >
                <span>{t.caregiverCardLogin}</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <div className="text-center">
                <Link
                  to="/caregiver/signup"
                  onClick={playClick}
                  className="text-xs sm:text-sm font-bold text-stone-700 hover:text-ink-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 rounded-sm inline-block py-1"
                >
                  {t.caregiverCardSignup}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Supportive Quality Guarantee */}
        <div className="mt-12 text-center text-xs text-stone-500 max-w-lg leading-relaxed flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Non-evaluative platform. Data is preserved for comforting reminiscence and daily routine guidance.
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
        Cognitive Gaming & Memory Assistance Platform &bull; Built with accessibility, calm warmth, and dignity.
      </footer>
    </div>
  );
};

export default LandingChoicePage;
