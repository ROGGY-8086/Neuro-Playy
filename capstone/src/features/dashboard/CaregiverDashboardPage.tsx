import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  LogOut,
  Calendar,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  ArrowLeft,
  UserCheck,
  Activity,
  Smile,
  Gamepad2,
  BookOpen,
  Award,
  HelpCircle,
  Edit3,
  BarChart2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ApiService, AuthUser } from '../../services/api';
import { DailyGameStatus, DailyScoreHistory, GuardianProfileStatus } from '../../types';
import { useSound } from '../../hooks/useSound';
import { translations, SupportedLanguage } from '../../i18n/translations';

interface ManagedProfile {
  id: number;
  preferredName: string;
  language: string;
  textSize: string;
  audioEnabled: boolean;
  difficultyMode: string;
  manualDifficulty?: string;
  supportNotes?: string;
}

interface DifficultySuggestion {
  currentLevel: string;
  suggestedLevel: string;
  reason: string;
  basedOnSessions: number;
}

interface ReminderItem {
  id: number;
  title: string;
  type: string;
  scheduledAt: string;
  recurrence: string;
  enabled: boolean;
  status: string;
}

interface MemoryItem {
  id: number;
  type: string;
  title: string;
  description: string;
  mediaUrl?: string;
  transcript?: string;
  sortOrder: number;
}

interface SessionRecord {
  id: number;
  gameKey: string;
  startedAt: string;
  difficulty: string;
  completed: boolean;
}

interface ObservationRecord {
  id: number;
  moodNote?: string;
  assistanceNote?: string;
  createdAt: string;
}

