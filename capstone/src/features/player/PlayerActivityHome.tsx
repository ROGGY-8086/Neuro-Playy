import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderNavbar } from '../../components/common/HeaderNavbar';
import { HeroSection } from '../hero/HeroSection';
import { CognitivePillarsSection } from '../pillars/CognitivePillarsSection';
import { DrillSimulatorSection } from '../simulator/DrillSimulatorSection';
import { ObservedEffectsSection } from '../testimonials/ObservedEffectsSection';
import { BottomCTASection } from '../../components/common/BottomCTASection';
import { Footer } from '../../components/common/Footer';
import { ToastContainer } from '../../components/common/ToastContainer';

import { LabDrillModal } from '../drills/LabDrillModal';
import { TutorialModal } from '../modals/TutorialModal';
import { SettingsPreferencesModal } from '../modals/SettingsPreferencesModal';
import { ProtocolDrawerModal } from '../modals/ProtocolDrawerModal';
import { PrivacyProtocolModal } from '../modals/PrivacyProtocolModal';

import { TelemetryState, UserSettings, ToastMessage, PillarDrillType } from '../../types';
import { ApiService } from '../../services/api';
import { soundFx } from '../../utils/audio';
import { useSpacebarInteraction } from '../../hooks/useSpacebarInteraction';

