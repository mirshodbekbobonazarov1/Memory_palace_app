import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Menu, 
  X, 
  BookMarked, 
  Flame, 
  Sliders, 
  Trash2,
  Check
} from 'lucide-react';
import { AppMode } from '../types';
import { PRESET_THEMES } from '../data/defaultSlots';

interface HeaderProps {
  points: number;
  streak: number;
  mode: AppMode;
  onStartRevision: () => void;
  onExitRevision: () => void;
  onResetPoints: () => void;
  onLoadPreset: (presetIndex: number) => void;
  onClearAllSlots: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  points,
  streak,
  mode,
  onStartRevision,
  onExitRevision,
  onResetPoints,
  onLoadPreset,
  onClearAllSlots,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-6 py-3.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Left: Points Counter & Streak */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            id="points-counter-badge"
            className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-2xl shadow-sm"
          >
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs uppercase font-semibold tracking-wider text-amber-800/80 hidden sm:inline">
                Score:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-950 font-mono tracking-tight">
                {points}
              </span>
              <span className="text-xs text-amber-700 font-medium">pts</span>
            </div>
          </div>

          {streak > 0 && (
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-xs font-semibold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>{streak} Streak</span>
            </div>
          )}
        </div>

        {/* Center: App Title / Mode indicator on larger screens */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            2D Memory Palace Prototype
          </h1>
          <span className="text-xs font-medium text-slate-600 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
            Method of Loci
          </span>
        </div>

        {/* Right: Revision Mode Action & Settings Menu */}
        <div className="flex items-center gap-2.5">
          {mode === 'explore' ? (
            <button
              id="start-revision-header-btn"
              onClick={onStartRevision}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Revision</span>
            </button>
          ) : (
            <button
              id="exit-revision-header-btn"
              onClick={onExitRevision}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              <span>Edit Palace</span>
            </button>
          )}

          {/* Settings / Menu Toggle Button */}
          <div className="relative">
            <button
              id="header-menu-toggle-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                id="header-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Palace Presets</p>
                </div>

                <div className="py-1 space-y-0.5">
                  {PRESET_THEMES.map((preset, idx) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onLoadPreset(idx);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-slate-700 group-hover:text-slate-900 font-medium truncate">
                        {preset.title}
                      </span>
                      <BookMarked className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="my-1 border-t border-slate-100" />

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onResetPoints();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-amber-50 text-amber-700 flex items-center gap-2 transition-colors font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset Points to 0</span>
                  </button>

                  <button
                    onClick={() => {
                      onClearAllSlots();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear All 5 Slots</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
