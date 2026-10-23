import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Eye, Sparkles, Sliders, RotateCcw, Check, Globe } from 'lucide-react';
import { UserSettings, TelemetryState, ToastMessage } from '../../types';
import { soundFx } from '../../utils/audio';

interface SettingsPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  telemetry: TelemetryState;
  onUpdateTelemetry: (updates: Partial<TelemetryState>) => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SettingsPreferencesModal: React.FC<SettingsPreferencesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  telemetry,
  onUpdateTelemetry,
  onAddToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-ink-950 rounded-2xl shadow-brutal-lg max-w-lg w-full overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-parchment-100 border-b-2 border-ink-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-ink-950" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-ink-950">
              [ CAPSTONE LAB PREFERENCES & TELEMETRY ]
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 rounded-md border border-ink-950/20 hover:bg-parchment-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 text-sm">
          {/* Audio Feedback Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-ink-950/20 bg-parchment-50">
            <div>
              <div className="font-mono font-bold text-xs uppercase text-ink-950">
                Auditory Feedback
              </div>
              <div className="text-xs text-ink-600 font-sans mt-0.5">
                Gentle Web Audio chimes for pings, clicks, and countermeasure feedback.
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundFx.enabled = next;
                if (next) soundFx.playPing();
                onUpdateSettings({ soundEnabled: next });
              }}
              className={`w-12 h-7 rounded-full border-2 border-ink-950 p-0.5 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-labYellow' : 'bg-parchment-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-ink-950 transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-ink-950/20 bg-parchment-50">
            <div>
              <div className="font-mono font-bold text-xs uppercase text-ink-950">
                Reduced Motion Mode
              </div>
              <div className="text-xs text-ink-600 font-sans mt-0.5">
                Replaces 3D WebGL rotation and bouncy animations with static architectural line drawings.
              </div>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`w-12 h-7 rounded-full border-2 border-ink-950 p-0.5 transition-colors cursor-pointer ${
                settings.reducedMotion ? 'bg-labYellow' : 'bg-parchment-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-ink-950 transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="p-3.5 rounded-xl border border-ink-950/20 bg-parchment-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs uppercase text-ink-950 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Platform Language
              </span>
              <span className="text-[11px] font-mono text-ink-500 uppercase">
                Currently: {settings.preferredLanguage}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['EN', 'MR', 'HI'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    soundFx.playClick();
                    onUpdateSettings({ preferredLanguage: lang });
                    onAddToast({
                      title: `LANGUAGE UPDATED: ${lang}`,
                      detail:
                        lang === 'MR'
                          ? 'मराठी भाषा संवाद सक्रिय.'
                          : lang === 'HI'
                          ? 'हिंदी भाषा संवाद सक्रिय.'
                          : 'English cognitive labels active.',
                      type: 'info',
                    });
                  }}
                  className={`py-2 px-3 rounded-lg border border-ink-950 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.preferredLanguage === lang
                      ? 'bg-labYellow text-ink-950 shadow-sm'
                      : 'bg-white text-ink-700 hover:bg-parchment-200'
                  }`}
                >
                  {lang === 'EN' && 'English'}
                  {lang === 'MR' && 'मराठी'}
                  {lang === 'HI' && 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Fee & Tax Slider */}
          <div className="p-3.5 rounded-xl border border-ink-950/20 bg-parchment-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs uppercase text-ink-950">
                Daily Focus Fee
              </span>
              <span className="font-mono font-black text-xs text-labYellow-hover bg-ink-950 px-2 py-0.5 rounded text-white">
                {telemetry.dailyFocusFee} FD/DAY
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={telemetry.dailyFocusFee}
              onChange={(e) => {
                onUpdateTelemetry({ dailyFocusFee: Number(e.target.value) });
              }}
              className="w-full accent-ink-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-500 mt-1">
              <span>50 FD/DAY (Rest)</span>
              <span>124 FD/DAY (Standard)</span>
              <span>250 FD/DAY (Heavy)</span>
            </div>
          </div>

          {/* Backend Readiness Note */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono">
            <strong>✓ Spring Boot Ready:</strong> REST endpoints defined for <code className="bg-white px-1 py-0.5 rounded border border-emerald-300">/api/telemetry</code> and <code className="bg-white px-1 py-0.5 rounded border border-emerald-300">/api/games/sessions</code>.
          </div>

          {/* Footer Close */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-ink-950 text-white font-mono text-xs font-bold uppercase hover:bg-ink-800 shadow-brutal cursor-pointer"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
