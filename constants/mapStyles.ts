import { LineLayerStyle, FillLayerStyle, CircleLayerStyle } from '@rnmapbox/maps';

// Map Style URLs
export const MAP_STYLE_URL = process.env.EXPO_PUBLIC_MAP_STYLE || 
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// iOS System Colors
export const IOS_BLUE = '#007AFF';
export const IOS_GREEN = '#34C759';
export const IOS_ORANGE = '#FF9500';
export const IOS_RED = '#FF3B30';
export const IOS_GRAY = '#8E8E93';

// Drawing line style (in-progress polygon)
export const lineStyle: LineLayerStyle = {
  lineColor: IOS_BLUE,
  lineWidth: 2.5,
  lineOpacity: 0.9,
  lineDasharray: [2, 1], // dashed while drawing
};

// Closed polygon fill style
export const fillStyle: FillLayerStyle = {
  fillColor: IOS_BLUE,
  fillOpacity: 0.15,
  fillOutlineColor: IOS_BLUE,
};

// Vertex dots style
export const circleStyle: CircleLayerStyle = {
  circleRadius: 6,
  circleColor: '#FFFFFF',
  circleStrokeColor: IOS_BLUE,
  circleStrokeWidth: 2,
};

// First vertex (close target) style
export const firstVertexStyle: CircleLayerStyle = {
  circleRadius: 8,
  circleColor: IOS_GREEN,
  circleStrokeColor: '#FFFFFF',
  circleStrokeWidth: 2,
};

// Extracted roads layer style
export const roadsStyle: LineLayerStyle = {
  lineColor: '#FF6B35',
  lineWidth: 1.5,
  lineOpacity: 0.8,
};

// Preview roads layer style (accent color)
export const previewRoadsStyle: LineLayerStyle = {
  lineColor: IOS_ORANGE,
  lineWidth: 2,
  lineOpacity: 0.9,
};

// Default map camera settings
export const DEFAULT_CAMERA = {
  centerCoordinate: [-122.4194, 37.7749], // San Francisco
  zoomLevel: 12,
  pitch: 0,
  heading: 0,
};

// Snap radius in kilometers (50 meters)
export const SNAP_RADIUS_KM = 0.05;

// Maximum vertices for performance
export const MAX_VERTICES = 500;
