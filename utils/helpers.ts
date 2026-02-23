import { Position } from '@turf/turf';

/**
 * Format a coordinate to a readable string
 */
export function formatCoordinate(coord: number, decimals = 6): string {
  return coord.toFixed(decimals);
}

/**
 * Format area in square kilometers
 */
export function formatArea(areaSqKm: number): string {
  if (areaSqKm < 0.01) {
    return `${(areaSqKm * 1_000_000).toFixed(0)} m²`;
  }
  return `${areaSqKm.toFixed(3)} km²`;
}

/**
 * Format distance in kilometers
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${(distanceKm * 1000).toFixed(0)} m`;
  }
  return `${distanceKm.toFixed(3)} km`;
}

/**
 * Calculate the centroid of a polygon
 */
export function calculateCentroid(vertices: Position[]): Position | null {
  if (vertices.length === 0) return null;
  
  const sum = vertices.reduce(
    (acc, [lng, lat]) => ({ lng: acc.lng + lng, lat: acc.lat + lat }),
    { lng: 0, lat: 0 }
  );
  
  return [sum.lng / vertices.length, sum.lat / vertices.length];
}

/**
 * Check if a point is within a polygon (simple ray casting)
 */
export function isPointInPolygon(point: Position, polygon: Position[]): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate the bearing between two points
 */
export function calculateBearing(start: Position, end: Position): number {
  const [startLng, startLat] = start.map(toRadians);
  const [endLng, endLat] = end.map(toRadians);
  
  const dLng = endLng - startLng;
  
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  
  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  return bearing;
}
