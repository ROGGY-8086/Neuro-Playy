import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Compass, Shield, Zap, Target } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFirstDrill: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartFirstDrill,
}) => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: 'THE COGNITIVE OVERLOAD TRAP',
      desc: 'Modern work subjects your working memory to endless micro-distractions: 50 open tabs, sudden Slack alerts, and involuntary gaze drift. Without dedicated resistance training, working memory degrades rapidly.',
      icon: <Target className="w-8 h-8 text-labRed" />,
      tag: '01 / DIAGNOSIS',
    },
    {
      title: 'INTERACTIVE DRILL SIMULATOR',
      desc: 'The interactive Drill Simulator walks you through dynamic focus stages. Progress through each level to align perceptual tracking and maintain mental clarity.',
      icon: <Shield className="w-8 h-8 text-labYellow" />,
      tag: '02 / SIMULATOR',
    },
    {
      title: 'THE 4 CLINICAL PILLARS',
      desc: 'Daily 10-minute training covers Dual N-Back span, Inhibitory Stroop suppression, Facial & trait retention, and Synaptic millisecond velocity. Just 10 minutes a day produces verified retention gains.',
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
      tag: '03 / CLINICAL DOSE',
    },
    {
      title: 'TACTILE SHORTCUTS & PRIVACY',
      desc: 'Hit [SPACE] anywhere on the page to trigger rapid focus interaction or pause. Your data is stored locally in this frontend phase and is prepared for your upcoming private Spring Boot backend.',
      icon: <Compass className="w-8 h-8 text-purple-600" />,
      tag: '04 / PROTOCOL READY',
    },
  ];

  if (!isOpen) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-ink-950 rounded-2xl shadow-brutal-lg max-w-xl w-full overflow-hidden"
      >
        <div className="bg-parchment-100 border-b-2 border-ink-950 p-4 flex items-center justify-between">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-ink-950">
            [ CAPSTONE TUTORIAL PROTOCOL ]
          </span>
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

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded bg-parchment-200 border border-ink-950/30 font-mono text-[11px] font-bold text-ink-900">
              {current.tag}
            </span>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-ink-950 ${
                    i === step ? 'bg-labYellow' : 'bg-parchment-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="my-6 flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl border-2 border-ink-950 bg-parchment-50 flex items-center justify-center shadow-brutal flex-shrink-0">
              {current.icon}
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-ink-950 uppercase tracking-tight mb-2">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-700 font-sans leading-relaxed">
                {current.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-ink-950/20 mt-6">
            <button
              onClick={() => {
                soundFx.playClick();
                setStep((s) => Math.max(0, s - 1));
              }}
              disabled={step === 0}
              className="px-4 py-2 rounded-lg border border-ink-950 bg-white font-mono text-xs font-bold uppercase disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep((s) => s + 1);
                }}
                className="px-6 py-2 rounded-lg bg-ink-950 text-white font-mono text-xs font-bold uppercase shadow-brutal hover:bg-ink-800 cursor-pointer"
              >
                Next <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playPing();
                  onClose();
                  onStartFirstDrill();
                }}
                className="px-6 py-2 rounded-lg bg-labYellow text-ink-950 border-2 border-ink-950 font-mono text-xs font-black uppercase shadow-brutal hover:bg-labYellow-hover cursor-pointer"
              >
                Enter Lab Drill <Zap className="w-3.5 h-3.5 inline ml-1" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
