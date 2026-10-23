import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cohortTestimonials } from '../../data/mockData';
import { CohortTestimonial } from '../../types';
import { soundFx } from '../../utils/audio';

interface ObservedEffectsSectionProps {
  onSelectTestimonial?: (t: CohortTestimonial) => void;
  reducedMotion?: boolean;
}

export const ObservedEffectsSection: React.FC<ObservedEffectsSectionProps> = ({
  onSelectTestimonial,
  reducedMotion = false,
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <section id="effects" className="py-16 md:py-24 border-b-2 border-ink-950 bg-parchment-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-ink-950/40 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            [ DOUBLE RETENTION METRICS ]
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink-950 uppercase">
            OBSERVED EFFECTS
          </h2>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cohortTestimonials.map((item, idx) => {
            const isSelected = activeCardId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={reducedMotion ? {} : { y: -4 }}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCardId(isSelected ? null : item.id);
                  if (onSelectTestimonial) onSelectTestimonial(item);
                }}
                className={`bg-white border-2 border-ink-950 rounded-2xl p-6 shadow-brutal flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected ? 'ring-4 ring-labYellow' : ''
                }`}
              >
                {/* Speech Bubble Quote Card */}
                <div className="relative bg-parchment-50 border border-ink-950/20 rounded-xl p-4 mb-6">
                  <p className="text-xs sm:text-sm text-ink-800 font-sans leading-relaxed italic">
                    "{item.quote}"
                  </p>
                  {/* Speech bubble arrow notch */}
                  <div className="absolute -bottom-2 left-6 w-3 h-3 bg-parchment-50 border-b border-r border-ink-950/20 transform rotate-45"></div>
                </div>

                {/* Author Credentials & Avatar */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-full border-2 border-ink-950 flex items-center justify-center font-mono font-black text-xs text-ink-950 shadow-sm"
                      style={{ backgroundColor: item.avatarBg }}
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-ink-950 uppercase tracking-tight">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-sans text-ink-500">
                        {item.title}
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats: Streak & Score */}
                  <div className="pt-3 border-t border-ink-950/15 flex items-center justify-between text-[11px] font-mono font-bold">
                    <span className="text-ink-600">
                      STREAK: <strong className="text-ink-950">{item.streakDays} DAYS</strong>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      SCORE: {item.scorePts.toLocaleString()} PTS
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
