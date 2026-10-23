import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface PrivacyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const PrivacyProtocolModal: React.FC<PrivacyProtocolModalProps> = ({
  isOpen,
  onClose,
  title = 'CAPSTONE PRIVACY & NEURO PROTOCOL',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-ink-950 rounded-2xl shadow-brutal-lg max-w-xl w-full overflow-hidden my-6"
      >
        <div className="bg-parchment-100 border-b-2 border-ink-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ink-950" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-ink-950">
              [ {title} ]
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

        <div className="p-6 md:p-8 space-y-4 text-xs sm:text-sm text-ink-700 font-sans leading-relaxed">
          <div className="p-3.5 bg-parchment-50 rounded-xl border border-ink-950/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-950 font-display block uppercase">Zero Ads & Zero Data Brokering</strong>
              CAPSTONE is engineered as an ad-free cognitive health tool. User sessions and reaction telemetry are never commodified or sold to third parties.
            </div>
          </div>

          <div className="p-3.5 bg-parchment-50 rounded-xl border border-ink-950/20 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-ink-950 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-950 font-display block uppercase">No AI/ML Training Opt-Out Games</strong>
              Your reaction speeds, Dual N-Back matrices, and focus logs are never scraped into large multimodal foundation models.
            </div>
          </div>

          <div className="p-3.5 bg-parchment-50 rounded-xl border border-ink-950/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-labYellow flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink-950 font-display block uppercase">Future Full-Stack Security Architecture</strong>
              In the upcoming full-stack release, the Spring Boot REST API will utilize role-based authentication, BCrypt password hashing, and encrypted MySQL records.
            </div>
          </div>

          <div className="pt-4 border-t border-ink-950/20 flex justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-ink-950 text-white font-mono text-xs font-bold uppercase hover:bg-ink-800 shadow-brutal cursor-pointer"
            >
              Acknowledged
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
