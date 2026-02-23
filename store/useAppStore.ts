import { create } from 'zustand';
import { Position } from '@turf/turf';
import { ExtractionStage, BoundingBox } from '@/constants/types';

interface AppState {
  // Drawing state
  vertices: Position[];
  isDrawing: boolean;
  isPolygonClosed: boolean;
  
  // Measurements
  area: number | null;
  perimeter: number | null;
  boundingBox: BoundingBox | null;
  
  // Extraction state
  extractionStage: ExtractionStage;
  downloadUrl: string | null;
  
  // UI state
  isBottomSheetOpen: boolean;
  
  // Actions
  setVertices: (vertices: Position[]) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setIsPolygonClosed: (isClosed: boolean) => void;
  setMeasurements: (area: number, perimeter: number) => void;
  setBoundingBox: (bbox: BoundingBox | null) => void;
  setExtractionStage: (stage: ExtractionStage) => void;
  setDownloadUrl: (url: string | null) => void;
  setBottomSheetOpen: (isOpen: boolean) => void;
  resetDrawing: () => void;
  resetExtraction: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  vertices: [],
  isDrawing: false,
  isPolygonClosed: false,
  area: null,
  perimeter: null,
  boundingBox: null,
  extractionStage: { stage: 'idle', progress: 0 },
  downloadUrl: null,
  isBottomSheetOpen: false,
  
  // Actions
  setVertices: (vertices) => set({ vertices }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setIsPolygonClosed: (isPolygonClosed) => set({ isPolygonClosed }),
  setMeasurements: (area, perimeter) => set({ area, perimeter }),
  setBoundingBox: (boundingBox) => set({ boundingBox }),
  setExtractionStage: (extractionStage) => set({ extractionStage }),
  setDownloadUrl: (downloadUrl) => set({ downloadUrl }),
  setBottomSheetOpen: (isBottomSheetOpen) => set({ isBottomSheetOpen }),
  
  resetDrawing: () => set({
    vertices: [],
    isDrawing: false,
    isPolygonClosed: false,
    area: null,
    perimeter: null,
    boundingBox: null,
  }),
  
  resetExtraction: () => set({
    extractionStage: { stage: 'idle', progress: 0 },
    downloadUrl: null,
  }),
}));
