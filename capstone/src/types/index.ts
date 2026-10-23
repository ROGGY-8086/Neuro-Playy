export interface TelemetryState {
  recallBalance: number; // e.g. 9.16B represented as float
  perSecondGain: number; // e.g. 214.1M
  velocity: string;
  errorDriftIndex: string;
  dailyFocusFee: number;
  focusTax: number;
  dailyModelRamp: number;
  xpPerMin: number;
  streak: number;
  driftReduction: number;
  ratValue: number;
  nodeId: string;
  protocolStatus: string;
  isEscalating: boolean;
}

export type PillarDrillType = 'dual-n-back' | 'inhibitory' | 'facial-associator' | 'synaptic-velocity';

export interface CognitivePillar {
  id: string;
  number: string;
  title: string;
  iconName: 'target' | 'lightbulb' | 'badge' | 'zap';
  description: string;
  metricLabel: string;
  metricValue: string;
  metricType: 'recall' | 'distraction' | 'retention' | 'velocity';
  accentColor: string;
  drillType: PillarDrillType;
}

export interface RadarAgent {
  id: number;
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  status: 'active' | 'countered' | 'threat';
  speech: string;
  decayTime: number;
}

export interface SimulatorStage {
  step: number;
  maxSteps: number;
  title: string;
  instruction: string;
  targetCount: number;
  completed: boolean;
}

export interface CohortTestimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
  streakDays: number;
  scorePts: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  preferredLanguage: 'EN' | 'MR' | 'HI';
  drillDifficulty: 'Adaptive' | 'Standard' | 'Isometric Hard';
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  type?: 'success' | 'info' | 'warning';
}

// ================= Guardian Profile & Daily Memory Game Types =================

export interface UserProfile {
  id?: number;
  userId?: number;
  fullName: string;
  nickname?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  currentCity?: string;
  preferredLanguage?: string;
  notes?: string;
}

export interface Relative {
  id?: number;
  fullName: string;
  relationship: string;
  dateOfBirth?: string;
  notes?: string;
}

export interface LifeEvent {
  id?: number;
  eventTitle: string;
  eventYear?: number | null;
  eventDescription?: string;
}

export interface PersonalQuestion {
  id?: number;
  questionText: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
}

export interface GuardianProfileBundle {
  profile: UserProfile;
  relatives: Relative[];
  lifeEvents: LifeEvent[];
  personalQuestions: PersonalQuestion[];
}

export interface GuardianProfileStatus {
  profileComplete: boolean;
  hasBasicInfo: boolean;
  relativeCount: number;
  lifeEventCount: number;
  questionCount: number;
  missingRequirements?: string[];
}

export interface ClientQuestion {
  id: number;
  questionText: string;
  category: string;
  options: string[];
  userAnswer?: string | null;
}

export interface DailyGameSession {
  id: number;
  gameDate: string;
  completed: boolean;
  totalQuestions: number;
  answeredCount: number;
  currentScore?: number | null;
  questions: ClientQuestion[];
}

export interface DailyGameStatus {
  hasPlayedToday: boolean;
  todayScore?: number | null;
  gameDate: string;
  canPlay: boolean;
  activeSession?: DailyGameSession | null;
}

export interface DailyGameAnswerRequest {
  questionIndex: number;
  selectedOption: string;
}

export interface DailyGameResult {
  id: number;
  score: number;
  gameDate: string;
  totalQuestions: number;
  percentage: number;
  message: string;
}

export interface DailyScoreEntry {
  id: number;
  score: number;
  gameDate: string;
}

export interface DailyScoreHistory {
  scores: DailyScoreEntry[];
  totalGamesPlayed: number;
  averageScore: number;
  bestScore: number;
}

