# Fluxi — Cognitive Stamina & Focus Lab

An interactive, responsive cognitive training and memory assistance platform designed to improve working memory, attention, and cognitive endurance through adaptive drills and cultural familiarity.

> **🚀 Live Production Website (Vercel):** **[https://capstone-liart-pi.vercel.app](https://capstone-liart-pi.vercel.app)**
>
> **🌐 Live Local Preview:** Click to view locally at **[http://localhost:5173](http://localhost:5173)** *(when running `npm run dev`)*

Based on the **Stitch Design Reference**:
`web application/stitch/projects/10040129155542415846/screens/cd11bf3659dc438f846c77389da5a77b`

---

## 🚀 Live Demonstration Features

### 1. Visual Identity & Editorial Design System
- **Accurate Aesthetic:** Hand-drawn architectural line drawings, isometric grids, and bold brutalist typography (`Space Grotesk`, `Inter`, and `JetBrains Mono`).
- **Color Palette:** Warm ivory/parchment background (`#F4F3EE`), crisp jet black borders (`#121316`), vibrant amber/signal yellow highlights (`#F5B800`), with mint green, lavender, and sky blue metric badges.
- **Strict Compliance:** Zero purple/violet styling; no generic AI sparkles or distracting video noise.

### 2. Interactive 3D Cognitive Lattice
- **Three.js Isometric Monolith:** Floating wireframe neural cube and icosahedron with animated signal nodes and orbital ring that smoothly respond to pointer coordinates.
- **Accessibility & Reduced Motion:** Automatically switches to a static architectural SVG blueprint when reduced motion is preferred or if WebGL is unavailable.

### 3. Tactical Radar & Distraction Countermeasures
- **Interactive Floor Plan:** Architectural coordinate field populated with active distraction agents (`AGENT 01` through `AGENT 07`).
- **Actionable Countermeasures:** Click on any agent to drop an isometric shield countermeasure, emit a Web Audio ping, gain +350 PTS, and stabilize the cognitive buffer.
- **Dynamic Telemetry:** Real-time adjustments to Focus Tax (`[-]` and `[+]` steppers) and Daily Focus Fee slider.

### 4. Playable Lab Drill Runner (All 4 Cognitive Pillars)
Launchable directly from the Hero, Navbar, or Cognitive Pillar cards:
1. **01 Dual N-Back Span:** 3×3 visual position and auditory letter memory matrix across 5 rounds.
2. **02 Inhibitory Control:** Cognitive Stroop test to suppress involuntary word-reading reflexes and identify ink colors.
3. **03 Facial Associator:** Rapid-fire retrieval of medical/engineering profiles and traits under brief exposure.
4. **04 Synaptic Velocity:** Millisecond-accurate reaction speed challenge measuring physical response latency (+187 MS).
- Includes **canvas-confetti** celebration, score tallying, and session recording.

### 5. Interactive Drill Simulator Window
- macOS-style retro window frame with Stages 1 through 4 (`DISTRACT THEM BEFORE THEY CLOG`).
- Full interactive `NEXT STEP →` and `SKIP` controls with state transitions and audio feedback.

### 6. Tactile Audio & Global Keyboard Controls
- **Web Audio Tone Synthesizer:** Gentle, non-jarring acoustic feedback for clicks, radar pings, and match chimes (no heavy external audio files).
- **Audio Toggle:** Mute/unmute button in navbar and preferences modal.
- **Spacebar Shortcut:** Pressing `[SPACE]` anywhere on the page instantly triggers quick focus action.

### 7. Multi-Language & Accessibility Controls
- Language switcher supporting **English**, **Marathi (मराठी)**, and **Hindi (हिंदी)**.
- Reduced motion toggle and high-contrast accessibility mode.
- Protocol Status Drawer showing the 20-stage clinical session matrix and 0:59 interval countdown.

---

## 🛠️ Technical Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom brutalist design tokens
- **3D Graphics:** Three.js with lightweight wireframe geometries
- **Animations:** Framer Motion with spring physics and layout transitions
- **Icons:** Lucide React
- **Audio:** Web Audio API Native Synthesizer
- **Celebration Effects:** Canvas Confetti

---

## 📂 Project Architecture

```
capstone/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── HeaderNavbar.tsx          # Top navigation with live telemetry & quick actions
│   │       ├── ArchitecturalHeroArt.tsx  # Architectural boots/perspective line-art vector
│   │       ├── BottomCTASection.tsx      # "Start your 10-minute drill now" + Back to Top
│   │       ├── Footer.tsx                # Footer with spacebar guide and protocol links
│   │       └── ToastContainer.tsx        # Brutalist dismissible toast feedback
│   ├── features/
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx           # Display headline, CTAs, badges, and layout
│   │   │   └── Hero3DCanvas.tsx          # Three.js 3D cognitive wireframe lattice
│   │   ├── radar/
│   │   │   └── TacticalRadarBoard.tsx    # Interactive agent radar field & focus tax
│   │   ├── pillars/
│   │   │   └── CognitivePillarsSection.tsx # The 4 Cognitive Pillars cards & triggers
│   │   ├── simulator/
│   │   │   └── DrillSimulatorSection.tsx # Why Isometric Stress Drills Work & Stage runner
│   │   ├── testimonials/
│   │   │   └── ObservedEffectsSection.tsx # Speech bubble cohort testimonials
│   │   ├── drills/
│   │   │   └── LabDrillModal.tsx         # Playable 4-mode neuro drill runner & score keeper
│   │   └── modals/
│   │       ├── TutorialModal.tsx         # Interactive onboarding walkthrough
│   │       ├── SettingsPreferencesModal.tsx # Audio, language (EN/MR/HI), motion, tax settings
│   │       ├── ProtocolDrawerModal.tsx   # Clinical protocol status & 20-stage matrix
│   │       └── PrivacyProtocolModal.tsx  # Privacy & neuro protocol disclosures
│   ├── services/
│   │   └── api.ts                        # Clean abstraction layer for future Spring Boot REST API
│   ├── data/
│   │   └── mockData.ts                   # Centralized mock telemetry, pillars, agents, testimonials
│   ├── hooks/
│   │   └── useSpacebarInteraction.ts     # Global spacebar shortcut handler
│   ├── utils/
│   │   └── audio.ts                      # Web Audio tone synthesizer
│   ├── types/
│   │   └── index.ts                      # TypeScript type definitions
│   ├── App.tsx                           # Master application controller
│   ├── index.css                         # Tailwind directives & brutalist utility classes
│   └── main.tsx                          # React entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🏃 Running the Application Locally

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Commands
```bash
# Navigate to the capstone directory
cd capstone

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

### 🌐 View the Website
Once started, open your browser and go to:
👉 **[http://localhost:5173](http://localhost:5173)**

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Future Spring Boot REST Backend Integration Guide

The frontend service layer (`src/services/api.ts`) is designed so that swapping mock storage with a real backend requires changing only the endpoints in `api.ts`:

1. **Authentication:**
   - `POST /api/auth/register`
   - `POST /api/auth/login`
2. **Telemetry & Profiles:**
   - `GET /api/telemetry` → returns user recall balance, velocity, and error drift.
   - `PUT /api/telemetry` → updates focus tax and daily allocation.
   - `GET /api/profiles/{id}` → loads customized difficulty parameters.
3. **Drill Sessions:**
   - `POST /api/games/sessions` → persists completed sessions (score, accuracy, duration, timestamp) into MySQL.
   - `GET /api/profiles/{id}/sessions` → retrieves user activity history.
4. **Radar Countermeasures:**
   - `POST /api/radar/countermeasure` → logs neutralized distraction vectors.
>>>>>>> 93ba769 (Initial commit: CAPSTONE Frontend Cognitive Stamina & Focus Lab website with comprehensive README)
