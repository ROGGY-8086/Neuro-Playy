import {
  TelemetryState,
  CognitivePillar,
  RadarAgent,
  SimulatorStage,
  CohortTestimonial,
} from '../types';

export const initialTelemetry: TelemetryState = {
  recallBalance: 9.16, // In Billions
  perSecondGain: 214.1, // In Millions
  velocity: '154.3M/SEC',
  errorDriftIndex: '0.384 [-1.2%]',
  dailyFocusFee: 124,
  focusTax: 15,
  dailyModelRamp: 85,
  xpPerMin: 3450,
  streak: 7.2,
  driftReduction: 78,
  ratValue: 21.43,
  nodeId: '08/A',
  protocolStatus: 'EXTENDED DRILL V2.3',
  isEscalating: true,
};

export const cognitivePillars: CognitivePillar[] = [
  {
    id: 'pillar-1',
    number: '01',
    title: 'DUAL N-BACK SPAN',
    iconName: 'target',
    description:
      'Train simultaneous auditory and spatial buffers to keep three-tier data points ready in conscious memory without errors.',
    metricLabel: 'RECALL GAIN',
    metricValue: '+48.2%',
    metricType: 'recall',
    accentColor: '#10B981',
    drillType: 'dual-n-back',
  },
  {
    id: 'pillar-2',
    number: '02',
    title: 'INHIBITORY CONTROL',
    iconName: 'lightbulb',
    description:
      'Suppress involuntary gaze tracking and notification triggers. Learn to ignore high-contrast distractions right as they spawn.',
    metricLabel: 'DISTRACTION LOSS',
    metricValue: '-62.4%',
    metricType: 'distraction',
    accentColor: '#F5B800',
    drillType: 'inhibitory',
  },
  {
    id: 'pillar-3',
    number: '03',
    title: 'FACIAL ASSOCIATOR',
    iconName: 'badge',
    description:
      'Rapid-fire accurate retrieval of names, project traits, and stressful avatars under time stress.',
    metricLabel: 'SOCIAL RETENTION',
    metricValue: '+54.0%',
    metricType: 'retention',
    accentColor: '#0EA5E9',
    drillType: 'facial-associator',
  },
  {
    id: 'pillar-4',
    number: '04',
    title: 'SYNAPTIC VELOCITY',
    iconName: 'zap',
    description:
      'Milliseconds matter. Shrink the cognitive latency between sensory recognition and physical decision-making loops.',
    metricLabel: 'REACTION SPEED',
    metricValue: '+187 MS',
    metricType: 'velocity',
    accentColor: '#A855F7',
    drillType: 'synaptic-velocity',
  },
];

export const initialRadarAgents: RadarAgent[] = [
  {
    id: 1,
    label: 'AGENT 01',
    x: 22,
    y: 36,
    status: 'threat',
    speech: 'Unread Slack Ping [URGENT]',
    decayTime: 12,
  },
  {
    id: 2,
    label: 'AGENT 02',
    x: 35,
    y: 28,
    status: 'active',
    speech: 'Chrome Tab 47 Memory Leak',
    decayTime: 18,
  },
  {
    id: 3,
    label: 'AGENT 03',
    x: 48,
    y: 20,
    status: 'active',
    speech: 'Calendar 5m Reminder',
    decayTime: 9,
  },
  {
    id: 4,
    label: 'AGENT 04',
    x: 68,
    y: 40,
    status: 'threat',
    speech: 'Social Feed Red Dot',
    decayTime: 14,
  },
  {
    id: 5,
    label: 'AGENT 05',
    x: 75,
    y: 56,
    status: 'active',
    speech: 'Email Newsletter Inflow',
    decayTime: 22,
  },
  {
    id: 6,
    label: 'AGENT 06',
    x: 32,
    y: 72,
    status: 'threat',
    speech: 'Phone Haptic Buzz',
    decayTime: 10,
  },
  {
    id: 7,
    label: 'AGENT 07',
    x: 44,
    y: 65,
    status: 'active',
    speech: 'Peripheral Screen Glare',
    decayTime: 16,
  },
];

export const simulatorStages: SimulatorStage[] = [
  {
    step: 1,
    maxSteps: 4,
    title: 'PERIPHERAL SENSORY FILTER',
    instruction:
      'Identify baseline noise signatures and lock focus onto target frequency anchors.',
    targetCount: 3,
    completed: true,
  },
  {
    step: 2,
    maxSteps: 4,
    title: 'DISTRACT THEM BEFORE THEY CLOG',
    instruction:
      'Scan, identify, and formulate sound drop-ins when distraction corruptions reach thresholds. Keep out-of-focus elements low.',
    targetCount: 5,
    completed: false,
  },
  {
    step: 3,
    maxSteps: 4,
    title: 'CROSS-MODAL DUAL SYNCHRONIZATION',
    instruction:
      'Correlate simultaneous audio tone shifts with spatial coordinate triggers under isometric pressure.',
    targetCount: 6,
    completed: false,
  },
  {
    step: 4,
    maxSteps: 4,
    title: 'PREFRONTAL DRIFT ARREST',
    instruction:
      'Maintain maximum uninterrupted cognitive hold for 90 seconds while eliminating high-salience peripheral lures.',
    targetCount: 8,
    completed: false,
  },
];

export const cohortTestimonials: CohortTestimonial[] = [
  {
    id: 'test-1',
    quote:
      'I used to open browser tabs and instantly forget why. Two weeks into 10-day CAPSTONE and the cognitive reset is completely gone.',
    name: 'DR. AMIE THORNE',
    title: 'Design Systems Architect',
    avatar: 'AT',
    avatarBg: '#F5B800',
    streakDays: 42,
    scorePts: 14200,
  },
  {
    id: 'test-2',
    quote:
      'The doodle scenarios mixed with hard neuro-drills pushes working memory harder than clinical desktop software.',
    name: 'ELENA LIN',
    title: 'Chief Prod. Officer',
    avatar: 'EL',
    avatarBg: '#D5D7DF',
    streakDays: 19,
    scorePts: 11850,
  },
  {
    id: 'test-3',
    quote:
      'The fast-paced test teaches you how to ignore phone-pick focus. You literally feel the relief when you dispell distractions.',
    name: 'BRYON D’SOUZA',
    title: 'ER Physician',
    avatar: 'BD',
    avatarBg: '#F5B800',
    streakDays: 31,
    scorePts: 18600,
  },
];
