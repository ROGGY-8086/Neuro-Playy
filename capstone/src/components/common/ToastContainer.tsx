import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isWarning = toast.type === 'warning';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-white border-2 border-ink-950 rounded-xl p-3.5 shadow-brutal flex items-start gap-3"
            >
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isWarning && <AlertCircle className="w-5 h-5 text-amber-500" />}
                {!isSuccess && !isWarning && <Info className="w-5 h-5 text-ink-950" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold tracking-wider text-ink-950 uppercase">
                  {toast.title}
                </div>
                {toast.detail && (
                  <p className="text-xs text-ink-700 mt-0.5 leading-relaxed font-sans">
                    {toast.detail}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-ink-500 hover:text-ink-950 p-1 -mr-1 -mt-1 rounded focus:outline-none"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
