import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Gamepad2, Volume2, VolumeX, AlertCircle, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export const PatientSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, playSuccess, playNotice } = useSound(true);

  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | undefined }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    const errors: { [key: string]: string | undefined } = {};

    if (!name.trim()) {
      errors.name = t.yourNameRequired || 'Please enter your name';
    }

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      errors.username = t.usernameRequired;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = t.emailInvalid;
    }

    if (!password) {
      errors.password = t.passwordRequired;
    } else if (password.length > 128) {
      errors.password = t.passwordMax;
    }

    if (!linkCode.trim()) {
      errors.linkCode = t.linkCodeRequired;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      playNotice();
      return;
    }

    setIsLoading(true);

    try {
      await ApiService.registerPatient({
        name: name.trim(),
        username: username.trim(),
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        password,
        linkCode: linkCode.trim().toUpperCase(),
      });

      playSuccess();
      setSuccessMessage(t.patientSignupSuccess);

      setTimeout(() => {
        navigate('/player', { replace: true });
      }, 700);
    } catch (err: unknown) {
      playNotice();
      const msg = err instanceof Error ? err.message : 'Registration failed. Please check your information.';
      setErrorMessage(msg);
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

      {/* Main Patient Form Area (Designed extra large and accessible) */}
      <main className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Title */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 mb-3 shadow-xs">
            <Gamepad2 className="w-9 h-9 text-emerald-800" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-950">
            {t.patientSignupTitle}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
            {t.patientSignupSubtitle}
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
            {/* 1. Caregiver Link Code (Highlighted with key icon) */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80">
              <label htmlFor="patient-code" className="block text-base font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-5 h-5 text-amber-800" />
                <span>{t.linkCodeLabel}</span> <span className="text-red-700">*</span>
              </label>
              <input
                id="patient-code"
                type="text"
                value={linkCode}
                onChange={(e) => {
                  setLinkCode(e.target.value.toUpperCase());
                  if (fieldErrors.linkCode) setFieldErrors((prev) => ({ ...prev, linkCode: undefined }));
                }}
                placeholder={t.linkCodePlaceholder}
                maxLength={10}
                disabled={isLoading}
                required
                aria-required="true"
                className="w-full min-h-[54px] px-4 py-3 rounded-xl border-2 border-amber-400 bg-white text-ink-950 font-mono font-black text-xl tracking-widest placeholder-stone-400 focus:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-700/20 uppercase"
              />
              <p className="mt-1.5 text-xs sm:text-sm text-amber-900 font-medium">
                {t.linkCodeHelper}
              </p>
              {fieldErrors.linkCode && <p className="mt-1 text-sm text-red-700 font-bold">{fieldErrors.linkCode}</p>}
            </div>

            {/* 2. Your Name */}
            <div>
              <label htmlFor="patient-name" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.yourNameLabel} <span className="text-red-700">*</span>
              </label>
              <input
                id="patient-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t.yourNamePlaceholder}
                disabled={isLoading}
                required
                aria-required="true"
                className="w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 text-lg font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              />
              {fieldErrors.name && <p className="mt-1 text-sm text-red-700 font-bold">{fieldErrors.name}</p>}
            </div>

            {/* 3. Username */}
            <div>
              <label htmlFor="patient-username" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.usernameLabel} <span className="text-red-700">*</span>
              </label>
              <input
                id="patient-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: undefined }));
                }}
                placeholder={t.usernamePlaceholder}
                disabled={isLoading}
                required
                aria-required="true"
                className="w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 text-lg font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              />
              {fieldErrors.username && <p className="mt-1 text-sm text-red-700 font-bold">{fieldErrors.username}</p>}
            </div>

            {/* 4. Optional Email */}
            <div>
              <label htmlFor="patient-email" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.optionalEmailLabel}
              </label>
              <input
                id="patient-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder={t.optionalEmailPlaceholder}
                disabled={isLoading}
                className="w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 text-lg font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              />
              {fieldErrors.email && <p className="mt-1 text-sm text-red-700 font-bold">{fieldErrors.email}</p>}
            </div>

            {/* 5. Password */}
            <div>
              <label htmlFor="patient-password" className="block text-base font-bold text-ink-900 mb-1.5">
                {t.passwordLabel} <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="patient-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder={t.passwordPlaceholder}
                  maxLength={128}
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
              {fieldErrors.password && <p className="mt-1 text-sm text-red-700 font-bold">{fieldErrors.password}</p>}
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
                <span>{t.patientSignupButton}</span>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center space-y-2 text-sm text-stone-600">
            <div>
              <span>{t.havePatientAccountPrompt} </span>
              <Link
                to="/patient/login"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
              >
                {t.goToPatientLogin}
              </Link>
            </div>
            <div>
              <Link
                to="/caregiver/signup"
                className="font-medium text-stone-500 hover:text-ink-950 underline underline-offset-4 text-xs"
              >
                Are you a caregiver? Go to Caregiver Signup
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

export default PatientSignupPage;
