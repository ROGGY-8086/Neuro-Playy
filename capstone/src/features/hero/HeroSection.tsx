import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { ArchitecturalHeroArt } from '../../components/common/ArchitecturalHeroArt';
import { Hero3DCanvas } from './Hero3DCanvas';
import { soundFx } from '../../utils/audio';

interface HeroSectionProps {
  onStartDrill: () => void;
  onOpenTutorial: () => void;
  onOpenSetupModal: () => void;
  reducedMotion?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDrill,
  onOpenTutorial,
  onOpenSetupModal,
  reducedMotion = false,
}) => {
  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b-2 border-ink-950">
      {/* Background Architectural Vector Artwork */}
      <ArchitecturalHeroArt />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 md:mb-12">
          {/* [ ENTER THE SETUP... ] */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenSetupModal();
            }}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white border-2 border-ink-950 text-xs font-mono font-bold hover:bg-parchment-200 transition-all shadow-brutal active:translate-y-0.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-ink-950" />
            <span>[ ENTER THE SETUP... ]</span>
          </button>

          {/* [ BRAINPLASTICITY DRILLS - V2.02 READY ] */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-ink-950 text-xs font-mono font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-labYellow border border-ink-950"></span>
            <span>[ BRAINPLASTICITY DRILLS - V2.02 READY ]</span>
          </div>
        </div>

        {/* Two-Column Grid: Left Copy & CTAs, Right 3D Monolith Scene */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Massive Headline & Text */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl xl:text-9xl tracking-tighter leading-[0.88] text-ink-950 mb-6 uppercase select-none">
                DON'T<br />
                LOSE<br />
                FOCUS
              </h1>
            </motion.div>

            <motion.p
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-ink-700 max-w-xl font-sans font-medium leading-relaxed mb-8"
            >
              You are flooded with notifications, multitasking tabs, and standing in front of endless distraction. Train your working memory before the haze sets in.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              {/* START DRILL button */}
              <button
                onClick={() => {
                  soundFx.playPing();
                  onStartDrill();
                }}
                className="px-8 py-3.5 rounded-full bg-ink-950 text-white font-mono text-sm sm:text-base font-bold tracking-wide uppercase hover:bg-ink-800 transition-all hover:scale-105 active:scale-95 shadow-brutal flex items-center gap-2.5 group cursor-pointer"
              >
                <span>START DRILL</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* TUTORIAL button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenTutorial();
                }}
                className="px-7 py-3.5 rounded-full bg-white text-ink-950 border-2 border-ink-950 font-mono text-sm sm:text-base font-bold tracking-wide uppercase hover:bg-parchment-200 transition-all active:translate-y-0.5 shadow-brutal flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>TUTORIAL</span>
              </button>
            </motion.div>

            {/* Scientific Citation Tag */}
            <div className="flex items-center gap-2 text-xs font-mono text-ink-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-ink-950/20">
              <span className="w-3.5 h-3.5 rounded-full bg-labYellow border border-ink-950 flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
              <span>
                Backed by <strong className="text-ink-950 underline decoration-labYellow decoration-2 underline-offset-2">Cognitive Science</strong> • Inspired by cognitive endurance research
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Wireframe Depth Model */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-md aspect-square relative rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-ink-950/20 p-2 shadow-sm">
              <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-ink-500 bg-white px-2 py-0.5 rounded border border-ink-950/20 z-10">
                [ 3D NEURO MONOLITH ]
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-ink-950/20 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ACTIVE LATTICE
              </div>
              <Hero3DCanvas reducedMotion={reducedMotion} />
              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-mono text-ink-400">
                DRAG OR HOVER TO ROTATE PERSPECTIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
