import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemorySlot, AppMode } from '../types';
import { 
  Lamp, 
  Monitor, 
  BookOpen, 
  Image as ImageIcon, 
  Armchair, 
  Sparkles, 
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface RoomCanvasProps {
  slots: MemorySlot[];
  mode: AppMode;
  activeSlotIndex: number | null;
  onSelectSlot: (slot: MemorySlot, index: number) => void;
  isRevealed?: boolean;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  slots,
  mode,
  activeSlotIndex,
  onSelectSlot,
  isRevealed = false,
}) => {
  const activeSlot = activeSlotIndex !== null ? slots[activeSlotIndex] : null;

  // Compute zoom & pan transform based on active slot in revision mode
  let zoomScale = 1;
  let translateX = 0;
  let translateY = 0;

  if (mode === 'revision' && activeSlot) {
    zoomScale = 1.35;
    // Pan toward the object's percentage position (centered at 50,50)
    translateX = (50 - activeSlot.x) * 0.8;
    translateY = (50 - activeSlot.y) * 0.8;
  }

  const getSlotIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lamp':
        return <Lamp className="w-5 h-5" />;
      case 'desk':
        return <Monitor className="w-5 h-5" />;
      case 'bookshelf':
        return <BookOpen className="w-5 h-5" />;
      case 'painting':
        return <ImageIcon className="w-5 h-5" />;
      case 'chair':
        return <Armchair className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div 
      id="room-canvas-container"
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[520px] bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-md overflow-hidden border border-slate-200 select-none transition-all"
    >
      {/* Subtle background ambient glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Mode / Focus Badge in top corner of canvas */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md border shadow-sm transition-all bg-white/95 border-slate-200 text-slate-800">
          <span className={`w-2 h-2 rounded-full ${mode === 'revision' ? 'bg-indigo-600 animate-pulse' : 'bg-emerald-500'}`} />
          {mode === 'revision' && activeSlot ? `Focusing: ${activeSlot.name}` : 'Palace View: Click any item to customize'}
        </span>
      </div>

      {/* Main Transformable Isometric Room Container */}
      <motion.div
        className="w-full h-full relative"
        animate={{
          scale: zoomScale,
          x: `${translateX}%`,
          y: `${translateY}%`,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Gradients for room walls and floors */}
            <linearGradient id="wallLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="wallRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="rugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="deskWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="bookshelfWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="windowLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.5" />
            </linearGradient>
            
            {/* Filter for glow */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= ISOMETRIC ROOM SHELL ================= */}
          {/* Back Left Wall */}
          <polygon
            points="400,80 120,240 120,440 400,600 400,80"
            fill="url(#wallLeft)"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Back Right Wall */}
          <polygon
            points="400,80 680,240 680,440 400,600 400,80"
            fill="url(#wallRight)"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Floor Isometric Grid */}
          <polygon
            points="400,320 680,440 400,580 120,440"
            fill="url(#floorGrad)"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Floor Isometric Line Details / Planks */}
          <g stroke="#475569" strokeWidth="1" opacity="0.4">
            <line x1="260" y1="380" x2="540" y2="500" />
            <line x1="190" y1="410" x2="470" y2="530" />
            <line x1="330" y1="350" x2="610" y2="470" />
            <line x1="330" y1="510" x2="610" y2="390" />
            <line x1="260" y1="480" x2="540" y2="360" />
            <line x1="190" y1="450" x2="470" y2="330" />
          </g>

          {/* Room Baseboard corner lines */}
          <line x1="400" y1="80" x2="400" y2="320" stroke="#94a3b8" strokeWidth="3" />
          <line x1="120" y1="240" x2="400" y2="320" stroke="#94a3b8" strokeWidth="3" />
          <line x1="680" y1="240" x2="400" y2="320" stroke="#94a3b8" strokeWidth="3" />

          {/* Isometric Window on Left Wall */}
          <g transform="translate(0, 0)">
            <polygon
              points="180,230 270,180 270,290 180,340"
              fill="#cbd5e1"
              stroke="#64748b"
              strokeWidth="3"
            />
            {/* Window Glass Pane */}
            <polygon
              points="190,237 260,197 260,283 190,323"
              fill="url(#windowLight)"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Window Crossbars */}
            <line x1="225" y1="217" x2="225" y2="303" stroke="#64748b" strokeWidth="2" />
            <line x1="190" y1="280" x2="260" y2="240" stroke="#64748b" strokeWidth="2" />
            {/* Sunlight beam onto floor */}
            <polygon
              points="190,330 260,290 380,440 280,470"
              fill="#fef08a"
              opacity="0.12"
            />
          </g>

          {/* Cozy Carpet / Rug in the Room Center */}
          <polygon
            points="400,370 560,440 400,510 240,440"
            fill="url(#rugGrad)"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4,2"
          />
          <polygon
            points="400,385 530,440 400,495 270,440"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* ================= 1. BOOKSHELF (Back Center Wall) ================= */}
          <g id="svg-bookshelf">
            {/* Bookshelf Shadow */}
            <polygon points="360,240 440,200 450,220 370,260" fill="#0f172a" opacity="0.3" />
            {/* Main Cabinet Body */}
            {/* Left face */}
            <polygon points="370,170 410,150 410,330 370,350" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            {/* Right face */}
            <polygon points="410,150 450,170 450,350 410,330" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            {/* Top face */}
            <polygon points="410,130 450,150 410,170 370,150" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
            
            {/* Shelf Shelves & Books */}
            {/* Upper Shelf books */}
            <polygon points="380,200 405,188 405,230 380,242" fill="#0284c7" />
            <polygon points="390,195 405,188 405,230 390,237" fill="#38bdf8" />
            
            <polygon points="415,188 440,200 440,242 415,230" fill="#f59e0b" />
            <polygon points="425,193 440,200 440,242 425,235" fill="#fbbf24" />
            <polygon points="430,196 440,200 440,242 430,238" fill="#ef4444" />

            {/* Middle Shelf */}
            <line x1="370" y1="250" x2="410" y2="230" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="410" y1="230" x2="450" y2="250" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Middle Shelf books */}
            <polygon points="380,260 405,248 405,290 380,302" fill="#10b981" />
            <polygon points="388,256 405,248 405,290 388,298" fill="#34d399" />
            <polygon points="415,248 438,260 438,302 415,290" fill="#8b5cf6" />
            <polygon points="426,254 438,260 438,302 426,296" fill="#a78bfa" />
          </g>

          {/* ================= 2. PAINTING (Right Wall) ================= */}
          <g id="svg-painting">
            {/* Outer Frame */}
            <polygon
              points="530,170 610,215 610,315 530,270"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Gold Frame Trim */}
            <polygon
              points="535,176 605,215 605,308 535,269"
              fill="#f59e0b"
            />
            {/* Canvas Artwork */}
            <polygon
              points="540,183 600,217 600,302 540,268"
              fill="#0284c7"
            />
            {/* Artwork scenery inside canvas */}
            {/* Mountain peak 1 */}
            <polygon points="550,260 570,210 585,250" fill="#047857" opacity="0.9" />
            {/* Mountain peak 2 */}
            <polygon points="565,255 585,220 600,250" fill="#059669" opacity="0.95" />
            {/* Sun in painting */}
            <circle cx="585" cy="205" r="7" fill="#fef08a" />
          </g>

          {/* ================= 3. DESK & MONITOR (Left / Center Fore) ================= */}
          <g id="svg-desk">
            {/* Desk Ground Shadow */}
            <polygon points="210,360 380,275 420,310 260,400" fill="#0f172a" opacity="0.25" />
            
            {/* Desk Legs & Cabinet (Drawers on left) */}
            {/* Drawer side */}
            <polygon points="230,340 270,320 270,410 230,430" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <polygon points="270,320 290,330 290,420 270,410" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            {/* Drawer lines */}
            <line x1="230" y1="370" x2="270" y2="350" stroke="#64748b" strokeWidth="2" />
            <line x1="230" y1="400" x2="270" y2="380" stroke="#64748b" strokeWidth="2" />
            {/* Drawer handles */}
            <line x1="245" y1="358" x2="255" y2="353" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <line x1="245" y1="388" x2="255" y2="383" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <line x1="245" y1="418" x2="255" y2="413" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

            {/* Right Desk Leg */}
            <polygon points="365,270 385,280 385,360 365,350" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

            {/* Desktop Top Surface */}
            <polygon
              points="210,335 340,270 410,305 280,370"
              fill="url(#deskWood)"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Desktop Thickness Bevel */}
            <polygon
              points="210,335 280,370 280,380 210,345"
              fill="#cbd5e1"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <polygon
              points="280,370 410,305 410,315 280,380"
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Computer Monitor */}
            {/* Stand Base */}
            <polygon points="330,285 355,272 370,280 345,293" fill="#334155" stroke="#0f172a" strokeWidth="1" />
            {/* Stand Neck */}
            <line x1="348" y1="282" x2="348" y2="265" stroke="#334155" strokeWidth="4" />
            {/* Screen Bezel */}
            <polygon points="315,225 385,190 385,260 315,295" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            {/* Screen Glowing Display */}
            <polygon points="320,230 380,200 380,255 320,285" fill="#38bdf8" />
            {/* Screen UI mock graphics */}
            <line x1="330" y1="240" x2="370" y2="220" stroke="#e0f2fe" strokeWidth="2" />
            <line x1="330" y1="250" x2="360" y2="235" stroke="#e0f2fe" strokeWidth="1.5" />
            <line x1="330" y1="260" x2="350" y2="250" stroke="#e0f2fe" strokeWidth="1.5" />

            {/* Keyboard & Mouse */}
            <polygon points="290,325 330,305 345,312 305,332" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <ellipse cx="355" cy="310" rx="4" ry="3" fill="#475569" />
          </g>

          {/* ================= 4. LAMP (On Left side of Desk) ================= */}
          <g id="svg-lamp">
            {/* Lamp base */}
            <ellipse cx="238" cy="328" rx="8" ry="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            {/* Articulated Arm */}
            <path
              d="M 238 328 Q 230 300 240 280 T 255 265"
              fill="none"
              stroke="#475569"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Lamp Shade Head */}
            <polygon points="250,260 270,250 280,270 260,280" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            {/* Lamp warm spotlight glow cone onto desk */}
            <polygon
              points="265,275 220,350 280,360"
              fill="#fbbf24"
              opacity="0.22"
              filter="url(#softGlow)"
            />
          </g>

          {/* ================= 5. CHAIR (Swivel Chair) ================= */}
          <g id="svg-chair">
            {/* Chair Wheels Base */}
            <ellipse cx="520" cy="465" rx="28" ry="14" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="6,8" />
            <circle cx="520" cy="465" r="5" fill="#0f172a" />
            {/* Chair Hydraulic Piston Column */}
            <line x1="520" y1="465" x2="520" y2="420" stroke="#475569" strokeWidth="6" />
            
            {/* Seat Cushion */}
            <polygon
              points="485,410 525,390 555,405 515,425"
              fill="#cbd5e1"
              stroke="#475569"
              strokeWidth="2.5"
            />
            <polygon
              points="485,410 515,425 515,432 485,417"
              fill="#94a3b8"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <polygon
              points="515,425 555,405 555,412 515,432"
              fill="#64748b"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Chair Backrest */}
            <polygon
              points="520,345 550,330 550,385 520,400"
              fill="#e2e8f0"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Chair Armrest */}
            <path
              d="M 495 405 L 495 385 L 515 375"
              fill="none"
              stroke="#64748b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* ================= INTERACTIVE CLICKABLE HOTSPOT BADGES (SLOTS) ================= */}
        {slots.map((slot, index) => {
          const isSlotActive = activeSlotIndex === index;
          const hasContent = Boolean(slot.content && slot.content.trim().length > 0);
          const isCurrentInRevision = mode === 'revision' && isSlotActive;

          return (
            <div
              key={slot.id}
              id={`hotspot-slot-${slot.id}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
              }}
              onClick={() => onSelectSlot(slot, index)}
            >
              {/* Pulsing Concentric Highlight Ring */}
              <div className="relative flex items-center justify-center">
                {/* Outer animated halo ring */}
                <span
                  className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-500 pointer-events-none ${
                    isCurrentInRevision
                      ? 'bg-indigo-500/30 ring-4 ring-indigo-400 animate-ping'
                      : hasContent
                      ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20 ring-2 ring-indigo-400/50'
                      : 'bg-slate-500/10 group-hover:bg-slate-500/20 ring-2 ring-slate-400/40'
                  }`}
                />

                {/* Main Circular Badge */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 shadow-lg ${
                    isCurrentInRevision
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 scale-125 shadow-indigo-600/50'
                      : hasContent
                      ? 'bg-white text-indigo-700 ring-2 ring-slate-200 group-hover:ring-indigo-500 shadow-md'
                      : 'bg-white/90 text-slate-500 ring-1 ring-slate-300 hover:ring-slate-400 hover:text-slate-700'
                  }`}
                >
                  {getSlotIcon(slot.name)}

                  {/* Little indicator badge in corner */}
                  {hasContent ? (
                    <span 
                      title={slot.contentType === 'image' ? 'Contains Image' : 'Contains Text'}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm border border-white font-bold"
                    >
                      {slot.contentType === 'image' ? (
                        <ImageIcon className="w-2.5 h-2.5" />
                      ) : (
                        <FileText className="w-2.5 h-2.5" />
                      )}
                    </span>
                  ) : (
                    <span 
                      title="Empty Slot - Click to assign"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-slate-300 text-slate-700 rounded-full flex items-center justify-center text-[9px] border border-white font-bold"
                    >
                      +
                    </span>
                  )}
                </div>

                {/* Hotspot Floating Tooltip / Label */}
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold shadow-xl transition-all duration-200 pointer-events-none flex items-center gap-1.5 z-40 ${
                  isCurrentInRevision
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 opacity-100 translate-y-0 font-bold scale-105'
                    : 'bg-slate-900/90 text-white border border-slate-700 opacity-90 group-hover:opacity-100 group-hover:translate-y-0.5'
                }`}>
                  <span>{slot.name}</span>
                  {hasContent && !isCurrentInRevision && (
                    <span className="text-[10px] text-emerald-400 font-mono">● Saved</span>
                  )}
                  {isCurrentInRevision && (
                    <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1 rounded uppercase font-mono">Reviewing</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