export const CaregiverDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, playSuccess, playNotice } = useSound(true);

  const [lang, setLang] = useState<SupportedLanguage>('EN');
  const t = translations[lang];

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [profiles, setProfiles] = useState<ManagedProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const [suggestion, setSuggestion] = useState<DifficultySuggestion | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [observations, setObservations] = useState<ObservationRecord[]>([]);

  // Patient Login Management State
  const [patientLoginInfo, setPatientLoginInfo] = useState<{
    hasLogin: boolean;
    username?: string;
    name?: string;
    enabled?: boolean;
    createdAt?: string;
    activeCode?: string;
    codeExpiresAt?: string;
  } | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [newPatientPassword, setNewPatientPassword] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderType, setNewReminderType] = useState('HYDRATION');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);

  // Daily Memory Game & Guardian Profile State
  const [dailyGameStatus, setDailyGameStatus] = useState<DailyGameStatus | null>(null);
  const [dailyScoreHistory, setDailyScoreHistory] = useState<DailyScoreHistory | null>(null);
  const [guardianProfileStatus, setGuardianProfileStatus] = useState<GuardianProfileStatus | null>(null);
  const [isLoadingDailyGame, setIsLoadingDailyGame] = useState(true);

  // Load user and profiles
  useEffect(() => {
    const user = ApiService.getCurrentUser();
    setCurrentUser(user);

    async function loadInitialData() {
      try {
        const [fetchedProfiles, gameStatus, scoreHistory, profileStatus] = await Promise.allSettled([
          ApiService.getProfiles(),
          ApiService.getDailyGameStatus(),
          ApiService.getDailyScoreHistory(),
          ApiService.getGuardianProfileStatus(),
        ]);

        if (fetchedProfiles.status === 'fulfilled') {
          setProfiles(fetchedProfiles.value);
          if (fetchedProfiles.value.length > 0) {
            setSelectedProfileId(fetchedProfiles.value[0].id);
          }
        }
        if (gameStatus.status === 'fulfilled') {
          setDailyGameStatus(gameStatus.value);
        }
        if (scoreHistory.status === 'fulfilled') {
          setDailyScoreHistory(scoreHistory.value);
        }
        if (profileStatus.status === 'fulfilled') {
          setGuardianProfileStatus(profileStatus.value);
        }
      } catch (err) {
        console.warn('Could not load caregiver profiles or daily game data:', err);
      } finally {
        setIsLoading(false);
        setIsLoadingDailyGame(false);
      }
    }
    loadInitialData();
  }, []);

  // When selectedProfileId changes, load profile details
  useEffect(() => {
    if (!selectedProfileId) return;

    async function loadProfileDetails(id: number) {
      try {
        const [sug, rem, mem, obs, summary, loginInfo] = await Promise.allSettled([
          ApiService.getDifficultySuggestion(id),
          ApiService.getReminders(id),
          ApiService.getMemories(id),
          ApiService.getObservations(id),
          ApiService.getProfileSummary(id),
          ApiService.getPatientLoginInfo(id),
        ]);

        if (sug.status === 'fulfilled') setSuggestion(sug.value);
        if (rem.status === 'fulfilled') setReminders(rem.value);
        if (mem.status === 'fulfilled') setMemories(mem.value);
        if (obs.status === 'fulfilled') setObservations(obs.value);
        if (summary.status === 'fulfilled' && summary.value?.recentSessions) {
          setSessions(summary.value.recentSessions);
        }
        if (loginInfo.status === 'fulfilled') {
          setPatientLoginInfo(loginInfo.value);
        }
      } catch (err) {
        console.warn('Error loading profile sub-resources:', err);
      }
    }

    loadProfileDetails(selectedProfileId);
  }, [selectedProfileId]);

  const handleLogout = async () => {
    playNotice();
    await ApiService.logout();
    navigate('/login', { replace: true });
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId || !newReminderTitle.trim()) return;

    setIsSubmittingReminder(true);
    try {
      const scheduled = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const created = await ApiService.createReminder(selectedProfileId, {
        title: newReminderTitle.trim(),
        type: newReminderType,
        scheduledAt: scheduled,
        recurrence: 'DAILY',
      });
      playSuccess();
      setReminders((prev) => [created, ...prev]);
      setNewReminderTitle('');
      setShowAddReminder(false);
    } catch {
      playNotice();
    } finally {
      setIsSubmittingReminder(false);
    }
  };

  const handleGenerateLinkCode = async () => {
    if (!selectedProfileId) return;
    setIsGeneratingCode(true);
    try {
      const res = await ApiService.generateLinkCode(selectedProfileId);
      playSuccess();
      setPatientLoginInfo((prev) => ({
        hasLogin: false,
        activeCode: res.code,
        codeExpiresAt: res.expiresAt,
        ...prev,
      }));
    } catch (err) {
      console.warn('Could not generate link code:', err);
      playNotice();
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleResetPatientPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId || !newPatientPassword.trim()) return;
    try {
      await ApiService.resetPatientPassword(selectedProfileId, newPatientPassword.trim());
      playSuccess();
      setShowResetPasswordModal(false);
      setNewPatientPassword('');
    } catch (err) {
      console.warn('Could not reset patient password:', err);
      playNotice();
    }
  };

  const handleTogglePatientEnabled = async (enabled: boolean) => {
    if (!selectedProfileId) return;
    try {
      await ApiService.updatePatientStatus(selectedProfileId, enabled);
      playSuccess();
      setPatientLoginInfo((prev) => prev ? { ...prev, enabled } : null);
    } catch (err) {
      console.warn('Could not update patient status:', err);
      playNotice();
    }
  };

  const activeProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-ink-950 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-stone-200 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Brand & Return Link */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-emerald-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg px-2 py-1 transition-colors"
              title="Return to Player Interactive View"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
              <span className="hidden sm:inline">Player View</span>
            </Link>

            <div className="h-4 w-px bg-stone-300 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-base md:text-lg tracking-tight text-ink-950">
                Caregiver Hub
              </span>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/60">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.caregiverBadge}</span>
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div
              className="hidden md:inline-flex rounded-lg border border-stone-300 bg-stone-50 p-0.5 text-xs font-semibold shadow-2xs"
              role="group"
              aria-label="Language selection"
            >
              {(['EN', 'MR', 'HI'] as SupportedLanguage[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    lang === code
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-200'
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
              className="p-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
              title={soundEnabled ? t.soundOn : t.soundOff}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Caregiver Profile Name & Sign Out */}
            <div className="flex items-center gap-2 pl-1 border-l border-stone-300">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-ink-950 leading-tight">
                  {currentUser?.name || 'Authorized Caregiver'}
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  @{currentUser?.username || 'caregiver'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs shadow-2xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                title="Sign out of Caregiver Hub"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.logoutButton}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Hub Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950">
              {t.dashboardTitle}
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              {t.dashboardSubtitle}
            </p>
          </div>

          {/* Profile Selector if multiple */}
          {profiles.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="profile-select" className="text-xs font-bold text-stone-600">
                Active Profile:
              </label>
              <select
                id="profile-select"
                value={selectedProfileId || ''}
                onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border-2 border-stone-300 bg-white text-xs font-bold text-ink-950 focus:outline-none focus:border-emerald-700 shadow-2xs"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.preferredName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Top Grid: Loved One's Profile Card & Supportive Difficulty Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t.managedProfile}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 border border-stone-300 text-stone-800">
                  {activeProfile?.difficultyMode === 'AUTO' ? 'Adaptive Rhythm' : 'Manual Rhythm'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900 flex items-center justify-center font-extrabold text-xl shadow-2xs">
                  {activeProfile?.preferredName?.[0] || 'E'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-ink-950">
                    {activeProfile?.preferredName || 'Eleanor Vance'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Language: <span className="font-semibold text-stone-700">{activeProfile?.language?.toUpperCase() || 'EN'}</span> &bull; Text: <span className="font-semibold text-stone-700">{activeProfile?.textSize || 'LARGE'}</span>
                  </p>
                </div>
              </div>

              {activeProfile?.supportNotes && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed mb-4">
                  <span className="font-bold text-stone-900 block mb-0.5">Caregiver Notes:</span>
                  {activeProfile.supportNotes}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Audio Prompts: {activeProfile?.audioEnabled ? 'Active' : 'Muted'}
              </span>
              <span className="font-mono text-[11px] text-stone-500">
                ID: #{activeProfile?.id || 1}
              </span>
            </div>
          </div>

          {/* Supportive Difficulty Recommendation Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                    {t.adaptiveRecommendation}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800 text-emerald-100 border border-emerald-700">
                  {suggestion?.basedOnSessions || 0} recent sessions observed
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                Recommended Rhythm:{' '}
                <span className="text-amber-300 font-black">
                  {suggestion?.suggestedLevel || 'Standard'}
                </span>
              </h2>

              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                {suggestion?.reason ||
                  'Recent sessions indicate comfortable engagement with familiar cues. A gentle, supportive pace is recommended to maintain confidence and joy.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200 font-mono">
              <div>
                Current Mode: <span className="font-bold text-white">{suggestion?.currentLevel || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-200 text-xs">
                <Activity className="w-4 h-4" />
                <span>Non-evaluative support pacing</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Personalized Daily Memory Game & Scores ================= */}
        <div className="space-y-6">
          {/* Daily Memory Game Banner Card */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-800" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                    Personalized Daily Exercise
                  </span>
                  {dailyGameStatus?.hasPlayedToday && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Completed Today
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-ink-950">
                    Daily Memory Game
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
                    Up to 5 personalized multiple-choice questions dynamically generated every morning from your guardian profile. Helps stimulate episodic recall and reinforce familiarity.
                  </p>
                </div>

                {/* Score or Play Action */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  {dailyGameStatus?.hasPlayedToday ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 text-emerald-950">
                      <Award className="w-5 h-5 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-xs text-stone-600 font-medium block">Today's Recorded Score:</span>
                        <span className="text-base font-black text-emerald-900">
                          {dailyGameStatus.todayScore} / 5 Correct
                        </span>
                      </div>
                      <span className="text-xs text-emerald-800 pl-2 border-l border-emerald-200">
                        Check back tomorrow for a new set of questions!
                      </span>
                    </div>
                  ) : (
                    <Link
                      to="/daily-game"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Play Today's Memory Game (5 Questions)</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Guardian Profile Quick Access Box */}
              <div className="lg:w-80 p-4 rounded-xl bg-stone-50 border-2 border-stone-200 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    Guardian Profile
                  </span>
                  {guardianProfileStatus?.profileComplete ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Incomplete
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Family & Relatives:</span>
                    <span className="font-bold text-stone-900">{guardianProfileStatus?.relativeCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Life Milestones:</span>
                    <span className="font-bold text-stone-900">{guardianProfileStatus?.lifeEventCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Questions:</span>
                    <span className="font-bold text-stone-900">{guardianProfileStatus?.questionCount || 0}</span>
                  </div>
                </div>

                <Link
                  to="/guardian/setup"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-xs font-bold text-stone-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Configure Guardian Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Historical Progress & Scores Card */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-ink-950">
                    Daily Score History & Historical Progress
                  </h3>
                  <p className="text-xs text-stone-500">
                    Calculated server-side from minimal date-and-score records.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 font-mono">
                Storage: <span className="text-emerald-800 font-bold">daily_scores</span> (Date + Score only)
              </div>
            </div>

            {/* Dynamic Derived Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Total Games Played
                </span>
                <span className="text-2xl font-black text-ink-950 mt-1">
                  {dailyScoreHistory?.totalGamesPlayed || 0}
                </span>
                <span className="text-[11px] text-stone-500 mt-1">Daily completions</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Average Score
                </span>
                <span className="text-2xl font-black text-emerald-800 mt-1">
                  {dailyScoreHistory && dailyScoreHistory.totalGamesPlayed > 0
                    ? dailyScoreHistory.averageScore.toFixed(1)
                    : '0.0'}{' '}
                  <span className="text-sm font-normal text-stone-500">/ 5</span>
                </span>
                <span className="text-[11px] text-stone-500 mt-1">
                  {dailyScoreHistory && dailyScoreHistory.totalGamesPlayed > 0
                    ? `${Math.round((dailyScoreHistory.averageScore / 5) * 100)}% average accuracy`
                    : 'No games yet'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Best Score
                </span>
                <span className="text-2xl font-black text-amber-800 mt-1">
                  {dailyScoreHistory?.bestScore || 0}{' '}
                  <span className="text-sm font-normal text-stone-500">/ 5</span>
                </span>
                <span className="text-[11px] text-stone-500 mt-1">Highest daily result</span>
              </div>
            </div>

            {/* Scores Table */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block mb-2">
                Recent Daily Games
              </span>

              {(!dailyScoreHistory?.scores || dailyScoreHistory.scores.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-stone-300 rounded-xl bg-stone-50 text-xs text-stone-500">
                  No games played yet. Click &ldquo;Play Today's Memory Game&rdquo; above to record your first daily score.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 uppercase font-mono tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Game Date</th>
                        <th className="px-4 py-2.5 font-bold">Score</th>
                        <th className="px-4 py-2.5 font-bold">Accuracy</th>
                        <th className="px-4 py-2.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {dailyScoreHistory.scores.map((entry) => {
                        const pct = Math.round((entry.score / 5) * 100);
                        return (
                          <tr key={entry.id} className="hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-ink-950 font-mono">
                              {entry.gameDate}
                            </td>
                            <td className="px-4 py-3 font-extrabold text-emerald-900">
                              {entry.score} / 5
                            </td>
                            <td className="px-4 py-3 text-stone-600">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-800 rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[11px]">{pct}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  entry.score >= 4
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : entry.score >= 2
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-stone-100 text-stone-700 border border-stone-300'
                                }`}
                              >
                                {entry.score >= 4 ? 'Excellent' : entry.score >= 2 ? 'Good Effort' : 'Completed'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Login & Access Card */}
        <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0">
                <Gamepad2 className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-ink-950">
                  {t.patientAccountSection}
                </h3>
                <p className="text-xs text-stone-500">
                  Set up or manage patient login credentials for {activeProfile?.preferredName || 'your loved one'}.
                </p>
              </div>
            </div>

            <div>
              {patientLoginInfo?.hasLogin ? (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  patientLoginInfo.enabled
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-stone-200 text-stone-700 border border-stone-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${patientLoginInfo.enabled ? 'bg-emerald-600 animate-pulse' : 'bg-stone-500'}`} />
                  {patientLoginInfo.enabled ? t.patientAccountActive : t.patientAccountPaused}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">
                  {t.patientAccountNone}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            {patientLoginInfo?.hasLogin ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-ink-950">
                    Patient Username: <code className="bg-white px-2 py-0.5 rounded border border-stone-300 font-mono text-emerald-900">@{patientLoginInfo.username}</code>
                  </p>
                  <p className="text-xs text-stone-600">
                    {t.patientAccountCreatedNotice}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-ink-900 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {t.resetPatientPasswordBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePatientEnabled(!patientLoginInfo.enabled)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      patientLoginInfo.enabled
                        ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    {patientLoginInfo.enabled ? t.pausePatientLoginBtn : t.resumePatientLoginBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div>
                  <p className="text-sm font-bold text-amber-950">
                    Allow {activeProfile?.preferredName || 'your loved one'} to sign in with their own password
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Generate a simple single-use 6-character code that they can enter at <code className="font-mono text-amber-900">/patient/signup</code>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateLinkCode}
                  disabled={isGeneratingCode}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {isGeneratingCode ? 'Generating...' : t.setupPatientLoginBtn}
                </button>
              </div>
            )}

            {!patientLoginInfo?.hasLogin && patientLoginInfo?.activeCode && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                    {t.linkCodeGeneratedTitle}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-mono font-black tracking-widest text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                      {patientLoginInfo.activeCode}
                    </span>
                    <span className="text-xs text-emerald-800">
                      (Valid for 24 hours &bull; Single-use)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900/80 mt-1.5">
                    {t.linkCodeInstructions}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(patientLoginInfo.activeCode || '');
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                >
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Grid: Reminders and Memories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheduled Reminders */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-lg font-extrabold text-ink-950">
                    {t.activeReminders}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Routine</span>
                </button>
              </div>

              {/* Quick Add Form */}
              {showAddReminder && (
                <form onSubmit={handleCreateReminder} className="mb-4 p-3.5 rounded-xl bg-stone-50 border border-stone-300 space-y-3">
                  <h4 className="text-xs font-bold text-ink-950">New Supportive Reminder</h4>
                  <div>
                    <input
                      type="text"
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      placeholder="e.g. Afternoon water & herbal tea"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-ink-950 placeholder-stone-400 font-medium focus:outline-none focus:border-emerald-700 bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newReminderType}
                      onChange={(e) => setNewReminderType(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-white"
                    >
                      <option value="HYDRATION">Hydration</option>
                      <option value="ACTIVITY">Activity & Walk</option>
                      <option value="MEAL">Meal & Snack</option>
                      <option value="APPOINTMENT">Social Routine</option>
                      <option value="OTHER">Other</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddReminder(false)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingReminder || !newReminderTitle.trim()}
                        className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 disabled:opacity-60"
                      >
                        {isSubmittingReminder ? 'Saving...' : 'Save Routine'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Reminders List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {reminders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">
                    No scheduled reminders yet. Add a supportive routine above.
                  </p>
                ) : (
                  reminders.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-ink-950">{r.title}</p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            Type: {r.type} &bull; {r.recurrence}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300/50">
                        {r.enabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Personalized Memories Catalog */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-lg font-extrabold text-ink-950">
                    {t.memoriesCatalog}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-stone-500">
                  {memories.length} item{memories.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {memories.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">
                    No memory items configured for this profile yet.
                  </p>
                ) : (
                  memories.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                        {m.type === 'PHOTO' ? (
                          <ImageIcon className="w-5 h-5 text-emerald-800" />
                        ) : m.type === 'AUDIO' ? (
                          <Volume2 className="w-5 h-5 text-emerald-800" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-emerald-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-ink-950 truncate">
                            {m.title}
                          </h4>
                          <span className="text-[10px] font-mono uppercase text-stone-400">
                            {m.type}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Engagement Records & Observations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Sessions */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-5 h-5 text-emerald-800" />
              <h3 className="text-lg font-extrabold text-ink-950">
                {t.recentSessions}
              </h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No recent engagement sessions recorded yet.
                </p>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-ink-950 capitalize">
                        {s.gameKey?.replace(/-/g, ' ') || 'Engagement Drill'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {s.startedAt ? new Date(s.startedAt).toLocaleDateString() : 'Recent'} &bull; Level: {s.difficulty}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/40">
                      {s.completed ? 'Completed' : 'Explored'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Observations and Mood Notes */}
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-emerald-800" />
              <h3 className="text-lg font-extrabold text-ink-950">
                Supportive Observations
              </h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {observations.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No caregiver observation notes recorded for this period.
                </p>
              ) : (
                observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs space-y-1"
                  >
                    {obs.moodNote && (
                      <p className="text-stone-800">
                        <strong className="text-ink-950">Mood Note:</strong> {obs.moodNote}
                      </p>
                    )}
                    {obs.assistanceNote && (
                      <p className="text-stone-600">
                        <strong>Assistance:</strong> {obs.assistanceNote}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-400 font-mono">
                      {new Date(obs.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reset Patient Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-extrabold text-ink-950 mb-1">
              {t.resetPatientPasswordBtn}
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Enter a new passphrase for patient account <code className="font-mono text-emerald-800">@{patientLoginInfo?.username}</code>. No complex rules required.
            </p>

            <form onSubmit={handleResetPatientPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-pass-input" className="block text-xs font-bold text-stone-700 mb-1">
                  New Password (max 128 chars)
                </label>
                <input
                  id="reset-pass-input"
                  type="password"
                  value={newPatientPassword}
                  onChange={(e) => setNewPatientPassword(e.target.value)}
                  placeholder="Enter new password"
                  maxLength={128}
                  required
                  className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 text-sm focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPatientPassword.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CaregiverDashboardPage;
