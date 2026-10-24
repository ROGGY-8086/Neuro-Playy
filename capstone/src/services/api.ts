/**
 * Neuro Playy API Service Layer
 * 
 * Connected to Spring Boot REST backend at http://localhost:8080/api
 * with resilient offline fallback to local state if the server is starting up.
 */

import {
  TelemetryState,
  CognitivePillar,
  RadarAgent,
  SimulatorStage,
  CohortTestimonial,
  UserSettings,
  UserProfile,
  Relative,
  LifeEvent,
  PersonalQuestion,
  GuardianProfileBundle,
  GuardianProfileStatus,
  DailyGameSession,
  DailyGameStatus,
  DailyGameResult,
  DailyScoreHistory,
  MemoryGameQuestion,
  MemoryGameConfig,
} from '../types';
import {
  initialTelemetry,
  cognitivePillars,
  initialRadarAgents,
  simulatorStages,
  cohortTestimonials,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'CAREGIVER' | 'ADMIN' | 'PATIENT';
  playerProfileId?: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'capstone_jwt_token',
  AUTH_USER: 'capstone_user_v1',
  TELEMETRY: 'capstone_telemetry_v1',
  SETTINGS: 'capstone_settings_v1',
  AGENTS: 'capstone_agents_v1',
  SESSION_HISTORY: 'capstone_sessions_v1',
};

