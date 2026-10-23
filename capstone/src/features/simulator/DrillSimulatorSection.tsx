import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, SkipForward, Sparkles, Brain, Activity, ShieldCheck } from 'lucide-react';
import { simulatorStages } from '../../data/mockData';
import { soundFx } from '../../utils/audio';
import { ToastMessage } from '../../types';

interface DrillSimulatorSectionProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onLaunchFullDrill: () => void;
}

export const DrillSimulatorSection: React.FC<DrillSimulatorSectionProps> = ({
  onAddToast,
  onLaunchFullDrill,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(1); // Index 1 is STAGE 2 OF 4 matching the Stitch mockup
  const currentStage = simulatorStages[currentStageIdx];

  const handleNextStep = () => {
    soundFx.playPing();
    if (currentStageIdx < simulatorStages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
      onAddToast({
        title: `ADVANCED TO STAGE ${currentStageIdx + 2} OF ${simulatorStages.length}`,
        detail: `Loaded protocol parameter: ${simulatorStages[currentStageIdx + 1].title}`,
        type: 'success',
      });
    } else {
      // Completed all stages!
      soundFx.playMatchChime();
      onAddToast({
        title: 'DRILL SIMULATOR COMPLETE',
        detail: 'Prefrontal synchronicities aligned at 98.4% efficiency.',
        type: 'success',
      });
      setCurrentStageIdx(0);
    }
  };

  const handleSkip = () => {
    soundFx.playClick();
    const nextIdx = (currentStageIdx + 1) % simulatorStages.length;
    setCurrentStageIdx(nextIdx);
    onAddToast({
      title: `STAGE SKIPPED: STEPPING TO STAGE ${nextIdx + 1}`,
      type: 'info',
    });
  };

  return (
    <section id="clinical" className="py-16 md:py-24 border-b-2 border-ink-950 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Why Isometric Stress Drills Work */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-parchment-100 border border-ink-950/40 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              [ CLINICAL VERIFICATION ]
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-950 uppercase mb-6 leading-tight">
              WHY ISOMETRIC<br />
              STRESS DRILLS WORK
            </h2>

            <p className="text-sm sm:text-base text-ink-700 font-sans leading-relaxed mb-8">
              Unlike static multiple-choice flashcards, dynamic isometric environments demand high-perceptual and tactile tracking. Your occipital and prefrontal lobes are forced to work concurrently.
            </p>

            {/* 3 Metric Cards */}
            <div className="w-full flex flex-col gap-3">
              {/* RECOMMENDED DOSE */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-ink-950 bg-parchment-50 shadow-sm">
                <span className="text-xs font-mono font-bold text-ink-800 uppercase tracking-wider">
                  RECOMMENDED DOSE
                </span>
                <span className="px-3 py-1 rounded-md bg-labYellow border border-ink-950 text-xs font-mono font-black text-ink-950">
                  10 MIN / DAY
                </span>
              </div>

              {/* PEER REVIEWED VALIDATION */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-ink-950 bg-parchment-50 shadow-sm">
                <span className="text-xs font-mono font-bold text-ink-800 uppercase tracking-wider">
                  PEER REVIEWED VALIDATION
                </span>
                <span className="px-3 py-1 rounded-md bg-white border border-ink-950 text-xs font-mono font-black text-ink-950">
                  89% AGE COHORTS
                </span>
              </div>

              {/* OBJECTIVE FOCUS INDEX */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-ink-950 bg-parchment-50 shadow-sm">
                <span className="text-xs font-mono font-bold text-ink-800 uppercase tracking-wider">
                  OBJECTIVE FOCUS INDEX
                </span>
                <span className="px-3 py-1 rounded-md bg-emerald-100 border border-emerald-800 text-xs font-mono font-black text-emerald-950">
                  +2.4X ELEVATION
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Drill Simulator Window */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-ink-950 rounded-2xl shadow-brutal-lg overflow-hidden flex flex-col">
              {/* Window Header Frame */}
              <div className="bg-parchment-100 border-b-2 border-ink-950 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-ink-950"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-ink-950"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 border border-ink-950"></div>
                  <span className="ml-2 text-xs font-mono font-bold text-ink-900 uppercase">
                    [ DRILL SIMULATOR — LAB 01 ]
                  </span>
                </div>
                <div className="text-xs font-mono font-black text-ink-700 uppercase bg-white px-2.5 py-0.5 rounded border border-ink-950/30">
                  STAGE {currentStageIdx + 1} OF {simulatorStages.length}
                </div>
              </div>

              {/* Simulator Content Stage */}
              <div className="p-6 md:p-10 flex flex-col items-center text-center bg-white min-h-[340px] justify-between">
                {/* Visual Avatar Line-art Graphic */}
                <div className="w-full flex justify-center py-4">
                  <div className="relative">
                    <svg viewBox="0 0 200 100" className="w-48 h-24" fill="none" stroke="#121316" strokeWidth="2">
                      {/* 3 Walking Characters */}
                      <g transform="translate(40, 20)">
                        <circle cx="20" cy="15" r="8" fill="#FAF9F5" />
                        <path d="M20,23 L20,50 M12,32 L28,32 M14,50 L8,70 M26,50 L32,70" />
                        <circle cx="28" cy="32" r="3" fill="#F5B800" stroke="none" />
                      </g>
                      <g transform="translate(85, 10)">
                        <circle cx="20" cy="15" r="10" fill="#FAF9F5" />
                        <path d="M20,25 L20,58 M10,36 L30,36 M12,58 L6,80 M28,58 L34,80" />
                        <circle cx="20" cy="15" r="3" fill="#F5B800" stroke="none" />
                      </g>
                      <g transform="translate(130, 20)">
                        <circle cx="20" cy="15" r="8" fill="#FAF9F5" />
                        <path d="M20,23 L20,50 M12,32 L28,32 M14,50 L8,70 M26,50 L32,70" />
                        <circle cx="12" cy="32" r="3" fill="#F5B800" stroke="none" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Stage Info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-md"
                  >
                    <h3 className="font-display font-black text-xl sm:text-2xl text-ink-950 uppercase tracking-tight mb-2">
                      {currentStage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600 font-sans leading-relaxed">
                      {currentStage.instruction}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Stage Progress Pills */}
                <div className="flex gap-2 my-4">
                  {simulatorStages.map((st, i) => (
                    <button
                      key={st.step}
                      onClick={() => {
                        soundFx.playClick();
                        setCurrentStageIdx(i);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === currentStageIdx
                          ? 'w-8 bg-labYellow border border-ink-950'
                          : i < currentStageIdx
                          ? 'w-3 bg-ink-950'
                          : 'w-3 bg-parchment-300'
                      }`}
                      aria-label={`Jump to stage ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2.5 rounded-full bg-white text-ink-950 border-2 border-ink-950 font-mono text-xs font-bold uppercase hover:bg-parchment-200 transition-colors active:translate-y-0.5 cursor-pointer"
                  >
                    SKIP
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-2.5 rounded-full bg-ink-950 text-white font-mono text-xs font-bold uppercase hover:bg-ink-800 transition-all active:scale-95 shadow-brutal flex items-center gap-2 cursor-pointer"
                  >
                    <span>NEXT STEP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
