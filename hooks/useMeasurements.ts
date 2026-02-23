import { useState, useEffect, useCallback } from 'react';
import { Position, polygon, area, length } from '@turf/turf';
import { PolygonMetrics, BoundingBox } from '@/constants/types';

export interface UseMeasurementsReturn {
  metrics: PolygonMetrics | null;
  boundingBox: BoundingBox | null;
  calculateMetrics: (vertices: Position[]) => PolygonMetrics | null;
  calculateBoundingBox: (vertices: Position[]) => BoundingBox | null;
}

export function useMeasurements(): UseMeasurementsReturn {
  const [metrics, setMetrics] = useState<PolygonMetrics | null>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);

  const calculateMetrics = useCallback((vertices: Position[]): PolygonMetrics | null => {
    if (vertices.length < 3) {
      return null;
    }

    try {
      // Close the polygon by adding the first vertex at the end
      const closedCoordinates = [...vertices, vertices[0]];
      
      // Create polygon feature
      const poly = polygon([closedCoordinates]);
      
      // Calculate area in square kilometers
      const areaSqMeters = area(poly);
      const areaSqKm = areaSqMeters / 1_000_000;
      
      // Calculate perimeter in kilometers
      const perimeterKm = length(poly, { units: 'kilometers' });

      return {
        area: areaSqKm.toFixed(3),
        perimeter: perimeterKm.toFixed(3),
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return null;
    }
  }, []);

  const calculateBoundingBox = useCallback((vertices: Position[]): BoundingBox | null => {
    if (vertices.length === 0) {
      return null;
    }

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    vertices.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    });

    return {
      minLng,
      minLat,
      maxLng,
      maxLat,
    };
  }, []);

  return {
    metrics,
    boundingBox,
    calculateMetrics,
    calculateBoundingBox,
  };
}

// Hook that automatically updates metrics when vertices change
export function useLiveMeasurements(vertices: Position[]) {
  const [metrics, setMetrics] = useState<PolygonMetrics | null>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);

  useEffect(() => {
    if (vertices.length < 3) {
      setMetrics(null);
      setBoundingBox(null);
      return;
    }

    // Calculate metrics
    const closedCoordinates = [...vertices, vertices[0]];
    const poly = polygon([closedCoordinates]);
    const areaSqMeters = area(poly);
    const areaSqKm = areaSqMeters / 1_000_000;
    const perimeterKm = length(poly, { units: 'kilometers' });

    setMetrics({
      area: areaSqKm.toFixed(3),
      perimeter: perimeterKm.toFixed(3),
    });

    // Calculate bounding box
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    vertices.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    });

    setBoundingBox({
      minLng,
      minLat,
      maxLng,
      maxLat,
    });
  }, [vertices]);

  return { metrics, boundingBox };
}