// Helper for HTTP requests with optional auth headers
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      // Non-JSON response
    }
    throw new Error(errorJson?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const ApiService = {
  // Silent background health ping to wake up cold Render instances
  warmUpBackend() {
    try {
      fetch(`${BASE_URL}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
    } catch {
      // ignore
    }
  },

  // Token management
  setAuthToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  clearAuthToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  setCurrentUser(user: AuthUser) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  },

  getUserRole(): 'CAREGIVER' | 'PATIENT' | 'ADMIN' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  },

  // Telemetry & Metrics
  async getTelemetry(): Promise<TelemetryState> {
    try {
      const data = await request<TelemetryState>('/telemetry');
      localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('Backend /telemetry offline, using local cache:', err);
      const stored = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return initialTelemetry;
    }
  },

  async updateTelemetry(updates: Partial<TelemetryState>): Promise<TelemetryState> {
    try {
      const updated = await request<TelemetryState>('/telemetry', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(updated));
      return updated;
    } catch {
      const current = await this.getTelemetry();
      const next = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(next));
      return next;
    }
  },

  // Cognitive Pillars
  async getPillars(): Promise<CognitivePillar[]> {
    try {
      return await request<CognitivePillar[]>('/pillars');
    } catch {
      return cognitivePillars;
    }
  },

  // Tactical Radar Agents
  async getRadarAgents(): Promise<RadarAgent[]> {
    try {
      const data = await request<RadarAgent[]>('/radar/agents');
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(data));
      return data;
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return initialRadarAgents;
    }
  },

  async neutraliseAgent(agentId: number): Promise<{ success: boolean; bonusPoints: number }> {
    try {
      const res = await request<{ success: boolean; bonusPoints: number }>(`/radar/neutralise/${agentId}`, {
        method: 'POST',
      });
      return res;
    } catch {
      const agents = await this.getRadarAgents();
      const updated = agents.map((a) =>
        a.id === agentId ? { ...a, status: 'countered' as const, speech: 'Countermeasure Active! [STABILIZED]' } : a
      );
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updated));
      return { success: true, bonusPoints: 350 };
    }
  },

  async resetRadarAgents(): Promise<RadarAgent[]> {
    try {
      const data = await request<RadarAgent[]>('/radar/reset', { method: 'POST' });
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(data));
      return data;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AGENTS);
      return initialRadarAgents;
    }
  },

  // Simulator Stages
  async getSimulatorStages(): Promise<SimulatorStage[]> {
    try {
      return await request<SimulatorStage[]>('/simulator/stages');
    } catch {
      return simulatorStages;
    }
  },

  // Testimonials
  async getCohortTestimonials(): Promise<CohortTestimonial[]> {
    try {
      return await request<CohortTestimonial[]>('/testimonials');
    } catch {
      return cohortTestimonials;
    }
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await request<UserSettings>('/settings');
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
      return data;
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return {
        soundEnabled: true,
        reducedMotion: false,
        highContrast: false,
        preferredLanguage: 'EN',
        drillDifficulty: 'Standard',
      };
    }
  },

  async saveSettings(settings: UserSettings): Promise<UserSettings> {
    try {
      const data = await request<UserSettings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
      return data;
    } catch {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return settings;
    }
  },

  // Drill Session Record (Spring Boot endpoint POST /api/games/sessions)
  async recordDrillSession(session: {
    pillarId: string;
    score: number;
    accuracy: number;
    durationSeconds: number;
    completed: boolean;
  }): Promise<{ sessionId: string; status: string }> {
    try {
      const res = await request<{ id: number; sessionId: string; status: string }>('/games/sessions', {
        method: 'POST',
        body: JSON.stringify({
          pillarId: session.pillarId,
          score: session.score,
          accuracy: session.accuracy,
          durationSeconds: session.durationSeconds,
          completed: session.completed,
        }),
      });
      return { sessionId: res.sessionId || res.id?.toString(), status: 'synced_to_platform' };
    } catch (err) {
      console.warn('Backend session logging fallback to localStorage:', err);
      const id = 'sess_' + Math.random().toString(36).substring(2, 9);
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY) || '[]');
      history.unshift({ ...session, id, timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history.slice(0, 50)));
      return { sessionId: id, status: 'synced_to_local_store' };
    }
  },

  // Caregiver Authentication APIs
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const trimmedId = identifier.trim();
    const data = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: trimmedId,
        usernameOrEmail: trimmedId,
        password,
      }),
    });
    this.setAuthToken(data.token);
    this.setCurrentUser(data.user);
    return data;
  },

  async register(username: string, email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.registerCaregiver({
      name: name || username,
      username,
      email,
      password,
      patientName: `${name || username}'s Loved One`,
      patientLanguage: 'en',
      consentAuthorized: true,
    });
  },

  async registerCaregiver(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    patientName: string;
    patientLanguage?: string;
    consentAuthorized: boolean;
  }): Promise<AuthResponse> {
    const trimmedUsername = data.username.trim();
    const normalizedEmail = data.email.trim().toLowerCase();
    const displayName = data.name.trim() || trimmedUsername;
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: displayName,
        username: trimmedUsername,
        email: normalizedEmail,
        password: data.password,
        patientName: data.patientName.trim(),
        patientLanguage: data.patientLanguage || 'en',
        consentAuthorized: data.consentAuthorized,
      }),
    });
    this.setAuthToken(res.token);
    this.setCurrentUser(res.user);
    return res;
  },

  async registerPatient(data: {
    name: string;
    username: string;
    email?: string;
    password: string;
    linkCode: string;
  }): Promise<AuthResponse> {
    const trimmedUsername = data.username.trim();
    const normalizedEmail = data.email && data.email.trim() ? data.email.trim().toLowerCase() : undefined;
    const res = await request<AuthResponse>('/auth/patient/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name.trim(),
        username: trimmedUsername,
        email: normalizedEmail,
        password: data.password,
        linkCode: data.linkCode.trim().toUpperCase(),
      }),
    });
    this.setAuthToken(res.token);
    this.setCurrentUser(res.user);
    return res;
  },

  // Link Codes & Patient Account Management
  async generateLinkCode(profileId: number) {
    return request<{ code: string; expiresAt: string; profileId: number }>(`/profiles/${profileId}/link-codes`, {
      method: 'POST',
    });
  },

  async getPatientLoginInfo(profileId: number) {
    return request<{
      hasLogin: boolean;
      username?: string;
      name?: string;
      enabled?: boolean;
      createdAt?: string;
      activeCode?: string;
      codeExpiresAt?: string;
    }>(`/profiles/${profileId}/patient-login`);
  },

  async resetPatientPassword(profileId: number, newPassword: string) {
    return request<{ message: string }>(`/profiles/${profileId}/patient-login/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },

  async updatePatientStatus(profileId: number, enabled: boolean) {
    return request<{ enabled: boolean; message: string }>(`/profiles/${profileId}/patient-login/enabled`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  },

  async updateProfile(profileId: number, updates: any) {
    return request<any>(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Backend logout notification skipped or offline:', err);
    } finally {
      this.clearAuthToken();
    }
  },

  // Profiles & Adaptive Difficulty
  async getProfiles() {
    return request<Array<{
      id: number;
      preferredName: string;
      language: string;
      textSize: string;
      audioEnabled: boolean;
      difficultyMode: string;
      manualDifficulty?: string;
      supportNotes?: string;
    }>>('/profiles');
  },

  async getDifficultySuggestion(profileId: number) {
    return request<{
      currentLevel: string;
      suggestedLevel: string;
      reason: string;
      basedOnSessions: number;
    }>(`/profiles/${profileId}/difficulty-suggestion`);
  },

  async getProfileSummary(profileId: number) {
    return request<{
      profileId: number;
      preferredName: string;
      totalSessions: number;
      completedSessions: number;
      lastActiveAt?: string;
      totalReminders: number;
      activeReminders: number;
      totalMemories: number;
      recentSessions: Array<{
        id: number;
        gameKey: string;
        startedAt: string;
        endedAt?: string;
        difficulty: string;
        completed: boolean;
      }>;
    }>(`/profiles/${profileId}/summary`);
  },

  async getReminders(profileId: number) {
    return request<Array<{
      id: number;
      title: string;
      type: string;
      scheduledAt: string;
      recurrence: string;
      enabled: boolean;
      status: string;
    }>>(`/profiles/${profileId}/reminders`);
  },

  async createReminder(profileId: number, reminder: {
    title: string;
    type: string;
    scheduledAt: string;
    recurrence: string;
  }) {
    return request<any>(`/profiles/${profileId}/reminders`, {
      method: 'POST',
      body: JSON.stringify(reminder),
    });
  },

  async getMemories(profileId: number) {
    return request<Array<{
      id: number;
      type: string;
      title: string;
      description: string;
      mediaUrl?: string;
      transcript?: string;
      sortOrder: number;
    }>>(`/profiles/${profileId}/memories`);
  },

  async getObservations(profileId: number) {
    return request<Array<{
      id: number;
      sessionId?: number;
      moodNote?: string;
      assistanceNote?: string;
      createdAt: string;
    }>>(`/profiles/${profileId}/observations`);
  },

  // Guardian Profile API
  async getGuardianProfile(): Promise<GuardianProfileBundle> {
    return request<GuardianProfileBundle>('/guardian-profile');
  },

  async saveGuardianProfile(bundle: GuardianProfileBundle): Promise<GuardianProfileBundle> {
    return request<GuardianProfileBundle>('/guardian-profile', {
      method: 'PUT',
      body: JSON.stringify(bundle),
    });
  },

  async getGuardianProfileStatus(): Promise<GuardianProfileStatus> {
    return request<GuardianProfileStatus>('/guardian-profile/status');
  },

  // Daily Memory Game API
  async getDailyGameStatus(): Promise<DailyGameStatus> {
    return request<DailyGameStatus>('/daily-game/status');
  },

  async startDailyGame(): Promise<DailyGameSession> {
    return request<DailyGameSession>('/daily-game/start', {
      method: 'POST',
    });
  },

  async submitDailyGameAnswer(questionIndex: number, selectedOption: string): Promise<DailyGameSession> {
    return request<DailyGameSession>('/daily-game/answer', {
      method: 'POST',
      body: JSON.stringify({ questionIndex, selectedOption }),
    });
  },

  async completeDailyGame(): Promise<DailyGameResult> {
    return request<DailyGameResult>('/daily-game/complete', {
      method: 'POST',
    });
  },

  async getDailyScoreHistory(): Promise<DailyScoreHistory> {
    return request<DailyScoreHistory>('/daily-game/scores');
  },

  // Memory Game Configuration API (Caregiver Managed)
  async getMemoryGameConfig(profileId?: number | null): Promise<MemoryGameConfig> {
    const url = profileId && profileId > 0 ? `/profiles/${profileId}/memory-game-config` : '/memory-game-config';
    return request<MemoryGameConfig>(url);
  },

  async saveMemoryGameConfig(profileId: number | null | undefined, questions: MemoryGameQuestion[]): Promise<MemoryGameConfig> {
    const url = profileId && profileId > 0 ? `/profiles/${profileId}/memory-game-config` : '/memory-game-config';
    return request<MemoryGameConfig>(url, {
      method: 'PUT',
      body: JSON.stringify(questions),
    });
  },
};
