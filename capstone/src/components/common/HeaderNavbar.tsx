import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Settings, ShieldCheck, Zap, Menu, X, Heart } from 'lucide-react';
import { TelemetryState, UserSettings } from '../../types';
import { ApiService } from '../../services/api';

interface HeaderNavbarProps {
  telemetry: TelemetryState;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettingsModal: () => void;
  onOpenProtocolDrawer: () => void;
  onStartDrill: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  telemetry,
  settings,
  onUpdateSettings,
  onOpenSettingsModal,
  onOpenProtocolDrawer,
  onStartDrill,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-parchment-100/95 backdrop-blur-md border-b-2 border-ink-950 px-4 md:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Section: Brand & Status Badges */}
        <div className="flex items-center gap-3 md:gap-5 flex-wrap">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 rounded-lg p-0.5"
            aria-label="Neuro Playy Home"
          >
            <div className="w-7 h-7 rounded-full bg-labYellow border-2 border-ink-950 flex items-center justify-center font-bold text-xs shadow-brutal transition-transform group-hover:scale-105">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-950"></span>
            </div>
            <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-ink-950">
              Neuro Playy
            </span>
          </a>

          {/* Status Badge: RECALL LAB : ACTIVE */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-white border border-ink-950/40 text-ink-900 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RECALL LAB : ACTIVE</span>
          </div>

          {/* Quick Protocol Pill */}
          <button
            onClick={onOpenProtocolDrawer}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-ink-950 text-white hover:bg-ink-800 transition-colors shadow-sm cursor-pointer"
            title="Open protocol status inspector"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-labYellow" />
            <span>11 / 20</span>
            <span className="text-zinc-400">|</span>
            <span>PROTOCOL</span>
            <span className="text-zinc-400">|</span>
            <span className="text-labYellow">0:59 RE-ALL</span>
          </button>
        </div>

        {/* Right Section: Live Telemetry Tickers & Controls */}
        <div className="hidden xl:flex items-center gap-6 text-[11px] font-mono">
          {/* MEMORY RECALL VELOCITY */}
          <div className="flex flex-col text-right">
            <span className="text-ink-500 font-medium tracking-wider uppercase text-[10px]">
              MEMORY RECALL VELOCITY
            </span>
            <span className="font-bold text-ink-950">{telemetry.velocity}</span>
          </div>

          {/* ERROR DRIFT INDEX */}
          <div className="flex flex-col text-right">
            <span className="text-ink-500 font-medium tracking-wider uppercase text-[10px]">
              ERROR DRIFT INDEX
            </span>
            <span className="font-bold text-ink-950">{telemetry.errorDriftIndex}</span>
          </div>

          {/* DAILY FOCUS FEE (Yellow Pill) */}
          <button
            onClick={onOpenSettingsModal}
            className="flex flex-col items-end px-3 py-1 rounded-md bg-labYellow border border-ink-950/40 text-ink-950 font-bold hover:bg-labYellow-hover transition-colors shadow-sm cursor-pointer"
            title="Configure daily focus allocation and tax"
          >
            <span className="text-[9px] uppercase tracking-wider text-ink-800">
              DAILY FOCUS FEE
            </span>
            <span>{telemetry.dailyFocusFee} FD/DAY</span>
          </button>
        </div>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Role Portal / Dashboard Link */}
          {(() => {
            const isAuth = ApiService.isAuthenticated();
            const role = ApiService.getUserRole();
            const dest = !isAuth ? "/" : role === 'CAREGIVER' ? "/caregiver/dashboard" : "/player";
            const label = !isAuth ? "Sign In" : role === 'CAREGIVER' ? "Caregiver Hub" : "Player Space";
            const shortLabel = !isAuth ? "Sign In" : role === 'CAREGIVER' ? "Caregiver" : "Player";

            return (
              <Link
                to={dest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-emerald-800/40 bg-emerald-50 text-emerald-950 font-sans text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
                title={label}
              >
                <Heart className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </Link>
            );
          })()}

          {/* Audio toggle button */}
          <button
            onClick={() => {
              onUpdateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className="p-1.5 rounded-lg border border-ink-950/30 bg-white hover:bg-parchment-200 text-ink-900 transition-colors cursor-pointer"
            title={settings.soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
            aria-label={settings.soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-ink-400" />
            )}
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 rounded-lg border border-ink-950/30 bg-white hover:bg-parchment-200 text-ink-900 transition-colors cursor-pointer"
            title="Open Lab Preferences"
            aria-label="Open Lab Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Quick Drill Button */}
          <button
            onClick={onStartDrill}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink-950 text-white font-mono text-xs font-bold hover:bg-ink-800 transition-transform active:scale-95 shadow-brutal"
          >
            <Zap className="w-3.5 h-3.5 text-labYellow fill-labYellow" />
            <span>START DRILL</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg border border-ink-950/30 bg-white text-ink-900"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-ink-950/20 flex flex-col gap-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 p-2 bg-white/70 rounded-lg border border-ink-950/20">
            <div>
              <span className="text-ink-500 text-[10px] block">N-BACK VELOCITY</span>
              <span className="font-bold text-ink-950">{telemetry.velocity}</span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">DRIFT INDEX</span>
              <span className="font-bold text-ink-950">{telemetry.errorDriftIndex}</span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">FOCUS FEE</span>
              <span className="font-bold text-labYellow-hover">{telemetry.dailyFocusFee} FD/DAY</span>
            </div>
            <div>
              <span className="text-ink-500 text-[10px] block">PROTOCOL</span>
              <span className="font-bold text-emerald-700">EXTENDED V2.3</span>
            </div>
          </div>

          <div className="flex gap-2">
            {(() => {
              const isAuth = ApiService.isAuthenticated();
              const role = ApiService.getUserRole();
              const dest = !isAuth ? "/" : role === 'CAREGIVER' ? "/caregiver/dashboard" : "/player";
              const label = !isAuth ? "Sign In" : role === 'CAREGIVER' ? "Caregiver Hub" : "Player Space";
              return (
                <Link
                  to={dest}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-emerald-800 text-white font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{label}</span>
                </Link>
              );
            })()}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onOpenProtocolDrawer();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-white border border-ink-950 font-bold text-center"
            >
              Protocol Drawer
            </button>
            <button
              onClick={() => {
                onOpenSettingsModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-labYellow border border-ink-950 font-bold text-center"
            >
              Preferences
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
