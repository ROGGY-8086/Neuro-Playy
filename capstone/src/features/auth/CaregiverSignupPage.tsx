import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Heart, Volume2, VolumeX, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export const CaregiverSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, playSuccess, playNotice } = useSound(true);

  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientLanguage, setPatientLanguage] = useState('en');
  const [consentAuthorized, setConsentAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | undefined }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    const errors: { [key: string]: string | undefined } = {};

    if (!name.trim()) {
      errors.name = 'Please enter your full name';
    }

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      errors.username = t.usernameRequired;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = t.emailInvalid;
    }

    if (!password) {
      errors.password = t.passwordRequired;
    } else if (password.length > 128) {
      errors.password = t.passwordMax;
    }

    if (!patientName.trim()) {
      errors.patientName = "Please enter the patient / loved one's name";
    }

    if (!consentAuthorized) {
      errors.consent = t.consentRequiredError;
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
      await ApiService.registerCaregiver({
        name: name.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        patientName: patientName.trim(),
        patientLanguage,
        consentAuthorized,
      });

      playSuccess();
      setSuccessMessage(t.caregiverSignupSuccess);

      setTimeout(() => {
        navigate('/guardian/setup', { replace: true });
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
      <main className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Title */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900 mb-3 shadow-xs">
            <Heart className="w-7 h-7 text-amber-800 fill-amber-800/20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950">
            {t.caregiverSignupTitle}
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            {t.caregiverSignupSubtitle}
          </p>
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
            {/* Section 1: Caregiver Details */}
            <div className="pb-3 border-b border-stone-200">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 block mb-3">
                1. Caregiver Account Information
              </span>

              {/* Full Name */}
              <div className="mb-3">
                <label htmlFor="caregiver-name" className="block text-sm font-semibold text-ink-900 mb-1">
                  {t.caregiverFullNameLabel} <span className="text-red-700">*</span>
                </label>
                <input
                  id="caregiver-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder={t.caregiverFullNamePlaceholder}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base"
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.name}</p>}
              </div>

              {/* Username & Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="caregiver-username" className="block text-sm font-semibold text-ink-900 mb-1">
                    {t.usernameLabel} <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="caregiver-username"
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
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base"
                  />
                  {fieldErrors.username && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.username}</p>}
                </div>

                <div>
                  <label htmlFor="caregiver-email" className="block text-sm font-semibold text-ink-900 mb-1">
                    {t.emailLabel} <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="caregiver-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder={t.emailPlaceholder}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base"
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.email}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="caregiver-password" className="block text-sm font-semibold text-ink-900 mb-1">
                  {t.passwordLabel} <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <input
                    id="caregiver-password"
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
                    className="w-full min-h-[48px] pl-3.5 pr-12 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base"
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
                {fieldErrors.password && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.password}</p>}
              </div>
            </div>

            {/* Section 2: Patient Profile Setup */}
            <div className="pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 block mb-3">
                2. Loved One / Patient Setup
              </span>

              {/* Patient's Name */}
              <div className="mb-3">
                <label htmlFor="patient-name" className="block text-sm font-semibold text-ink-900 mb-1">
                  {t.whoWillUseLabel} <span className="text-red-700">*</span>
                </label>
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (fieldErrors.patientName) setFieldErrors((prev) => ({ ...prev, patientName: undefined }));
                  }}
                  placeholder={t.whoWillUsePlaceholder}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50/50 text-ink-950 placeholder-stone-400 font-medium focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base"
                />
                {fieldErrors.patientName && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.patientName}</p>}
              </div>

              {/* Preferred Language */}
              <div className="mb-3">
                <label htmlFor="patient-language" className="block text-sm font-semibold text-ink-900 mb-1">
                  {t.patientLanguageLabel}
                </label>
                <select
                  id="patient-language"
                  value={patientLanguage}
                  onChange={(e) => setPatientLanguage(e.target.value)}
                  disabled={isLoading}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-ink-950 font-medium focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-base cursor-pointer"
                >
                  <option value="en">English (Default)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-300 flex items-start gap-3">
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consentAuthorized}
                  onChange={(e) => {
                    setConsentAuthorized(e.target.checked);
                    if (fieldErrors.consent) setFieldErrors((prev) => ({ ...prev, consent: undefined }));
                  }}
                  disabled={isLoading}
                  className="w-5 h-5 mt-0.5 rounded border-2 border-stone-400 text-emerald-800 focus:ring-emerald-700 cursor-pointer shrink-0"
                />
                <label htmlFor="consent-checkbox" className="text-xs text-stone-700 leading-snug cursor-pointer">
                  {t.consentCheckboxLabel} <span className="text-red-700">*</span>
                </label>
              </div>
              {fieldErrors.consent && <p className="mt-1 text-xs text-red-700 font-medium">{fieldErrors.consent}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-base hover:bg-emerald-900 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/30 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <span>{t.caregiverSignupButton}</span>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center space-y-2 text-xs sm:text-sm text-stone-600">
            <div>
              <span>{t.haveCaregiverAccountPrompt} </span>
              <Link
                to="/caregiver/login"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
              >
                {t.goToCaregiverLogin}
              </Link>
            </div>
            <div>
              <Link
                to="/patient/signup"
                className="font-medium text-stone-500 hover:text-ink-950 underline underline-offset-4"
              >
                Setting up a patient account? Go to Patient Signup
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

export default CaregiverSignupPage;
