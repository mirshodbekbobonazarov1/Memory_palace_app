import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemorySlot, SlotContentType } from '../types';
import { 
  X, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  Check,
  HelpCircle,
  Lamp,
  Monitor,
  BookOpen,
  Armchair
} from 'lucide-react';

interface SlotModalProps {
  slot: MemorySlot | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSlot: MemorySlot) => void;
  onClear: (slotId: string) => void;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  slot,
  isOpen,
  onClose,
  onSave,
  onClear,
}) => {
  const [contentType, setContentType] = useState<SlotContentType>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (slot) {
      setContentType(slot.contentType || 'text');
      setContent(slot.content || '');
      setTitle(slot.title || '');
      setImageLoadError(false);
      setSaveSuccess(false);
    }
  }, [slot]);

  if (!isOpen || !slot) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...slot,
      contentType,
      content: content.trim(),
      title: title.trim(),
      lastRevised: Date.now(),
    });
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleClear = () => {
    onClear(slot.id);
    setContent('');
    setTitle('');
    onClose();
  };

  // Sample quick suggestion templates
  const sampleSuggestions = [
    {
      label: 'French Vocab',
      type: 'text' as SlotContentType,
      title: 'French Word',
      val: 'Bibliothèque (Library) - Imagine books flying off the shelves!',
    },
    {
      label: 'Science Fact',
      type: 'text' as SlotContentType,
      title: 'Mitochondria',
      val: 'Powerhouse of the cell - produces ATP through respiration.',
    },
    {
      label: 'Visual Artwork',
      type: 'image' as SlotContentType,
      title: 'Aurora Borealis',
      val: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Historical Date',
      type: 'text' as SlotContentType,
      title: 'Moon Landing',
      val: 'July 20, 1969 - Apollo 11 lands Neil Armstrong on the Lunar surface.',
    },
  ];

  const getSlotIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lamp':
        return <Lamp className="w-6 h-6 text-amber-400" />;
      case 'desk':
        return <Monitor className="w-6 h-6 text-sky-400" />;
      case 'bookshelf':
        return <BookOpen className="w-6 h-6 text-emerald-400" />;
      case 'painting':
        return <ImageIcon className="w-6 h-6 text-purple-400" />;
      case 'chair':
        return <Armchair className="w-6 h-6 text-indigo-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="slot-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          id="slot-modal-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                {getSlotIcon(slot.name)}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  Object Slot: {slot.name}
                  <span className="text-xs font-medium text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                    {slot.category}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">{slot.description}</p>
              </div>
            </div>

            <button
              id="close-slot-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Value Type Selector: Text vs Image URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                What type of memory item do you want to place here?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="tab-select-text"
                  onClick={() => setContentType('text')}
                  className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    contentType === 'text'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Text / Note / Fact
                </button>

                <button
                  type="button"
                  id="tab-select-image"
                  onClick={() => setContentType('image')}
                  className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    contentType === 'image'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image URL
                </button>
              </div>
            </div>

            {/* Optional Title / Anchor Hint */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topic / Keyword <span className="text-slate-400 font-normal">(Optional anchor title)</span>
              </label>
              <input
                id="slot-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., ${slot.name} Memory Anchor`}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Value Input based on selected Content Type */}
            {contentType === 'text' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stored Text Value <span className="text-indigo-600">*</span>
                </label>
                <textarea
                  id="slot-text-content-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Enter a single word, vocabulary pair, key fact, definition, or paragraph to memorize at this location..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Tip: Visualize this fact interacting bizarrely with the {slot.name}!
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stored Image URL <span className="text-indigo-600">*</span>
                </label>
                <input
                  id="slot-image-url-input"
                  type="url"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setImageLoadError(false);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
                
                {/* Image Live Preview */}
                {content.trim().length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px] max-h-[180px] overflow-hidden">
                    {!imageLoadError ? (
                      <img
                        src={content}
                        alt="Slot Memory Visual"
                        className="max-h-[150px] w-auto object-contain rounded-xl shadow-sm"
                        referrerPolicy="no-referrer"
                        onError={() => setImageLoadError(true)}
                      />
                    ) : (
                      <div className="text-xs text-rose-600 flex flex-col items-center gap-1 p-3 text-center">
                        <ImageIcon className="w-6 h-6 opacity-60" />
                        <span>Could not load image from this URL. Please check the link.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Presets / Ideas */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Preset Ideas:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setContentType(item.type);
                      setTitle(item.title);
                      setContent(item.val);
                    }}
                    className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors font-medium"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {slot.content ? (
                <button
                  type="button"
                  id="clear-slot-btn"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Slot
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-slot-btn"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
                >
                  {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saveSuccess ? 'Saved!' : 'Save into Slot'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
