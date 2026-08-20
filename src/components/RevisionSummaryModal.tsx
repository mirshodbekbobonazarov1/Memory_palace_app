import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  BrainCircuit,
  Award
} from 'lucide-react';
import { MemorySlot } from '../types';

interface RevisionSummaryModalProps {
  isOpen: boolean;
  scoreGained: number;
  totalPoints: number;
  results: { 
    slotId: string; 
    remembered: boolean;
    userAnswer?: string;
    expectedAnswer?: string;
  }[];
  slots: MemorySlot[];
  onRestart: () => void;
  onClose: () => void;
}

export const RevisionSummaryModal: React.FC<RevisionSummaryModalProps> = ({
  isOpen,
  scoreGained,
  totalPoints,
  results,
  slots,
  onRestart,
  onClose,
}) => {
  const rememberedCount = results.filter((r) => r.remembered).length;
  const totalCount = results.length || 5;
  const percentage = Math.round((rememberedCount / totalCount) * 100);

  useEffect(() => {
    if (isOpen && percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error('Confetti trigger error:', e);
      }
    }
  }, [isOpen, percentage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="revision-summary-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      >
        <motion.div
          id="revision-summary-dialog"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-slate-800"
        >
          {/* Trophy & Badge */}
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm ring-4 ring-amber-50">
            <Trophy className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Revision Complete!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            You walked through all loci in your 2D Memory Palace.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Accuracy
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {percentage}%
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                {rememberedCount} of {totalCount} recalled
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Points Earned
              </span>
              <span className="text-2xl font-black text-amber-600 font-mono">
                +{scoreGained}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Total: {totalPoints} pts
              </span>
            </div>
          </div>

          {/* Breakdown List of Slots */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-6 text-left max-h-48 overflow-y-auto space-y-2">
            {results.map((res, i) => {
              const matchedSlot = slots.find((s) => s.id === res.slotId);
              return (
                <div
                  key={res.slotId || i}
                  className="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {matchedSlot ? matchedSlot.name : `Slot ${i + 1}`}
                    </span>
                    {res.remembered ? (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Recalled (+10)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-semibold border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Missed
                      </span>
                    )}
                  </div>
                  {res.userAnswer && (
                    <p className="text-[11px] text-slate-500 truncate">
                      You entered: <span className="font-medium text-slate-700">&ldquo;{res.userAnswer}&rdquo;</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              id="restart-revision-btn"
              onClick={onRestart}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Revise Again
            </button>

            <button
              id="close-summary-btn"
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              Back to Palace
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
