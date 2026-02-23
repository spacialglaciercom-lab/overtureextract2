import { Position } from '@turf/turf';

export interface PolygonMetrics {
  area: string;
  perimeter: string;
}

export interface ExtractionStage {
  stage: 'idle' | 'downloading' | 'clipping' | 'building' | 'complete' | 'error';
  progress: number;
  message?: string;
}

export interface ExtractionResult {
  downloadUrl: string | null;
  filename: string;
}

export interface PreviewRoadsResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: Position[];
    };
    properties: Record<string, any>;
  }>;
}

export interface WebSocketMessage {
  stage: 'downloading' | 'clipping' | 'building' | 'complete' | 'error';
  progress: number;
  download_url?: string;
  filename?: string;
  message?: string;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}
