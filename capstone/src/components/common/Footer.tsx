import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenProtocol: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenProtocol }) => {
  return (
    <footer className="bg-parchment-100 py-6 px-4 md:px-8 border-t border-ink-950/20 text-[11px] font-mono text-ink-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left credits */}
        <div className="text-center md:text-left">
          <span>Made with devotion for </span>
          <strong className="text-ink-950 font-bold">CAPSTONE LAB</strong>
          <span> — Inspired by high-gain cognitive architecture.</span>
        </div>

        {/* Right shortcuts and protocols */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white border border-ink-950/30 text-ink-900 font-bold text-[10px]">
            PRESS <kbd className="bg-parchment-200 px-1 rounded text-ink-950">[SPACE]</kbd> TO INTERACT
          </div>
          <button
            onClick={onOpenPrivacy}
            className="hover:text-ink-950 hover:underline transition-colors cursor-pointer"
          >
            Privacy Protocol
          </button>
          <span className="text-ink-400">|</span>
          <button
            onClick={onOpenProtocol}
            className="hover:text-ink-950 hover:underline transition-colors cursor-pointer"
          >
            Neuro Protocol
          </button>
          <span className="text-ink-400">|</span>
          <span className="text-emerald-700 font-bold">System Status: 100% Online</span>
        </div>
      </div>
    </footer>
  );
};
