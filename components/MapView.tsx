import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox, { 
  MapView as RNMapView, 
  Camera, 
  ShapeSource, 
  LineLayer, 
  FillLayer, 
  CircleLayer,
  UserLocation,
  LocationPuck,
} from '@rnmapbox/maps';
import { Position } from '@turf/turf';
import { 
  MAP_STYLE_URL, 
  lineStyle, 
  fillStyle, 
  circleStyle, 
  firstVertexStyle,
  previewRoadsStyle,
  roadsStyle,
  DEFAULT_CAMERA,
} from '@/constants/mapStyles';
import { PreviewRoadsResponse } from '@/constants/types';

// Set Mapbox access token
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

export interface MapViewRef {
  flyTo: (coordinates: Position, zoom?: number) => void;
  resetBearing: () => void;
  fitBounds: (coordinates: Position[]) => void;
}

interface MapViewProps {
  drawingGeoJSON: GeoJSON.FeatureCollection;
  polygonGeoJSON: GeoJSON.FeatureCollection | null;
  vertexGeoJSON: GeoJSON.FeatureCollection;
  firstVertexGeoJSON: GeoJSON.FeatureCollection | null;
  previewRoads: PreviewRoadsResponse | null;
  extractedRoads: PreviewRoadsResponse | null;
  isDrawing: boolean;
  onMapPress: (coordinate: Position) => void;
  showUserLocation?: boolean;
}

export const MapView = forwardRef<MapViewRef, MapViewProps>(({
  drawingGeoJSON,
  polygonGeoJSON,
  vertexGeoJSON,
  firstVertexGeoJSON,
  previewRoads,
  extractedRoads,
  isDrawing,
  onMapPress,
  showUserLocation = true,
}, ref) => {
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<RNMapView>(null);

  const flyTo = useCallback((coordinates: Position, zoom = 14) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      zoomLevel: zoom,
      animationDuration: 1000,
      animationMode: 'flyTo',
    });
  }, []);

  const resetBearing = useCallback(() => {
    cameraRef.current?.setCamera({
      heading: 0,
      animationDuration: 500,
      animationMode: 'easeTo',
    });
  }, []);

  const fitBounds = useCallback((coordinates: Position[]) => {
    if (coordinates.length === 0) return;

    cameraRef.current?.fitBounds(
      coordinates.reduce(
        (bounds, coord) => ({
          ne: [Math.max(bounds.ne[0], coord[0]), Math.max(bounds.ne[1], coord[1])],
          sw: [Math.min(bounds.sw[0], coord[0]), Math.min(bounds.sw[1], coord[1])],
        }),
        { ne: coordinates[0], sw: coordinates[0] }
      ),
      [50, 50, 100, 50], // padding
      1000 // animation duration
    );
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo,
    resetBearing,
    fitBounds,
  }));

  const handleMapPress = useCallback((feature: GeoJSON.Feature) => {
    if (!isDrawing) return;
    
    const geometry = feature.geometry;
    if (geometry.type === 'Point') {
      const coordinates = geometry.coordinates as Position;
      onMapPress(coordinates);
    }
  }, [isDrawing, onMapPress]);

  return (
    <View style={styles.container}>
      <RNMapView
        ref={mapRef}
        style={styles.map}
        styleURL={MAP_STYLE_URL}
        onPress={handleMapPress}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={!isDrawing}
        zoomEnabled={!isDrawing}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Camera
          ref={cameraRef}
          centerCoordinate={DEFAULT_CAMERA.centerCoordinate}
          zoomLevel={DEFAULT_CAMERA.zoomLevel}
          pitch={DEFAULT_CAMERA.pitch}
          heading={DEFAULT_CAMERA.heading}
          animationMode="none"
        />

        {showUserLocation && (
          <UserLocation visible={true}>
            <LocationPuck
              puckBearingEnabled={true}
              puckBearing="heading"
              pulsing={{ isEnabled: true }}
            />
          </UserLocation>
        )}

        {/* Drawing line (in-progress) */}
        {drawingGeoJSON.features.length > 0 && (
          <ShapeSource id="drawingLineSource" shape={drawingGeoJSON}>
            <LineLayer id="drawingLineLayer" style={lineStyle} />
          </ShapeSource>
        )}

        {/* Closed polygon fill */}
        {polygonGeoJSON && (
          <ShapeSource id="polygonSource" shape={polygonGeoJSON}>
            <FillLayer id="polygonFillLayer" style={fillStyle} />
            <LineLayer id="polygonOutlineLayer" style={{ ...lineStyle, lineDasharray: undefined }} />
          </ShapeSource>
        )}

        {/* Vertex dots */}
        {vertexGeoJSON.features.length > 0 && (
          <ShapeSource id="vertexSource" shape={vertexGeoJSON}>
            <CircleLayer id="vertexLayer" style={circleStyle} />
          </ShapeSource>
        )}

        {/* First vertex (close target) */}
        {firstVertexGeoJSON && (
          <ShapeSource id="firstVertexSource" shape={firstVertexGeoJSON}>
            <CircleLayer id="firstVertexLayer" style={firstVertexStyle} />
          </ShapeSource>
        )}

        {/* Preview roads */}
        {previewRoads && previewRoads.features.length > 0 && (
          <ShapeSource id="previewRoadsSource" shape={previewRoads}>
            <LineLayer id="previewRoadsLayer" style={previewRoadsStyle} />
          </ShapeSource>
        )}

        {/* Extracted roads */}
        {extractedRoads && extractedRoads.features.length > 0 && (
          <ShapeSource id="extractedRoadsSource" shape={extractedRoads}>
            <LineLayer id="extractedRoadsLayer" style={roadsStyle} />
          </ShapeSource>
        )}
      </RNMapView>
    </View>
  );
});

MapView.displayName = 'MapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
