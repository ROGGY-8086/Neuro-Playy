import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Gamepad2, Volume2, VolumeX, AlertCircle, ArrowLeft, Loader2, Heart, Sparkles } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export const PatientLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { soundEnabled, toggleSound, playSuccess, playNotice } = useSound(true);

  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Silently ping backend on mount to wake it up early
  useEffect(() => {
    ApiService.warmUpBackend();
  }, []);

  // Show helpful warming up indicator if request takes > 2.5s
  useEffect(() => {
    let timer: any;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsWarmingUp(true);
      }, 2500);
    } else {
      setIsWarmingUp(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedId = identifier.trim();
    if (!trimmedId || !password) {
      playNotice();
      setErrorMessage(t.genericLoginError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await ApiService.login(trimmedId, password);
      playSuccess();
      setSuccessMessage(t.patientLoginSuccess);

      setTimeout(() => {
        if (res.user.role === 'CAREGIVER') {
          navigate('/caregiver/dashboard', { replace: true });
        } else {
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/player';
          navigate(from, { replace: true });
        }
      }, 700);
    } catch {
      playNotice();
      setErrorMessage(t.genericLoginError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-base font-bold text-emerald-900 hover:text-emerald-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg px-2.5 py-1.5 transition-colors"
          aria-label={t.backToChoice}
        >
          <ArrowLeft className="w-5 h-5 text-emerald-800" />
          <span>{t.backToChoice}</span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div
            className="inline-flex rounded-lg border border-stone-300 bg-white p-1 text-xs font-semibold shadow-xs"
            role="group"
            aria-label="Language selection"
          >
            {(['EN', 'MR', 'HI'] as SupportedLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  lang === code ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-ink-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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

      {/* Main Patient Login Form Area */}
      <main className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center">
        {/* Title */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 mb-3 shadow-xs">
            <Gamepad2 className="w-9 h-9 text-emerald-800" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
            {t.patientLoginTitle}
          </h1>
          <p className="mt-2 text-base text-stone-600 leading-relaxed max-w-sm mx-auto">
            {t.patientLoginSubtitle}
          </p>
        </div>

        {/* Card Box */}
        <div className="w-full bg-white rounded-3xl border-3 border-emerald-800/20 p-6 sm:p-9 shadow-lg">
          {/* Live Announcements */}
          <div aria-live="assertive" className="sr-only">
            {errorMessage}
          </div>
          <div aria-live="polite" className="sr-only">
            {successMessage || (isLoading ? t.processing : '')}
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 text-base flex items-start gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
              <p className="leading-snug font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Success Alert Box */}
          {successMessage && (
            <div
              role="status"
              className="mb-5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-base flex items-start gap-3"
            >
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-snug font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Identifier Field */}
            <div>
              <label htmlFor="patient-identifier" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.identifierLabel} <span className="text-red-700">*</span>
              </label>
              <input
                id="patient-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t.identifierPlaceholder}
                autoComplete="username"
                disabled={isLoading}
                required
                aria-required="true"
                className="w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 text-lg font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="patient-password" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.passwordLabel} <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="patient-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  className="w-full min-h-[54px] pl-4 pr-14 py-3 rounded-2xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 text-lg font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-stone-500 hover:text-ink-950 hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Big Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[58px] px-6 py-4 rounded-2xl bg-emerald-800 text-white font-extrabold text-lg hover:bg-emerald-900 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <span>{t.patientLoginButton}</span>
              )}
            </button>

            {/* Cold start wake-up indicator */}
            {isWarmingUp && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center gap-2.5 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Connecting to cloud server (Render free tier wakes up in ~30s on first load)...</span>
              </div>
            )}
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center space-y-3 text-sm text-stone-600">
            <div>
              <span>{t.noPatientAccountPrompt} </span>
              <Link
                to="/patient/signup"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
              >
                {t.goToPatientSignup}
              </Link>
            </div>

            {/* Switch to Caregiver Login */}
            <div className="pt-2">
              <Link
                to="/caregiver/login"
                className="inline-flex items-center gap-1.5 font-bold text-stone-700 hover:text-emerald-900 underline underline-offset-4 text-xs"
              >
                <Heart className="w-4 h-4 text-amber-700" />
                <span>{t.switchToCaregiverLogin}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
        Cognitive Gaming & Memory Assistance Platform &bull; Designed with warmth, care, and accessibility.
      </footer>
    </div>
  );
};

export default PatientLoginPage;
