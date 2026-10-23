import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  Users,
  Calendar,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ApiService } from '../../services/api';
import {
  GuardianProfileBundle,
  UserProfile,
  Relative,
  LifeEvent,
  PersonalQuestion
} from '../../types';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

export function GuardianProfileSetupPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];
  const { playSuccess, playNotice, playClick, soundEnabled, toggleSound } = useSound();

  const [activeTab, setActiveTab] = useState<'personal' | 'relatives' | 'events' | 'questions'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    nickname: '',
    dateOfBirth: '',
    placeOfBirth: '',
    currentCity: '',
    preferredLanguage: 'English',
    notes: '',
  });

  const [relatives, setRelatives] = useState<Relative[]>([]);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [personalQuestions, setPersonalQuestions] = useState<PersonalQuestion[]>([]);

  // Load existing profile on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const bundle = await ApiService.getGuardianProfile();
        if (isMounted && bundle) {
          if (bundle.profile) {
            setProfile({
              fullName: bundle.profile.fullName || '',
              nickname: bundle.profile.nickname || '',
              dateOfBirth: bundle.profile.dateOfBirth || '',
              placeOfBirth: bundle.profile.placeOfBirth || '',
              currentCity: bundle.profile.currentCity || '',
              preferredLanguage: bundle.profile.preferredLanguage || 'English',
              notes: bundle.profile.notes || '',
            });
          }
          if (bundle.relatives && bundle.relatives.length > 0) {
            setRelatives(bundle.relatives);
          } else {
            // Provide a starter template relative
            setRelatives([
              { fullName: '', relationship: 'Spouse', dateOfBirth: '', notes: '' }
            ]);
          }
          if (bundle.lifeEvents && bundle.lifeEvents.length > 0) {
            setLifeEvents(bundle.lifeEvents);
          } else {
            setLifeEvents([
              { eventTitle: '', eventYear: new Date().getFullYear() - 30, eventDescription: '' }
            ]);
          }
          if (bundle.personalQuestions && bundle.personalQuestions.length > 0) {
            setPersonalQuestions(bundle.personalQuestions);
          } else {
            setPersonalQuestions([
              {
                questionText: '',
                correctAnswer: '',
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
              }
            ]);
          }
        }
      } catch (err) {
        console.warn('Could not pre-load guardian profile (new user profile init):', err);
        // Start with default empty forms
        setRelatives([{ fullName: '', relationship: 'Spouse', dateOfBirth: '', notes: '' }]);
        setLifeEvents([{ eventTitle: '', eventYear: 1985, eventDescription: '' }]);
        setPersonalQuestions([{
          questionText: '',
          correctAnswer: '',
          wrongAnswer1: '',
          wrongAnswer2: '',
          wrongAnswer3: ''
        }]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Relative Handlers
  const addRelative = () => {
    playClick();
    setRelatives([
      ...relatives,
      { fullName: '', relationship: 'Family Member', dateOfBirth: '', notes: '' }
    ]);
  };

  const updateRelative = (index: number, field: keyof Relative, value: string) => {
    const updated = [...relatives];
    updated[index] = { ...updated[index], [field]: value };
    setRelatives(updated);
  };

  const removeRelative = (index: number) => {
    playClick();
    setRelatives(relatives.filter((_, i) => i !== index));
  };

  // Life Event Handlers
  const addLifeEvent = () => {
    playClick();
    setLifeEvents([
      ...lifeEvents,
      { eventTitle: '', eventYear: undefined, eventDescription: '' }
    ]);
  };

  const updateLifeEvent = (index: number, field: keyof LifeEvent, value: any) => {
    const updated = [...lifeEvents];
    updated[index] = { ...updated[index], [field]: value };
    setLifeEvents(updated);
  };

  const removeLifeEvent = (index: number) => {
    playClick();
    setLifeEvents(lifeEvents.filter((_, i) => i !== index));
  };

  // Personal Question Handlers
  const addQuestion = () => {
    playClick();
    setPersonalQuestions([
      ...personalQuestions,
      { questionText: '', correctAnswer: '', wrongAnswer1: '', wrongAnswer2: '', wrongAnswer3: '' }
    ]);
  };

  const updateQuestion = (index: number, field: keyof PersonalQuestion, value: string) => {
    const updated = [...personalQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setPersonalQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    playClick();
    setPersonalQuestions(personalQuestions.filter((_, i) => i !== index));
  };

  // Save full profile bundle
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!profile.fullName.trim()) {
      playNotice();
      setErrorMessage('Please enter the user’s full name in the Basic Information tab.');
      setActiveTab('personal');
      return;
    }

    // Filter out completely empty rows before saving
    const cleanedRelatives = relatives.filter(r => r.fullName.trim() || r.notes?.trim());
    const cleanedEvents = lifeEvents.filter(e => e.eventTitle.trim() || e.eventDescription?.trim());
    const cleanedQuestions = personalQuestions.filter(q => q.questionText.trim() && q.correctAnswer.trim());

    const bundle: GuardianProfileBundle = {
      profile: {
        ...profile,
        fullName: profile.fullName.trim(),
        nickname: profile.nickname?.trim(),
        placeOfBirth: profile.placeOfBirth?.trim(),
        currentCity: profile.currentCity?.trim(),
        notes: profile.notes?.trim(),
      },
      relatives: cleanedRelatives,
      lifeEvents: cleanedEvents,
      personalQuestions: cleanedQuestions,
    };

    setIsSaving(true);
    try {
      await ApiService.saveGuardianProfile(bundle);
      playSuccess();
      setSuccessMessage('Guardian profile saved successfully! Personalized daily questions are now ready.');

      // Smooth transition to dashboard after 1.2s
      setTimeout(() => {
        const user = ApiService.getCurrentUser();
        if (user?.role === 'PATIENT') {
          navigate('/player', { replace: true });
        } else {
          navigate('/caregiver/dashboard', { replace: true });
        }
      }, 1200);
    } catch (err: unknown) {
      playNotice();
      const msg = err instanceof Error ? err.message : 'Could not save profile. Please check the information and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b-2 border-stone-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/caregiver/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-stone-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black">
                <Heart className="w-4 h-4 text-emerald-100 fill-emerald-100" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-ink-950 tracking-tight">
                Guardian Profile Setup
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

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Intro Guidance Card */}
        <section className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-300/20 text-amber-200 border border-amber-300/30 font-mono">
                  Personalized Daily Recall
                </span>
                <span className="text-xs text-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Guardian Confidential
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Tell Us About Your Loved One
              </h1>
              <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
                The information you provide here powers the <strong>Daily Memory Game</strong>. Each day, the platform generates 5 personalized questions about family members, birthplaces, milestones, and treasured memories to gently stimulate episodic recall and reinforce familiarity.
              </p>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-950 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-950 text-sm flex items-start gap-3 shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b-2 border-stone-300 pb-2">
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab('personal'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Basic Information</span>
            {profile.fullName && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
          </button>

          <button
            type="button"
            onClick={() => { playClick(); setActiveTab('relatives'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'relatives'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Family & Relatives</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
              {relatives.filter(r => r.fullName.trim()).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { playClick(); setActiveTab('events'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Life Milestones</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
              {lifeEvents.filter(e => e.eventTitle.trim()).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { playClick(); setActiveTab('questions'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>4. Custom Memory Questions</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
              {personalQuestions.filter(q => q.questionText.trim()).length}
            </span>
          </button>
        </div>

        {/* Tab 1: Basic Information */}
        {activeTab === 'personal' && (
          <section className="bg-white rounded-2xl border-2 border-stone-300 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-lg font-extrabold text-ink-950 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-800" />
                Basic Personal Information
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Enter primary identity details. Questions like &ldquo;What year were you born?&rdquo; or &ldquo;Where were you born?&rdquo; are generated from this section.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Mary Vance"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Nickname or Preferred Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ellie"
                  value={profile.nickname || ''}
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profile.dateOfBirth || ''}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Place of Birth (City / Region)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boston, MA"
                  value={profile.placeOfBirth || ''}
                  onChange={(e) => setProfile({ ...profile, placeOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Current Hometown / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Portland, OR"
                  value={profile.currentCity || ''}
                  onChange={(e) => setProfile({ ...profile, currentCity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                  Preferred Language
                </label>
                <select
                  value={profile.preferredLanguage || 'English'}
                  onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs"
                >
                  <option value="English">English</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1.5">
                Caregiver Notes / Important Background Details
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Eleanor worked as an elementary school teacher for 32 years. Loves gardening and classical piano."
                value={profile.notes || ''}
                onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 text-ink-950 text-sm font-medium focus:outline-none focus:border-emerald-700 focus:bg-white shadow-2xs resize-y"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('relatives'); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
              >
                <span>Next: Family Members & Relatives &rarr;</span>
              </button>
            </div>
          </section>
        )}

        {/* Tab 2: Family & Relatives */}
        {activeTab === 'relatives' && (
          <section className="bg-white rounded-2xl border-2 border-stone-300 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-ink-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-800" />
                  Family Members & Relatives
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Add children, spouse, siblings, grandchildren, or close friends. Generates relationship & name recall questions.
                </p>
              </div>
              <button
                type="button"
                onClick={addRelative}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4 text-emerald-800" />
                <span>Add Another Relative</span>
              </button>
            </div>

            <div className="space-y-4">
              {relatives.length === 0 && (
                <div className="text-center py-8 text-stone-500 text-sm">
                  No relatives added yet. Click &ldquo;Add Another Relative&rdquo; above.
                </div>
              )}

              {relatives.map((rel, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border-2 border-stone-300 bg-stone-50/70 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                      Relative #{index + 1}
                    </span>
                    {relatives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRelative(index)}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-bold cursor-pointer"
                        title="Remove relative"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Thomas Vance"
                        value={rel.fullName}
                        onChange={(e) => updateRelative(index, 'fullName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                        Relationship to User
                      </label>
                      <select
                        value={rel.relationship}
                        onChange={(e) => updateRelative(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      >
                        <option value="Spouse">Spouse / Partner</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Son">Son</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Sister">Sister</option>
                        <option value="Brother">Brother</option>
                        <option value="Grandchild">Granddaughter / Grandson</option>
                        <option value="Close Friend">Close Friend</option>
                        <option value="Caregiver">Caregiver / Nurse</option>
                        <option value="Other Relative">Other Relative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                        Date of Birth / Birthday
                      </label>
                      <input
                        type="date"
                        value={rel.dateOfBirth || ''}
                        onChange={(e) => updateRelative(index, 'dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Important Details or Shared Memories
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eldest daughter, lives in Seattle, visits every Sunday with homemade berry pies."
                      value={rel.notes || ''}
                      onChange={(e) => updateRelative(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-ink-950 text-sm focus:outline-none focus:border-emerald-700 shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('personal'); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-stone-300 bg-white text-stone-700 font-bold text-sm hover:bg-stone-100 transition-colors"
              >
                &larr; Basic Information
              </button>
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('events'); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <span>Next: Life Milestones &rarr;</span>
              </button>
            </div>
          </section>
        )}

        {/* Tab 3: Life Milestones */}
        {activeTab === 'events' && (
          <section className="bg-white rounded-2xl border-2 border-stone-300 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-ink-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-800" />
                  Important Life Events & Milestones
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Add milestones like weddings, graduations, relocations, anniversaries, or career achievements.
                </p>
              </div>
              <button
                type="button"
                onClick={addLifeEvent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4 text-emerald-800" />
                <span>Add Life Event</span>
              </button>
            </div>

            <div className="space-y-4">
              {lifeEvents.length === 0 && (
                <div className="text-center py-8 text-stone-500 text-sm">
                  No life events added yet. Click &ldquo;Add Life Event&rdquo; above.
                </div>
              )}

              {lifeEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border-2 border-stone-300 bg-stone-50/70 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                      Event #{index + 1}
                    </span>
                    {lifeEvents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLifeEvent(index)}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-bold cursor-pointer"
                        title="Remove event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                        Event Title / Milestone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding Anniversary, Graduated from Harvard, Moved to Cape Cod"
                        value={event.eventTitle}
                        onChange={(e) => updateLifeEvent(index, 'eventTitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                        Year (Approximate)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1974"
                        value={event.eventYear || ''}
                        onChange={(e) => updateLifeEvent(index, 'eventYear', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Notes or Emotional Importance
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Married at St. Mary's church on a sunny June afternoon. Had lilac flowers in her bouquet."
                      value={event.eventDescription || ''}
                      onChange={(e) => updateLifeEvent(index, 'eventDescription', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-ink-950 text-sm focus:outline-none focus:border-emerald-700 shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('relatives'); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-stone-300 bg-white text-stone-700 font-bold text-sm hover:bg-stone-100 transition-colors"
              >
                &larr; Family Members
              </button>
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('questions'); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <span>Next: Custom Questions &rarr;</span>
              </button>
            </div>
          </section>
        )}

        {/* Tab 4: Custom Personal Questions */}
        {activeTab === 'questions' && (
          <section className="bg-white rounded-2xl border-2 border-stone-300 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-ink-950 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-800" />
                  Custom Personal Questions (MCQs)
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Create specific multiple-choice questions with 1 correct answer and 3 alternate options.
                </p>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-emerald-800 bg-emerald-50 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4 text-emerald-800" />
                <span>Add Personal Question</span>
              </button>
            </div>

            <div className="space-y-6">
              {personalQuestions.length === 0 && (
                <div className="text-center py-8 text-stone-500 text-sm">
                  No custom questions added yet. Click &ldquo;Add Personal Question&rdquo; above.
                </div>
              )}

              {personalQuestions.map((q, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border-2 border-stone-300 bg-stone-50/70 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                      Question #{index + 1}
                    </span>
                    {personalQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-bold cursor-pointer"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-950 uppercase tracking-wider mb-1">
                      Question Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. What was the name of your first childhood golden retriever?"
                      value={q.questionText}
                      onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-ink-950 text-sm font-semibold focus:outline-none focus:border-emerald-700 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border-2 border-emerald-300">
                      <label className="block text-xs font-black text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rusty"
                        value={q.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-emerald-400 bg-white text-ink-950 text-sm font-bold focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-300 space-y-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Incorrect Alternate Choices (Distractors)
                      </label>
                      <input
                        type="text"
                        placeholder="Option 2 (e.g. Shadow)"
                        value={q.wrongAnswer1}
                        onChange={(e) => updateQuestion(index, 'wrongAnswer1', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-ink-950 text-xs font-medium focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                      <input
                        type="text"
                        placeholder="Option 3 (e.g. Bella)"
                        value={q.wrongAnswer2}
                        onChange={(e) => updateQuestion(index, 'wrongAnswer2', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-ink-950 text-xs font-medium focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                      <input
                        type="text"
                        placeholder="Option 4 (e.g. Charlie)"
                        value={q.wrongAnswer3}
                        onChange={(e) => updateQuestion(index, 'wrongAnswer3', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-ink-950 text-xs font-medium focus:outline-none focus:border-emerald-700 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => { playClick(); setActiveTab('events'); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-stone-300 bg-white text-stone-700 font-bold text-sm hover:bg-stone-100 transition-colors"
              >
                &larr; Life Milestones
              </button>
            </div>
          </section>
        )}

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-4 z-10 bg-white rounded-2xl border-2 border-stone-400 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Info className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>
              All information is kept securely in your database and used only for daily memory games.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/caregiver/dashboard"
              className="px-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors"
            >
              Skip / Cancel
            </Link>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Guardian Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuardianProfileSetupPage;
