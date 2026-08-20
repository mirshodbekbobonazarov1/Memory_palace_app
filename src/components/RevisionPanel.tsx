import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemorySlot } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  RotateCcw,
  Send,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface RevisionPanelProps {
  slot: MemorySlot;
  currentIndex: number;
  totalCount: number;
  onAnswer: (remembered: boolean, userAnswer?: string) => void;
  onCancelRevision: () => void;
}

// Normalization & similarity matching helper
function checkAnswerMatch(userInput: string, slot: MemorySlot): boolean {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"¡¿]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const cleanInput = clean(userInput);
  if (!cleanInput) return false;

  const cleanContent = clean(slot.content || '');
  const cleanTitle = clean(slot.title || '');

  // Exact matches
  if (cleanInput === cleanContent) return true;
  if (cleanTitle && cleanInput === cleanTitle) return true;

  // Substring matching for phrases/vocab (minimum 3 chars to prevent trivial matches)
  if (cleanInput.length >= 3) {
    if (cleanContent.includes(cleanInput)) return true;
    if (cleanInput.includes(cleanContent) && cleanContent.length >= 3) return true;
    if (cleanTitle && cleanTitle.includes(cleanInput)) return true;
  }

  // Token overlap check (e.g. key words in a sentence)
  const inputTokens = cleanInput.split(' ').filter((t) => t.length > 2);
  const contentTokens = cleanContent.split(' ').filter((t) => t.length > 2);
  
  if (inputTokens.length > 0 && contentTokens.length > 0) {
    const matchedTokens = inputTokens.filter((token) => contentTokens.includes(token));
    // If >= 60% of input words match content tokens
    if (matchedTokens.length / inputTokens.length >= 0.6) {
      return true;
    }
  }

  return false;
}

export const RevisionPanel: React.FC<RevisionPanelProps> = ({
  slot,
  currentIndex,
  totalCount,
  onAnswer,
  onCancelRevision,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasContent = Boolean(slot.content && slot.content.trim().length > 0);

  // Auto-focus input when slot changes
  useEffect(() => {
    setUserAnswer('');
    setSubmittedStatus('unanswered');
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [slot.id]);

  // Handle Answer Verification
  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submittedStatus !== 'unanswered') return;

    if (!userAnswer.trim()) {
      // If user submitted empty, treat as "I don't know / forgot"
      handleForgot();
      return;
    }

    const isMatch = checkAnswerMatch(userAnswer, slot);
    if (isMatch) {
      setSubmittedStatus('correct');
    } else {
      setSubmittedStatus('incorrect');
    }
  };

  // Handle "I Forgot / Reveal"
  const handleForgot = () => {
    setSubmittedStatus('incorrect');
  };

  // Proceed to next object
  const handleProceed = (remembered: boolean) => {
    onAnswer(remembered, userAnswer);
  };

  // Override to correct (in case of slight spelling variations user wants to accept)
  const handleOverrideCorrect = () => {
    setSubmittedStatus('correct');
  };

  const isLastObject = currentIndex + 1 >= totalCount;

  return (
    <motion.div
      id="revision-active-panel"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm relative overflow-hidden"
    >
      {/* Top stage header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
          <span className="font-bold text-slate-800">
            Object {currentIndex + 1} of {totalCount}: <span className="text-indigo-600">{slot.name}</span>
          </span>
        </div>
        <button
          id="exit-revision-btn"
          onClick={onCancelRevision}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Exit Revision
        </button>
      </div>

      {/* Main Recall Prompt & Input Form */}
      <div className="py-5 text-center flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          Active Spatial Recall Test
        </div>

        {/* Primary Prompt Question */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 tracking-tight">
          What value did you put to the <span className="text-indigo-600">{slot.name}</span>?
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
          Type the exact word, fact, definition, or keyword you anchored to this locus.
        </p>

        {/* Unanswered State: Interactive Input Box */}
        {submittedStatus === 'unanswered' && (
          <motion.form
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleCheckAnswer}
            className="w-full max-w-lg flex flex-col items-center gap-4 my-2"
          >
            {slot.title && (
              <div className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                Anchor Topic: <span className="font-semibold text-slate-700">{slot.title}</span>
              </div>
            )}

            <div className="w-full relative">
              <input
                ref={inputRef}
                id="revision-answer-input"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Type the stored value for ${slot.name}...`}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-inner transition-all text-center font-medium"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                type="submit"
                id="submit-answer-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all transform active:scale-95 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Check Answer
              </button>

              <button
                type="button"
                id="forgot-answer-btn"
                onClick={handleForgot}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                I Forgot (Show Answer)
              </button>
            </div>
          </motion.form>
        )}

        {/* Answered State: Feedback & Stored Value Card */}
        {submittedStatus !== 'unanswered' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg flex flex-col items-center gap-4 my-2"
          >
            {/* Feedback Banner */}
            {submittedStatus === 'correct' ? (
              <div 
                id="feedback-correct-banner"
                className="w-full p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between px-4 text-emerald-800 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold">
                    Correct match! You earned <span className="text-emerald-700 font-extrabold">+10 points</span>
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div 
                id="feedback-incorrect-banner"
                className="w-full p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between px-4 text-rose-800 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm font-bold">
                    {userAnswer.trim() ? 'Not quite a match' : 'Here is the stored memory:'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOverrideCorrect}
                  className="text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                  title="If you typed a valid synonym or alternative"
                >
                  I was right (+10 pts)
                </button>
              </div>
            )}

            {/* Answer comparison card */}
            <div className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 shadow-xs">
              {userAnswer.trim().length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Your Answer:
                  </span>
                  <p className={`text-sm font-semibold ${submittedStatus === 'correct' ? 'text-emerald-700' : 'text-slate-800 line-through opacity-80'}`}>
                    {userAnswer}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Stored at {slot.name}:
                </span>
                
                {slot.title && (
                  <span className="text-xs font-bold text-indigo-600 block mb-1">
                    {slot.title}
                  </span>
                )}

                {hasContent ? (
                  slot.contentType === 'image' ? (
                    <div className="flex flex-col items-center gap-2 my-2">
                      <img
                        src={slot.content}
                        alt={slot.title || 'Memory visual'}
                        className="max-h-48 w-auto object-contain rounded-xl border border-slate-200 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-xs text-slate-500 italic">Visual Anchor</p>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base font-semibold text-slate-900 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                      {slot.content}
                    </p>
                  )
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    (No item was stored in this slot yet.)
                  </p>
                )}
              </div>
            </div>

            {/* Primary Continue Button */}
            <div className="w-full flex justify-center pt-2">
              <button
                id="next-revision-slot-btn"
                onClick={() => handleProceed(submittedStatus === 'correct')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all transform active:scale-95"
              >
                <span>{isLastObject ? 'Finish Revision' : 'Next Object'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Dots Bar */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100">
        {Array.from({ length: totalCount }).map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-7 bg-indigo-600'
                : idx < currentIndex
                ? 'w-2 bg-emerald-500'
                : 'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

