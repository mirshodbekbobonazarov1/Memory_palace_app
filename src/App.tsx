import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { MemorySlot, AppMode, RevisionSession } from './types';
import { INITIAL_SLOTS, PRESET_THEMES } from './data/defaultSlots';
import { Header } from './components/Header';
import { RoomCanvas } from './components/RoomCanvas';
import { SlotModal } from './components/SlotModal';
import { RevisionPanel } from './components/RevisionPanel';
import { RevisionSummaryModal } from './components/RevisionSummaryModal';
import { PalaceSlotsList } from './components/PalaceSlotsList';
import { 
  Play, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEYS = {
  SLOTS: 'memory_palace_slots_v1',
  POINTS: 'memory_palace_points_v1',
  STREAK: 'memory_palace_streak_v1',
};

export default function App() {
  // Slots State
  const [slots, setSlots] = useState<MemorySlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load slots from localStorage', e);
    }
    return INITIAL_SLOTS;
  });

  // Points State
  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      if (saved) {
        return parseInt(saved, 10) || 0;
      }
    } catch (e) {
      console.error('Failed to load points', e);
    }
    return 0;
  });

  // Streak State
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (saved) {
        return parseInt(saved, 10) || 0;
      }
    } catch (e) {
      console.error('Failed to load streak', e);
    }
    return 0;
  });

  // App Mode & Modal State
  const [mode, setMode] = useState<AppMode>('explore');
  const [editingSlot, setEditingSlot] = useState<MemorySlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Floating score toast animation trigger
  const [floatingScore, setFloatingScore] = useState<{ id: number; text: string } | null>(null);

  // Revision Session State
  const [revisionSession, setRevisionSession] = useState<RevisionSession>({
    activeSlotIndex: 0,
    isRevealed: false,
    totalSlots: INITIAL_SLOTS.length,
    results: [],
    isComplete: false,
  });

  const [sessionPointsGained, setSessionPointsGained] = useState(0);

  // Save to localStorage when slots change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.error('Error saving slots to storage', e);
    }
  }, [slots]);

  // Save to localStorage when points change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POINTS, points.toString());
    } catch (e) {
      console.error('Error saving points to storage', e);
    }
  }, [points]);

  // Save streak
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    } catch (e) {
      console.error('Error saving streak to storage', e);
    }
  }, [streak]);

  // Handle Slot Selection in Explore Mode vs Revision Mode
  const handleSelectSlot = (slot: MemorySlot, index: number) => {
    if (mode === 'explore') {
      setEditingSlot(slot);
      setIsModalOpen(true);
    } else {
      // In revision mode, jump to this object slot
      setRevisionSession((prev) => ({
        ...prev,
        activeSlotIndex: index,
        isRevealed: false,
      }));
    }
  };

  // Save edited slot
  const handleSaveSlot = (updatedSlot: MemorySlot) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s))
    );
  };

  // Clear a specific slot
  const handleClearSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, content: '', title: '', contentType: 'text' } : s
      )
    );
  };

  // Start Revision Mode
  const handleStartRevision = () => {
    setMode('revision');
    setSessionPointsGained(0);
    setRevisionSession({
      activeSlotIndex: 0,
      isRevealed: false,
      totalSlots: slots.length,
      results: [],
      isComplete: false,
    });
  };

  // Exit Revision Mode
  const handleExitRevision = () => {
    setMode('explore');
    setRevisionSession((prev) => ({ ...prev, isComplete: false }));
  };

  // Reveal current card in Revision Mode
  const handleReveal = () => {
    setRevisionSession((prev) => ({
      ...prev,
      isRevealed: true,
    }));
  };

  // Trigger confetti burst + floating points animation
  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#38bdf8', '#818cf8', '#f43f5e'],
      });
    } catch (e) {
      console.error('Confetti error', e);
    }

    setFloatingScore({
      id: Date.now(),
      text: '+10 pts',
    });

    setTimeout(() => {
      setFloatingScore(null);
    }, 1800);
  };

  // Handle Answer in Revision Mode (Remembered vs Forgot)
  const handleAnswer = (remembered: boolean, userAnswer?: string) => {
    const currentSlot = slots[revisionSession.activeSlotIndex];
    const newResults = [
      ...revisionSession.results,
      { 
        slotId: currentSlot.id, 
        remembered,
        userAnswer,
        expectedAnswer: currentSlot.content || currentSlot.title || '',
      },
    ];

    if (remembered) {
      const awardedPoints = 10;
      setPoints((prev) => prev + awardedPoints);
      setSessionPointsGained((prev) => prev + awardedPoints);
      setStreak((prev) => prev + 1);
      triggerSuccessCelebration();
    } else {
      setStreak(0);
    }

    // Advance to next slot or complete revision
    const nextIndex = revisionSession.activeSlotIndex + 1;
    if (nextIndex < slots.length) {
      setRevisionSession({
        activeSlotIndex: nextIndex,
        isRevealed: false,
        totalSlots: slots.length,
        results: newResults,
        isComplete: false,
      });
    } else {
      // Completed all slots
      setRevisionSession({
        activeSlotIndex: 0,
        isRevealed: false,
        totalSlots: slots.length,
        results: newResults,
        isComplete: true,
      });
    }
  };

  // Reset Points
  const handleResetPoints = () => {
    setPoints(0);
    setStreak(0);
  };

  // Load Preset
  const handleLoadPreset = (index: number) => {
    const preset = PRESET_THEMES[index];
    if (preset) {
      setSlots(preset.slots);
      setMode('explore');
    }
  };

  // Clear all slots
  const handleClearAllSlots = () => {
    setSlots((prev) =>
      prev.map((s) => ({
        ...s,
        content: '',
        title: '',
        contentType: 'text',
      }))
    );
  };

  const currentRevisionSlot =
    mode === 'revision' ? slots[revisionSession.activeSlotIndex] : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Persistent Header */}
      <Header
        points={points}
        streak={streak}
        mode={mode}
        onStartRevision={handleStartRevision}
        onExitRevision={handleExitRevision}
        onResetPoints={handleResetPoints}
        onLoadPreset={handleLoadPreset}
        onClearAllSlots={handleClearAllSlots}
      />

      {/* Floating "+10 pts" Score Animation Popup */}
      <AnimatePresence>
        {floatingScore && (
          <motion.div
            key={floatingScore.id}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: -35 }}
            exit={{ opacity: 0, scale: 0.9, y: -65 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 py-2 bg-emerald-600 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl shadow-emerald-600/30 border border-emerald-400 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 fill-white" />
            <span>{floatingScore.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Responsive Canvas & Interaction Viewport */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-6">
        
        {/* Memory Palace Room Section */}
        <section className="w-full flex flex-col items-center">
          <RoomCanvas
            slots={slots}
            mode={mode}
            activeSlotIndex={
              mode === 'revision' ? revisionSession.activeSlotIndex : null
            }
            onSelectSlot={handleSelectSlot}
            isRevealed={revisionSession.isRevealed}
          />
        </section>

        {/* Dynamic Context Panel below Room: Revision Mode vs Explore/Setup Mode */}
        {mode === 'revision' && currentRevisionSlot ? (
          <section className="w-full">
            <RevisionPanel
              slot={currentRevisionSlot}
              currentIndex={revisionSession.activeSlotIndex}
              totalCount={slots.length}
              onAnswer={handleAnswer}
              onCancelRevision={handleExitRevision}
            />
          </section>
        ) : (
          <section className="w-full flex flex-col gap-5">
            {/* Start Revision CTA Banner */}
            <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Ready to test your spatial recall?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Click any object to assign your memories, then start revision mode for active recall.
                  </p>
                </div>
              </div>

              <button
                id="start-revision-main-cta"
                onClick={handleStartRevision}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all transform active:scale-95 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Revision (5 Objects)
              </button>
            </div>

            {/* 5 Slots Overview List */}
            <PalaceSlotsList
              slots={slots}
              mode={mode}
              activeSlotIndex={null}
              onSelectSlot={handleSelectSlot}
            />

            {/* Educational Info Card on Method of Loci */}
            <div className="bg-slate-200/50 border border-slate-300/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-slate-600">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-900 font-semibold">Geometric Balance & Method of Loci:</strong> The ancient Roman/Greek memory palace technique leverages your brain&apos;s spatial navigation to anchor facts to physical structures. Link vivid ideas to each locus (Desk, Bookshelf, Lamp, Chair, Painting) to achieve instant mental retrieval!
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Setup / Edit Modal Popup */}
      <SlotModal
        slot={editingSlot}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveSlot}
        onClear={handleClearSlot}
      />

      {/* Revision Complete Modal */}
      <RevisionSummaryModal
        isOpen={revisionSession.isComplete}
        scoreGained={sessionPointsGained}
        totalPoints={points}
        results={revisionSession.results}
        slots={slots}
        onRestart={handleStartRevision}
        onClose={handleExitRevision}
      />
    </div>
  );
}
