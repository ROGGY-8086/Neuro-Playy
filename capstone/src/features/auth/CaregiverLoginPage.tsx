import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Heart, Volume2, VolumeX, AlertCircle, ArrowLeft, Loader2, Sparkles, Gamepad2 } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export const CaregiverLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { soundEnabled, toggleSound, playSuccess, playNotice } = useSound(true);

  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Throttling for repeated failed attempts
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Countdown timer for throttling lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (lockoutRemaining > 0) {
      playNotice();
      setErrorMessage(`Please pause for ${lockoutRemaining} seconds before trying again.`);
      return;
    }

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
      setSuccessMessage(t.caregiverLoginSuccess);
      setFailedAttempts(0);

      // Check profile setup completion: if incomplete, redirect to Guardian Setup; otherwise dashboard
      try {
        const profileStatus = await ApiService.getGuardianProfileStatus();
        setTimeout(() => {
          if (res.user.role === 'PATIENT') {
            navigate('/player', { replace: true });
          } else if (!profileStatus.profileComplete) {
            navigate('/guardian/setup', { replace: true });
          } else {
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/caregiver/dashboard';
            navigate(from, { replace: true });
          }
        }, 700);
      } catch {
        setTimeout(() => {
          if (res.user.role === 'PATIENT') {
            navigate('/player', { replace: true });
          } else {
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/caregiver/dashboard';
            navigate(from, { replace: true });
          }
        }, 700);
      }
    } catch {
      playNotice();
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);

      if (nextFailures >= 5) {
        setLockoutRemaining(30);
        setErrorMessage(
          'Several attempts were not recognized. For security, please wait 30 seconds before your next attempt.'
        );
      } else {
        setErrorMessage(t.genericLoginError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIdentifier('caregiver');
    setPassword('Caregiver123!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Navigation & Accessibility Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-emerald-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg px-2.5 py-1.5 transition-colors"
          aria-label={t.backToChoice}
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
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

      {/* Main Form Area */}
      <main className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center">
        {/* Title */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900 mb-3 shadow-xs">
            <Heart className="w-7 h-7 text-amber-800 fill-amber-800/20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950">
            {t.caregiverLoginTitle}
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            {t.caregiverLoginSubtitle}
          </p>
        </div>

        {/* Demo Fill Helper Card */}
        <div className="w-full mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Caregiver Demo:</strong> user: <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">caregiver</code>
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="shrink-0 px-2.5 py-1 rounded-md bg-amber-800 text-white font-semibold text-[11px] hover:bg-amber-900 transition-colors cursor-pointer shadow-xs"
          >
            Fill Demo
          </button>
        </div>

        {/* Card Box */}
        <div className="w-full bg-white rounded-2xl border-2 border-stone-300 p-6 sm:p-8 shadow-md">
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
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <p className="leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Success Alert Box */}
          {successMessage && (
            <div
              role="status"
              className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-sm flex items-start gap-2.5"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-snug">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Identifier Field */}
            <div>
              <label htmlFor="login-identifier" className="block text-sm font-semibold text-ink-900 mb-1.5">
                {t.identifierLabel} <span className="text-red-700">*</span>
              </label>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t.identifierPlaceholder}
                autoComplete="username"
                disabled={isLoading || lockoutRemaining > 0}
                required
                aria-required="true"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-ink-900 mb-1.5">
                {t.passwordLabel} <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="current-password"
                  disabled={isLoading || lockoutRemaining > 0}
                  required
                  aria-required="true"
                  className="w-full min-h-[48px] pl-3.5 pr-12 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-stone-500 hover:text-ink-950 hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || lockoutRemaining > 0}
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-ink-950 text-white font-bold text-base hover:bg-ink-800 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-ink-950/30 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : lockoutRemaining > 0 ? (
                <span>Pause for {lockoutRemaining}s</span>
              ) : (
                <span>{t.caregiverLoginButton}</span>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center space-y-3 text-xs sm:text-sm text-stone-600">
            <div>
              <span>{t.noCaregiverAccountPrompt} </span>
              <Link
                to="/caregiver/signup"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
              >
                {t.goToCaregiverSignup}
              </Link>
            </div>

            {/* Switch to Patient Login */}
            <div className="pt-2">
              <Link
                to="/patient/login"
                className="inline-flex items-center gap-1.5 font-bold text-stone-700 hover:text-emerald-900 underline underline-offset-4 text-xs"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-800" />
                <span>{t.switchToPatientLogin}</span>
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

export default CaregiverLoginPage;
