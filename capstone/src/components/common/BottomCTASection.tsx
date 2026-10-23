import React from 'react';
import { ArrowUp, Play, Zap, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface BottomCTASectionProps {
  onEnterLabDrill: () => void;
  onScrollToTop: () => void;
}

export const BottomCTASection: React.FC<BottomCTASectionProps> = ({
  onEnterLabDrill,
  onScrollToTop,
}) => {
  return (
    <section className="py-20 md:py-28 bg-white border-b-2 border-ink-950 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-parchment-100 border border-ink-950/40 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-labYellow"></span>
          <span>[ TESTS FOR YOUR MIND SPAN ]</span>
        </div>

        {/* Display Title */}
        <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-ink-950 uppercase mb-6 leading-[0.95]">
          START YOUR 10-<br />
          MINUTE DRILL NOW
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-ink-700 max-w-xl font-sans font-medium leading-relaxed mb-10">
          No endless email trials and trials. Free baseline testing, instant synaptic feedback, and zero dopamine fluff.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={() => {
              soundFx.playPing();
              onEnterLabDrill();
            }}
            className="px-8 py-4 rounded-full bg-ink-950 text-white font-mono text-sm sm:text-base font-bold uppercase hover:bg-ink-800 transition-all hover:scale-105 active:scale-95 shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-labYellow fill-labYellow" />
            <span>ENTER LAB DRILL</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onScrollToTop();
            }}
            className="px-7 py-4 rounded-full bg-white text-ink-950 border-2 border-ink-950 font-mono text-sm sm:text-base font-bold uppercase hover:bg-parchment-200 transition-all active:translate-y-0.5 shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-ink-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-950"></span>
            ZERO ADS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-950"></span>
            NO ML OPT-OUTS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-950"></span>
            CLINICAL PROTOCOL
          </span>
        </div>
      </div>
    </section>
  );
};
