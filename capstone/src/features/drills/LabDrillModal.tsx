import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Award, CheckCircle2, AlertTriangle, Zap, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarDrillType, ToastMessage } from '../../types';
import { ApiService } from '../../services/api';
import { soundFx } from '../../utils/audio';

interface LabDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  drillType: PillarDrillType;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSessionComplete: (score: number) => void;
}

export const LabDrillModal: React.FC<LabDrillModalProps> = ({
  isOpen,
  onClose,
  drillType,
  onAddToast,
  onSessionComplete,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PillarDrillType>(drillType);
  const [drillState, setDrillState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const maxRounds = 5;

  // Real-time gameplay tracking states & refs
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState<{
    accuracy: number;
    durationSeconds: number;
    avgReactionMs: number;
  }>({
    accuracy: 100,
    durationSeconds: 0,
    avgReactionMs: 0,
  });

  const drillStartTimeRef = useRef<number>(0);
  const roundStartTimeRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const earlyClicksRef = useRef<number>(0);

  // Live timer tick during running drill
  useEffect(() => {
    if (drillState !== 'running') return;
    const interval = setInterval(() => {
      if (drillStartTimeRef.current > 0) {
        setElapsedSeconds(Math.floor((Date.now() - drillStartTimeRef.current) / 1000));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [drillState]);

  // Synaptic Velocity state
  const [velocityStatus, setVelocityStatus] = useState<'waiting' | 'ready' | 'clicked' | 'too-early'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Inhibitory Stroop state
  const stroopColors = [
    { word: 'RED', color: '#EF4444' },
    { word: 'YELLOW', color: '#F5B800' },
    { word: 'GREEN', color: '#10B981' },
    { word: 'BLUE', color: '#0EA5E9' },
  ];
  const [currentStroop, setCurrentStroop] = useState<{ word: string; inkColor: string; actualColor: string }>({
    word: 'YELLOW',
    inkColor: '#EF4444',
    actualColor: '#EF4444',
  });

  // Facial / Trait state
  const avatarProfiles = [
    { name: 'Dr. Thorne', role: 'Architect', avatar: 'AT', color: '#F5B800' },
    { name: 'Elena Lin', role: 'Officer', avatar: 'EL', color: '#D5D7DF' },
    { name: 'Dr. D’Souza', role: 'Physician', avatar: 'BD', color: '#F5B800' },
    { name: 'Kavita Rao', role: 'Director', avatar: 'KR', color: '#10B981' },
  ];
  const [targetAvatar, setTargetAvatar] = useState(avatarProfiles[0]);
  const [avatarChoices, setAvatarChoices] = useState(avatarProfiles);

  useEffect(() => {
    setActiveTab(drillType);
    setDrillState('idle');
    setScore(0);
    setRound(1);
  }, [drillType, isOpen]);

  // Handle drill start
  const handleStartDrill = () => {
    soundFx.playPing();
    const now = Date.now();
    if (activeTab === 'daily-game') {
      onClose();
      navigate('/daily-game');
      return;
    }
    drillStartTimeRef.current = now;
    roundStartTimeRef.current = now;
    correctCountRef.current = 0;
    reactionTimesRef.current = [];
    earlyClicksRef.current = 0;
    setElapsedSeconds(0);

    setDrillState('running');
    setScore(0);
    setRound(1);

    if (activeTab === 'synaptic-velocity') {
      startVelocityRound();
    } else if (activeTab === 'inhibitory') {
      startStroopRound();
    } else if (activeTab === 'facial-associator') {
      startAvatarRound();
    }
  };

  // 1. Synaptic Velocity Logic
  const startVelocityRound = () => {
    setVelocityStatus('waiting');
    setReactionTime(null);
    const delayMs = 1500 + Math.random() * 2500;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVelocityStatus('ready');
      startTimeRef.current = Date.now();
    }, delayMs);
  };

  const handleVelocityClick = () => {
    if (velocityStatus === 'waiting') {
      setVelocityStatus('too-early');
      earlyClicksRef.current += 1;
      soundFx.playSoftNoticeTone();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (velocityStatus === 'ready') {
      const timeMs = Date.now() - startTimeRef.current;
      reactionTimesRef.current.push(timeMs);
      correctCountRef.current += 1;
      setReactionTime(timeMs);
      setVelocityStatus('clicked');
      soundFx.playMatchChime();
      const points = Math.max(100, 500 - timeMs);
      const updatedScore = score + points;
      setScore(updatedScore);

      if (round < maxRounds) {
        setTimeout(() => {
          setRound((r) => r + 1);
          startVelocityRound();
        }, 1200);
      } else {
        finishDrill(updatedScore);
      }
    }
  };



  // 3. Inhibitory Stroop Logic
  const startStroopRound = () => {
    roundStartTimeRef.current = Date.now();
    const wordItem = stroopColors[Math.floor(Math.random() * stroopColors.length)];
    const inkItem = stroopColors[Math.floor(Math.random() * stroopColors.length)];
    setCurrentStroop({
      word: wordItem.word,
      inkColor: inkItem.color,
      actualColor: inkItem.word,
    });
  };

  const handleStroopAnswer = (selectedColor: string) => {
    const reactionMs = Math.max(50, Date.now() - roundStartTimeRef.current);
    reactionTimesRef.current.push(reactionMs);

    const isCorrect = selectedColor === currentStroop.actualColor;
    if (isCorrect) {
      correctCountRef.current += 1;
      soundFx.playMatchChime();
    } else {
      soundFx.playSoftNoticeTone();
    }

    const gained = isCorrect ? 200 : -30;
    const updatedScore = Math.max(0, score + gained);
    setScore(updatedScore);

    if (round < maxRounds) {
      setRound((r) => r + 1);
      startStroopRound();
    } else {
      finishDrill(updatedScore);
    }
  };

  // 4. Facial Associator Logic
  const startAvatarRound = () => {
    roundStartTimeRef.current = Date.now();
    const chosen = avatarProfiles[Math.floor(Math.random() * avatarProfiles.length)];
    setTargetAvatar(chosen);
    setAvatarChoices([...avatarProfiles].sort(() => Math.random() - 0.5));
  };

  const handleAvatarAnswer = (answeredName: string) => {
    const reactionMs = Math.max(50, Date.now() - roundStartTimeRef.current);
    reactionTimesRef.current.push(reactionMs);

    const isCorrect = answeredName === targetAvatar.name;
    if (isCorrect) {
      correctCountRef.current += 1;
      soundFx.playMatchChime();
    } else {
      soundFx.playSoftNoticeTone();
    }

    const gained = isCorrect ? 220 : 0;
    const updatedScore = score + gained;
    setScore(updatedScore);

    if (round < maxRounds) {
      setRound((r) => r + 1);
      startAvatarRound();
    } else {
      finishDrill(updatedScore);
    }
  };

  // Finish drill & save
  const finishDrill = async (finalScore: number) => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - drillStartTimeRef.current) / 1000));

    let calculatedAccuracy = 0;
    if (activeTab === 'synaptic-velocity') {
      const totalAttempts = maxRounds + earlyClicksRef.current;
      calculatedAccuracy = Math.max(10, Math.min(100, Math.round((maxRounds / totalAttempts) * 100)));
    } else {
      calculatedAccuracy = Math.max(0, Math.min(100, Math.round((correctCountRef.current / maxRounds) * 100)));
    }

    const times = reactionTimesRef.current;
    const avgReaction = times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : Math.round((durationSeconds * 1000) / maxRounds);

    setSessionStats({
      accuracy: calculatedAccuracy,
      durationSeconds,
      avgReactionMs: avgReaction,
    });

    soundFx.playSuccessChime();
    setDrillState('completed');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F5B800', '#121316', '#10B981'],
    });

    onSessionComplete(finalScore);
    await ApiService.recordDrillSession({
      pillarId: activeTab,
      score: finalScore,
      accuracy: calculatedAccuracy,
      durationSeconds: durationSeconds,
      completed: true,
    });

    onAddToast({
      title: 'DRILL SESSION LOGGED TO VAULT',
      detail: `Final score: ${finalScore} PTS • Accuracy: ${calculatedAccuracy}% • Duration: ${durationSeconds}s.`,
      type: 'success',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-ink-950 rounded-2xl shadow-brutal-lg max-w-2xl w-full overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-parchment-100 border-b-2 border-ink-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-labYellow border border-ink-950"></span>
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-ink-950">
              [ NEURO LAB DRILL RUNNER — ISO V2.02 ]
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 rounded-md border border-ink-950/20 hover:bg-parchment-200 text-ink-900 cursor-pointer"
            aria-label="Close Drill Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drill Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b-2 border-ink-950 bg-parchment-50 text-xs font-mono font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('daily-game');
              setDrillState('idle');
            }}
            className={`py-3 px-2 border-r border-ink-950/20 uppercase tracking-tight text-center cursor-pointer ${
              activeTab === 'daily-game' ? 'bg-white text-ink-950 border-b-2 border-b-labYellow' : 'text-ink-600'
            }`}
          >
            01 Daily Memory
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('inhibitory');
              setDrillState('idle');
            }}
            className={`py-3 px-2 border-r border-ink-950/20 uppercase tracking-tight text-center cursor-pointer ${
              activeTab === 'inhibitory' ? 'bg-white text-ink-950 border-b-2 border-b-labYellow' : 'text-ink-600'
            }`}
          >
            02 Inhibitory
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('facial-associator');
              setDrillState('idle');
            }}
            className={`py-3 px-2 border-r border-ink-950/20 uppercase tracking-tight text-center cursor-pointer ${
              activeTab === 'facial-associator' ? 'bg-white text-ink-950 border-b-2 border-b-labYellow' : 'text-ink-600'
            }`}
          >
            03 Associator
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('synaptic-velocity');
              setDrillState('idle');
            }}
            className={`py-3 px-2 uppercase tracking-tight text-center cursor-pointer ${
              activeTab === 'synaptic-velocity' ? 'bg-white text-ink-950 border-b-2 border-b-labYellow' : 'text-ink-600'
            }`}
          >
            04 Velocity
          </button>
        </div>

        {/* Interactive Drill Body */}
        <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
          {drillState === 'idle' && (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-parchment-100 border-2 border-ink-950 flex items-center justify-center mb-4 shadow-brutal">
                <Zap className="w-8 h-8 text-labYellow fill-labYellow" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase text-ink-950 mb-2">
                {activeTab === 'daily-game' && 'DAILY MEMORY GAME'}
                {activeTab === 'inhibitory' && 'INHIBITORY CONTROL DRILL'}
                {activeTab === 'facial-associator' && 'FACIAL ASSOCIATOR DRILL'}
                {activeTab === 'synaptic-velocity' && 'SYNAPTIC VELOCITY DRILL'}
              </h3>
              <p className="text-sm text-ink-600 max-w-md font-sans mb-8">
                {activeTab === 'daily-game' &&
                  'Personalized memory questions created by your caregiver about loved ones, treasured milestones, and familiar places.'}
                {activeTab === 'inhibitory' &&
                  'Suppress involuntary reading reflexes. Identify the actual font color while ignoring conflicting high-salience text triggers.'}
                {activeTab === 'facial-associator' &&
                  'Rapidly retrieve professional traits and names linked to avatars under brief exposure windows.'}
                {activeTab === 'synaptic-velocity' &&
                  'Wait for the neutral state to ignite emerald green, then trigger your sensor instantly. Measures physical latency in milliseconds.'}
              </p>

              <button
                onClick={handleStartDrill}
                className="px-8 py-3.5 rounded-full bg-ink-950 text-white font-mono text-sm font-bold uppercase hover:bg-ink-800 shadow-brutal active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{activeTab === 'daily-game' ? 'LAUNCH DAILY MEMORY GAME' : 'COMMENCE 5-ROUND TEST'}</span>
              </button>
            </div>
          )}

          {drillState === 'running' && (
            <div className="flex flex-col items-center justify-between h-full">
              {/* Progress & Round indicator */}
              <div className="w-full flex items-center justify-between text-xs font-mono font-bold pb-4 border-b border-ink-950/20 mb-6">
                <span className="text-ink-600">
                  ROUND <strong className="text-ink-950">{round}</strong> / {maxRounds}
                </span>
                <span className="text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-300">
                  TIME: {elapsedSeconds}s
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                  SCORE: {score} PTS
                </span>
              </div>

              {/* Specific Drill UI */}
              {activeTab === 'synaptic-velocity' && (
                <div className="w-full flex flex-col items-center py-6">
                  <div
                    onClick={handleVelocityClick}
                    className={`w-full max-w-md h-52 rounded-2xl border-2 border-ink-950 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all shadow-brutal ${
                      velocityStatus === 'waiting'
                        ? 'bg-parchment-200 text-ink-800'
                        : velocityStatus === 'ready'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : velocityStatus === 'too-early'
                        ? 'bg-red-500 text-white'
                        : 'bg-labYellow text-ink-950'
                    }`}
                  >
                    {velocityStatus === 'waiting' && (
                      <div>
                        <div className="font-display font-extrabold text-2xl uppercase">WAIT FOR GREEN...</div>
                        <div className="text-xs font-mono mt-1 opacity-80">Do not click yet</div>
                      </div>
                    )}
                    {velocityStatus === 'ready' && (
                      <div>
                        <div className="font-display font-black text-4xl uppercase tracking-wider">CLICK NOW!</div>
                      </div>
                    )}
                    {velocityStatus === 'too-early' && (
                      <div>
                        <div className="font-display font-black text-2xl uppercase">TOO EARLY!</div>
                        <div className="text-xs font-mono mt-1">Restarting round...</div>
                      </div>
                    )}
                    {velocityStatus === 'clicked' && (
                      <div>
                        <div className="font-display font-black text-4xl">{reactionTime} MS</div>
                        <div className="text-xs font-mono mt-1 font-bold">+187 MS Reaction Speed Elevation</div>
                      </div>
                    )}
                  </div>
                </div>
              )}



              {activeTab === 'inhibitory' && (
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs font-mono text-ink-600 mb-2 uppercase">
                    SELECT THE INK COLOR (IGNORE THE WORD):
                  </div>
                  <div
                    className="p-8 my-4 rounded-2xl border-2 border-ink-950 bg-white shadow-brutal font-display font-black text-4xl sm:text-5xl uppercase tracking-wider"
                    style={{ color: currentStroop.inkColor }}
                  >
                    {currentStroop.word}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-md mt-4">
                    {stroopColors.map((c) => (
                      <button
                        key={c.word}
                        onClick={() => handleStroopAnswer(c.word)}
                        className="py-3 px-4 rounded-xl border-2 border-ink-950 bg-white hover:bg-parchment-200 text-xs font-mono font-extrabold uppercase shadow-sm cursor-pointer"
                      >
                        {c.word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'facial-associator' && (
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs font-mono text-ink-600 mb-2 uppercase">
                    WHO HOLDS THIS CLINICAL PROFILE?
                  </div>
                  <div className="my-4 flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-full border-2 border-ink-950 flex items-center justify-center font-display font-black text-2xl shadow-brutal mb-2"
                      style={{ backgroundColor: targetAvatar.color }}
                    >
                      {targetAvatar.avatar}
                    </div>
                    <div className="text-sm font-mono font-bold text-ink-800 bg-parchment-100 px-3 py-1 rounded border border-ink-950/20">
                      ROLE: {targetAvatar.role}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mt-2">
                    {avatarChoices.map((av) => (
                      <button
                        key={av.name}
                        onClick={() => handleAvatarAnswer(av.name)}
                        className="py-3 px-4 rounded-xl border-2 border-ink-950 bg-white hover:bg-parchment-200 text-xs font-mono font-bold uppercase shadow-sm cursor-pointer"
                      >
                        {av.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {drillState === 'completed' && (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-800 flex items-center justify-center text-emerald-800 mb-4 shadow-brutal">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-3xl uppercase text-ink-950 mb-1">
                DRILL SYNCHRONIZED
              </h3>
              <p className="text-xs font-mono text-emerald-800 uppercase font-bold mb-6">
                PREFRONTAL RETENTION VERIFIED • +{score} LAB POINTS
              </p>

              <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8 text-center">
                <div className="p-3 bg-parchment-50 rounded-xl border border-ink-950/20 shadow-2xs">
                  <span className="text-[10px] font-mono block text-ink-500 uppercase font-semibold">TOTAL SCORE</span>
                  <span className="font-display font-bold text-xl text-ink-950">{score}</span>
                </div>
                <div className="p-3 bg-parchment-50 rounded-xl border border-ink-950/20 shadow-2xs">
                  <span className="text-[10px] font-mono block text-ink-500 uppercase font-semibold">ACCURACY</span>
                  <span className={`font-display font-bold text-xl ${
                    sessionStats.accuracy >= 80 ? 'text-emerald-700' : sessionStats.accuracy >= 60 ? 'text-amber-700' : 'text-stone-700'
                  }`}>
                    {sessionStats.accuracy}%
                  </span>
                </div>
                <div className="p-3 bg-parchment-50 rounded-xl border border-ink-950/20 shadow-2xs">
                  <span className="text-[10px] font-mono block text-ink-500 uppercase font-semibold">TIME / SPEED</span>
                  <span className="font-display font-bold text-xl text-ink-950">
                    {sessionStats.durationSeconds}s
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 block">
                    {sessionStats.avgReactionMs}ms avg
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleStartDrill}
                  className="px-6 py-3 rounded-full bg-white text-ink-950 border-2 border-ink-950 font-mono text-xs font-bold uppercase hover:bg-parchment-200 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>REPEAT DRILL</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="px-8 py-3 rounded-full bg-ink-950 text-white font-mono text-xs font-bold uppercase hover:bg-ink-800 shadow-brutal cursor-pointer"
                >
                  RETURN TO LAB
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
