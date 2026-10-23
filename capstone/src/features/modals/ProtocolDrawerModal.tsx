import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ProtocolDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrill: () => void;
}

export const ProtocolDrawerModal: React.FC<ProtocolDrawerModalProps> = ({
  isOpen,
  onClose,
  onStartDrill,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-ink-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white border-l-2 border-ink-950 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-ink-950 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-mono font-bold text-sm uppercase text-ink-950">
                PROTOCOL STATUS: EXTENDED V2.3
              </span>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1 rounded-md border border-ink-950/20 hover:bg-parchment-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-parchment-50 rounded-xl border border-ink-950/20">
              <span className="text-[10px] font-mono block text-ink-500 uppercase">INTERVAL CYCLES</span>
              <span className="font-display font-black text-2xl text-ink-950">11 / 20</span>
              <span className="text-[10px] font-mono text-emerald-700 block mt-1">55% Session Completed</span>
            </div>
            <div className="p-3 bg-parchment-50 rounded-xl border border-ink-950/20">
              <span className="text-[10px] font-mono block text-ink-500 uppercase">INTERVAL TIMER</span>
              <span className="font-display font-black text-2xl text-labYellow-hover font-mono">0:59</span>
              <span className="text-[10px] font-mono text-ink-500 block mt-1">RE-ALL SYNCHRONIZER</span>
            </div>
          </div>

          {/* 20-Stage Matrix */}
          <div className="mb-6">
            <div className="text-xs font-mono font-bold text-ink-700 uppercase mb-2">
              SESSION MATRIX (20 INTERVALS)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 20 }).map((_, i) => {
                const isPassed = i < 11;
                const isCurrent = i === 11;
                return (
                  <div
                    key={i}
                    className={`py-2 text-center rounded border font-mono text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-100 border-emerald-800 text-emerald-950'
                        : isCurrent
                        ? 'bg-labYellow border-ink-950 text-ink-950 animate-pulse ring-2 ring-ink-950'
                        : 'bg-parchment-100 border-ink-950/20 text-ink-400'
                    }`}
                  >
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Protocol Specifications */}
          <div className="p-4 bg-parchment-50 rounded-xl border border-ink-950/20 text-xs font-sans text-ink-700 space-y-2">
            <div className="font-mono font-bold text-[11px] uppercase text-ink-950">
              CLINICAL TOLERANCES
            </div>
            <p>• Error drift threshold clamped to &lt; 0.400.</p>
            <p>• Simultaneous auditory and spatial cues active.</p>
            <p>• No artificial dopamine streaks or penalty guilt.</p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-6 border-t border-ink-950/20">
          <button
            onClick={() => {
              soundFx.playPing();
              onClose();
              onStartDrill();
            }}
            className="w-full py-3.5 rounded-full bg-ink-950 text-white font-mono text-xs font-bold uppercase hover:bg-ink-800 shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-labYellow" />
            <span>RESUME PROTOCOL DRILL</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
