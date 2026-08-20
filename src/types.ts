export type SlotContentType = 'text' | 'image';

export interface MemorySlot {
  id: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  // Position in isometric room (percentages or coordinates)
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  // Content stored by user
  contentType: SlotContentType;
  content: string; // text or image URL
  title?: string;
  lastRevised?: number;
  rememberedCount?: number;
  forgotCount?: number;
}

export type AppMode = 'explore' | 'revision';

export interface RevisionSession {
  activeSlotIndex: number;
  isRevealed: boolean;
  totalSlots: number;
  results: {
    slotId: string;
    remembered: boolean;
    userAnswer?: string;
    expectedAnswer?: string;
  }[];
  isComplete: boolean;
}