export function PlayerActivityHome() {
  const navigate = useNavigate();
  const currentUser = ApiService.getCurrentUser();
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    recallBalance: 9.16,
    perSecondGain: 214.1,
    velocity: '154.3M/SEC',
    errorDriftIndex: '0.384 [-1.2%]',
    dailyFocusFee: 124,
    focusTax: 15,
    dailyModelRamp: 85,
    xpPerMin: 3450,
    streak: 7.2,
    driftReduction: 78,
    ratValue: 21.43,
    nodeId: '08/A',
    protocolStatus: 'EXTENDED DRILL V2.3',
    isEscalating: true,
  });

  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: true,
    reducedMotion: false,
    highContrast: false,
    preferredLanguage: 'EN',
    drillDifficulty: 'Standard',
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal visibility states
  const [drillModalOpen, setDrillModalOpen] = useState(false);
  const [selectedDrillType, setSelectedDrillType] = useState<PillarDrillType>('inhibitory');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [protocolDrawerOpen, setProtocolDrawerOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);

  // Initialize data from API service
  useEffect(() => {
    ApiService.getTelemetry().then(setTelemetry);
    ApiService.getSettings().then((s) => {
      setSettings(s);
      soundFx.enabled = s.soundEnabled;
    });
  }, []);

  // Unlock AudioContext on gestures & attach tactile click listener
  useEffect(() => {
    const handleGesture = () => {
      soundFx.unlockAudio();
    };

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });

    const handleGlobalClick = (e: MouseEvent) => {
      if (!settings.soundEnabled) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, kbd'
      );
      if (isInteractive) {
        soundFx.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [settings.soundEnabled]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTelemetry = (updates: Partial<TelemetryState>) => {
    setTelemetry((prev) => {
      const next = { ...prev, ...updates };
      ApiService.updateTelemetry(next);
      return next;
    });
  };

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      ApiService.saveSettings(next);
      if (typeof updates.soundEnabled === 'boolean') {
        soundFx.enabled = updates.soundEnabled;
        if (updates.soundEnabled) {
          soundFx.playPing();
        }
      }
      return next;
    });
  };

  const handleStartDrill = (type: PillarDrillType = 'daily-game') => {
    if (type === 'daily-game') {
      navigate('/daily-game');
      return;
    }
    setSelectedDrillType(type);
    setDrillModalOpen(true);
  };

  const handleSessionComplete = (scoreGain: number) => {
    handleUpdateTelemetry({
      recallBalance: +(telemetry.recallBalance + 0.12).toFixed(2),
      xpPerMin: telemetry.xpPerMin + scoreGain,
      streak: +(telemetry.streak + 0.1).toFixed(1),
    });
  };

  // Global spacebar interaction
  useSpacebarInteraction(() => {
    if (drillModalOpen) return;
    addToast({
      title: '[SPACEBAR ACTION TRIGGERED]',
      detail: 'Launched interactive focus drill from keyboard shortcut.',
      type: 'info',
    });
    handleStartDrill('synaptic-velocity');
  }, !drillModalOpen && !tutorialOpen);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-parchment-100 flex flex-col font-sans ${settings.highContrast ? 'contrast-125' : ''}`}>
      {/* Sticky Header Navbar */}
      <HeaderNavbar
        telemetry={telemetry}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        onOpenProtocolDrawer={() => setProtocolDrawerOpen(true)}
        onStartDrill={() => handleStartDrill('daily-game')}
      />

      {/* Patient Welcome Banner */}
      {currentUser && currentUser.role === 'PATIENT' && (
        <div className="bg-emerald-900 text-white px-4 py-3 border-b-2 border-emerald-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌿</span>
              <p className="text-sm sm:text-base font-bold">
                Welcome back, {currentUser.name || currentUser.username}! Enjoy your games, reminiscence photos, and peaceful virtual garden.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                to="/daily-game"
                className="text-xs bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>⭐ Play Daily Memory Game</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await ApiService.logout();
                  window.location.href = '/patient/login';
                }}
                className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg border border-emerald-600 cursor-pointer shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartDrill={() => handleStartDrill('daily-game')}
          onOpenTutorial={() => setTutorialOpen(true)}
          onOpenSetupModal={() => setSettingsModalOpen(true)}
          reducedMotion={settings.reducedMotion}
        />

        {/* The 4 Cognitive Pillars */}
        <CognitivePillarsSection
          onSelectPillar={handleStartDrill}
          reducedMotion={settings.reducedMotion}
        />

        {/* Why Isometric Stress Drills Work & Drill Simulator Window */}
        <DrillSimulatorSection
          onAddToast={addToast}
          onLaunchFullDrill={() => handleStartDrill('inhibitory')}
        />

        {/* Observed Effects Testimonials */}
        <ObservedEffectsSection
          onSelectTestimonial={(t) => {
            addToast({
              title: `COHORT PROFILE: ${t.name}`,
              detail: `Verified ${t.streakDays}-day streak with ${t.scorePts.toLocaleString()} PTS.`,
              type: 'info',
            });
          }}
          reducedMotion={settings.reducedMotion}
        />

        {/* Bottom CTA Section */}
        <BottomCTASection
          onEnterLabDrill={() => handleStartDrill('daily-game')}
          onScrollToTop={scrollToTop}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenProtocol={() => setProtocolModalOpen(true)}
      />

      {/* Interactive Modals */}
      <LabDrillModal
        isOpen={drillModalOpen}
        onClose={() => setDrillModalOpen(false)}
        drillType={selectedDrillType}
        onAddToast={addToast}
        onSessionComplete={handleSessionComplete}
      />

      <TutorialModal
        isOpen={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        onStartFirstDrill={() => handleStartDrill('daily-game')}
      />

      <SettingsPreferencesModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        telemetry={telemetry}
        onUpdateTelemetry={handleUpdateTelemetry}
        onAddToast={addToast}
      />

      <ProtocolDrawerModal
        isOpen={protocolDrawerOpen}
        onClose={() => setProtocolDrawerOpen(false)}
        onStartDrill={() => handleStartDrill('synaptic-velocity')}
      />

      <PrivacyProtocolModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="NEURO PLAYY PRIVACY PROTOCOL"
      />

      <PrivacyProtocolModal
        isOpen={protocolModalOpen}
        onClose={() => setProtocolModalOpen(false)}
        title="NEURO PLAYY NEURO PROTOCOL & METHODOLOGY"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default PlayerActivityHome;
