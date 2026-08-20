import React from 'react';
import { MemorySlot, AppMode } from '../types';
import { 
  Lamp, 
  Monitor, 
  BookOpen, 
  Image as ImageIcon, 
  Armchair, 
  FileText, 
  Edit3, 
  Sparkles,
  Plus
} from 'lucide-react';

interface PalaceSlotsListProps {
  slots: MemorySlot[];
  mode: AppMode;
  activeSlotIndex: number | null;
  onSelectSlot: (slot: MemorySlot, index: number) => void;
}

export const PalaceSlotsList: React.FC<PalaceSlotsListProps> = ({
  slots,
  mode,
  activeSlotIndex,
  onSelectSlot,
}) => {
  const getSlotIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lamp':
        return <Lamp className="w-4 h-4 text-amber-400" />;
      case 'desk':
        return <Monitor className="w-4 h-4 text-sky-400" />;
      case 'bookshelf':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'painting':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case 'chair':
        return <Armchair className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          5 Memory Loci in Room
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          {slots.filter((s) => s.content && s.content.trim().length > 0).length} of 5 slots filled
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {slots.map((slot, index) => {
          const hasContent = Boolean(slot.content && slot.content.trim().length > 0);
          const isSelected = activeSlotIndex === index;

          return (
            <button
              key={slot.id}
              id={`slot-card-${slot.id}`}
              onClick={() => onSelectSlot(slot, index)}
              className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30 shadow-sm'
                  : hasContent
                  ? 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm'
                  : 'bg-slate-50/40 border-dashed border-slate-300 hover:border-slate-400 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    {getSlotIcon(slot.name)}
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {index + 1}. {slot.name}
                  </span>
                </div>
                {hasContent ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    {slot.contentType === 'image' ? (
                      <ImageIcon className="w-3 h-3 text-purple-600" />
                    ) : (
                      <FileText className="w-3 h-3 text-indigo-600" />
                    )}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded-md">Empty</span>
                )}
              </div>

              {/* Stored Content Preview Snippet */}
              <div className="min-h-[36px]">
                {hasContent ? (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {slot.title ? (
                      <span className="font-semibold text-slate-900 block truncate">{slot.title}</span>
                    ) : null}
                    {slot.contentType === 'image' ? (
                      <span className="text-purple-700 italic font-medium">🖼️ Image visual stored</span>
                    ) : (
                      slot.content
                    )}
                  </p>
                ) : (
                  <span className="text-xs text-slate-400 italic flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Click to add item
                  </span>
                )}
              </div>

              {/* Action Prompt */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-indigo-600 transition-colors">
                <span className="font-medium">{slot.category}</span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600">
                  <Edit3 className="w-3 h-3" /> Edit
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
