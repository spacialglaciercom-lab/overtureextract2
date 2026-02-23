import { useState, useCallback, useMemo } from 'react';
import { Position, point, distance } from '@turf/turf';
import { SNAP_RADIUS_KM, MAX_VERTICES } from '@/constants/mapStyles';

export interface UsePolygonDrawReturn {
  vertices: Position[];
  isDrawing: boolean;
  isPolygonClosed: boolean;
  startDrawing: () => void;
  stopDrawing: () => void;
  addVertex: (coordinate: Position) => void;
  removeLastVertex: () => void;
  clearPolygon: () => void;
  closePolygon: () => void;
  handleMapPress: (coordinate: Position) => void;
  drawingGeoJSON: GeoJSON.FeatureCollection;
  polygonGeoJSON: GeoJSON.FeatureCollection | null;
  vertexGeoJSON: GeoJSON.FeatureCollection;
  firstVertexGeoJSON: GeoJSON.FeatureCollection | null;
}

export function usePolygonDraw(): UsePolygonDrawReturn {
  const [vertices, setVertices] = useState<Position[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    setVertices([]);
    setIsPolygonClosed(false);
  }, []);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const addVertex = useCallback((coordinate: Position) => {
    setVertices((prev) => {
      if (prev.length >= MAX_VERTICES) {
        return prev;
      }
      return [...prev, coordinate];
    });
  }, []);

  const removeLastVertex = useCallback(() => {
    setVertices((prev) => prev.slice(0, -1));
  }, []);

  const clearPolygon = useCallback(() => {
    setVertices([]);
    setIsPolygonClosed(false);
    setIsDrawing(false);
  }, []);

  const closePolygon = useCallback(() => {
    if (vertices.length >= 3) {
      setIsPolygonClosed(true);
      setIsDrawing(false);
    }
  }, [vertices.length]);

  const handleMapPress = useCallback(
    (coordinate: Position) => {
      if (!isDrawing) return;

      // Check if we should snap to first vertex to close polygon
      if (vertices.length > 2) {
        const firstVertex = vertices[0];
        const firstPoint = point(firstVertex);
        const tappedPoint = point(coordinate);
        const dist = distance(firstPoint, tappedPoint, { units: 'kilometers' });

        if (dist < SNAP_RADIUS_KM) {
          closePolygon();
          return;
        }
      }

      addVertex(coordinate);
    },
    [isDrawing, vertices, addVertex, closePolygon]
  );

  // GeoJSON for drawing line (in-progress)
  const drawingGeoJSON = useMemo<GeoJSON.FeatureCollection>(() => {
    if (vertices.length < 2) {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: vertices,
          },
        },
      ],
    };
  }, [vertices]);

  // GeoJSON for closed polygon
  const polygonGeoJSON = useMemo<GeoJSON.FeatureCollection | null>(() => {
    if (!isPolygonClosed || vertices.length < 3) {
      return null;
    }

    const closedCoordinates = [...vertices, vertices[0]];

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoordinates],
          },
        },
      ],
    };
  }, [vertices, isPolygonClosed]);

  // GeoJSON for vertex dots
  const vertexGeoJSON = useMemo<GeoJSON.FeatureCollection>(() => {
    const features = vertices.map((coord, index) => ({
      type: 'Feature' as const,
      properties: { index },
      geometry: {
        type: 'Point' as const,
        coordinates: coord,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [vertices]);

  // GeoJSON for first vertex (close target)
  const firstVertexGeoJSON = useMemo<GeoJSON.FeatureCollection | null>(() => {
    if (vertices.length <= 2 || isPolygonClosed) {
      return null;
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: vertices[0],
          },
        },
      ],
    };
  }, [vertices, isPolygonClosed]);

  return {
    vertices,
    isDrawing,
    isPolygonClosed,
    startDrawing,
    stopDrawing,
    addVertex,
    removeLastVertex,
    clearPolygon,
    closePolygon,
    handleMapPress,
    drawingGeoJSON,
    polygonGeoJSON,
    vertexGeoJSON,
    firstVertexGeoJSON,
  };
}
