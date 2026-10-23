import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, UserCheck, Zap, ArrowUpRight } from 'lucide-react';
import { CognitivePillar, PillarDrillType } from '../../types';
import { cognitivePillars } from '../../data/mockData';
import { soundFx } from '../../utils/audio';

interface CognitivePillarsSectionProps {
  onSelectPillar: (drillType: PillarDrillType) => void;
  reducedMotion?: boolean;
}

export const CognitivePillarsSection: React.FC<CognitivePillarsSectionProps> = ({
  onSelectPillar,
  reducedMotion = false,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-5 h-5 text-ink-950" />;
      case 'lightbulb':
        return <Lightbulb className="w-5 h-5 text-ink-950" />;
      case 'badge':
        return <UserCheck className="w-5 h-5 text-ink-950" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-ink-950" />;
      default:
        return <Target className="w-5 h-5 text-ink-950" />;
    }
  };

  const getBadgeStyle = (metricType: CognitivePillar['metricType']) => {
    switch (metricType) {
      case 'recall':
        return 'bg-emerald-100 text-emerald-900 border-emerald-800';
      case 'distraction':
        return 'bg-labYellow text-ink-950 border-ink-950';
      case 'retention':
        return 'bg-sky-100 text-sky-950 border-sky-800';
      case 'velocity':
        return 'bg-purple-100 text-purple-950 border-purple-800';
      default:
        return 'bg-parchment-200 text-ink-900 border-ink-950';
    }
  };

  return (
    <section id="pillars" className="py-16 md:py-24 border-b-2 border-ink-950 bg-parchment-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-ink-950/40 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              [ THE CLINICAL BLUEPRINT ]
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink-950 uppercase">
              THE 4 COGNITIVE<br className="hidden sm:inline" /> PILLARS
            </h2>
          </div>

          <p className="max-w-md text-ink-700 text-sm sm:text-base font-sans font-medium leading-relaxed">
            Most brain training apps feel like spreadsheet chores. CAPSTONE treats cognitive stamina like a high-stakes survival puzzle.
          </p>
        </div>

        {/* 4 Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cognitivePillars.map((pillar, idx) => {
            return (
              <motion.div
                key={pillar.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={reducedMotion ? {} : { y: -4, rotateZ: idx % 2 === 0 ? -0.5 : 0.5 }}
                onClick={() => {
                  soundFx.playClick();
                  onSelectPillar(pillar.drillType);
                }}
                className="group relative bg-white border-2 border-ink-950 rounded-2xl p-6 shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between cursor-pointer"
              >
                {/* Top Row: Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-ink-950/15">
                    <span className="font-display font-black text-2xl text-ink-950">
                      {pillar.number}
                    </span>
                    <div className="w-10 h-10 rounded-full border-2 border-ink-950 flex items-center justify-center bg-parchment-100 group-hover:bg-labYellow transition-colors shadow-sm">
                      {getIcon(pillar.iconName)}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-ink-950 tracking-tight mb-3 uppercase group-hover:text-amber-800 transition-colors flex items-center justify-between">
                    <span>{pillar.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-700 font-sans leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Footer Metric Tag & CTA hint */}
                <div className="pt-4 border-t border-ink-950/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-ink-500 font-bold uppercase tracking-wider">
                    {pillar.metricLabel}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-black border tracking-wide ${getBadgeStyle(
                      pillar.metricType
                    )}`}
                  >
                    {pillar.metricValue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
