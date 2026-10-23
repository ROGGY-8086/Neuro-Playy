import React from 'react';

export const ArchitecturalHeroArt: React.FC = () => {
  return (
    <div className="absolute right-0 top-0 w-full md:w-3/5 h-full pointer-events-none overflow-hidden select-none opacity-90 z-0">
      <svg
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain object-right-top"
      >
        {/* Perspective grid floor lines */}
        <g stroke="#121316" strokeWidth="0.8" opacity="0.25">
          <line x1="100" y1="480" x2="600" y2="480" />
          <line x1="150" y1="420" x2="600" y2="420" />
          <line x1="200" y1="360" x2="600" y2="360" />
          <line x1="260" y1="300" x2="600" y2="300" />
          
          <line x1="50" y1="490" x2="320" y2="180" strokeDasharray="3 3" />
          <line x1="200" y1="490" x2="380" y2="180" strokeDasharray="3 3" />
          <line x1="380" y1="490" x2="450" y2="180" strokeDasharray="3 3" />
          <line x1="550" y1="490" x2="520" y2="180" strokeDasharray="3 3" />
        </g>

        {/* Technical Callout Badge for Protocol */}
        <g transform="translate(380, 50)">
          <rect x="0" y="0" width="84" height="20" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="1.2" />
          <text x="6" y="14" fill="#121316" fontFamily="monospace" fontSize="9" fontWeight="600">
            [PROTOCOL 02]
          </text>
        </g>

        {/* Architectural Hand-Drawn Boots / Steps Outline */}
        <g stroke="#121316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left Boot */}
          <path
            d="M390,70 L395,140 L410,180 L350,230 L330,225 L350,195 L375,170 L370,110 L370,70"
            fill="#FAF9F5"
            opacity="0.85"
          />
          <path d="M370,70 C370,55 390,55 390,70" strokeWidth="1.5" />
          {/* Boot tread and laces / hatched detail */}
          <path d="M330,225 L345,232 L400,195 L415,185" strokeWidth="2.5" />
          <line x1="380" y1="120" x2="392" y2="120" strokeWidth="1" />
          <line x1="382" y1="135" x2="395" y2="135" strokeWidth="1" />
          <line x1="385" y1="150" x2="400" y2="150" strokeWidth="1" />

          {/* Right Boot (Forward step) */}
          <path
            d="M450,40 L455,120 L470,165 L525,210 L545,200 L505,160 L480,120 L475,40"
            fill="#FAF9F5"
            opacity="0.85"
          />
          <path d="M450,40 C450,25 475,25 475,40" strokeWidth="1.5" />
          {/* Right boot sole */}
          <path d="M470,165 L525,210 L545,200" strokeWidth="2.5" />
          {/* Vertical cuff ribbing */}
          <line x1="458" y1="42" x2="458" y2="90" strokeWidth="1" strokeDasharray="4 2" />
          <line x1="464" y1="42" x2="464" y2="90" strokeWidth="1" strokeDasharray="4 2" />
          <line x1="470" y1="42" x2="470" y2="90" strokeWidth="1" strokeDasharray="4 2" />
        </g>

        {/* Subtle walking figure silhouette */}
        <g transform="translate(140, 240)" opacity="0.7">
          <circle cx="10" cy="8" r="6" stroke="#121316" strokeWidth="1.5" fill="#F5B800" />
          <line x1="10" y1="14" x2="10" y2="30" stroke="#121316" strokeWidth="1.5" />
          <line x1="10" y1="18" x2="2" y2="25" stroke="#121316" strokeWidth="1.5" />
          <line x1="10" y1="18" x2="18" y2="24" stroke="#121316" strokeWidth="1.5" />
          <line x1="10" y1="30" x2="4" y2="44" stroke="#121316" strokeWidth="1.5" />
          <line x1="10" y1="30" x2="16" y2="44" stroke="#121316" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
