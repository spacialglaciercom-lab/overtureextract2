import React, { useRef, useCallback, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  MapView,
  MapViewRef,
  DrawingToolbar,
  MeasurementCard,
  ExtractionSheet,
  TopControls,
  DrawingModeIndicator,
} from '@/components';

import {
  usePolygonDraw,
  useLiveMeasurements,
  useExtraction,
  useLocation,
} from '@/hooks';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const [extractedRoads, setExtractedRoads] = useState<any>(null);

  // Custom hooks
  const {
    vertices,
    isDrawing,
    isPolygonClosed,
    startDrawing,
    clearPolygon,
    handleMapPress: onMapPress,
    drawingGeoJSON,
    polygonGeoJSON,
    vertexGeoJSON,
    firstVertexGeoJSON,
  } = usePolygonDraw();

  const { metrics, boundingBox } = useLiveMeasurements(vertices);

  const {
    location,
    getCurrentLocation,
    isLoading: isLocating,
  } = useLocation();

  const {
    stage,
    result,
    previewRoads,
    isPreviewLoading,
    isExtracting,
    startExtraction,
    cancelExtraction,
    previewRoadsData,
    downloadGraph,
    clearPreview,
    resetExtraction,
  } = useExtraction();

  // Handlers
  const handleStartDrawing = useCallback(() => {
    clearPreview();
    resetExtraction();
    setExtractedRoads(null);
    startDrawing();
    bottomSheetRef.current?.close();
  }, [clearPreview, resetExtraction, startDrawing]);

  const handleClearPolygon = useCallback(() => {
    Alert.alert(
      'Clear Polygon',
      'Are you sure you want to clear the current polygon?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearPolygon();
            clearPreview();
            resetExtraction();
            setExtractedRoads(null);
            bottomSheetRef.current?.close();
          }
        },
      ]
    );
  }, [clearPolygon, clearPreview, resetExtraction]);

  const handleCenterLocation = useCallback(async () => {
    const coords = await getCurrentLocation();
    if (coords) {
      mapRef.current?.flyTo(coords, 15);
    }
  }, [getCurrentLocation]);

  const handleResetBearing = useCallback(() => {
    mapRef.current?.resetBearing();
  }, []);

  const handlePreview = useCallback(async () => {
    await previewRoadsData(vertices);
  }, [previewRoadsData, vertices]);

  const handleExtract = useCallback(() => {
    startExtraction(vertices);
  }, [startExtraction, vertices]);

  const handleDownload = useCallback(async () => {
    await downloadGraph();
  }, [downloadGraph]);

  const handleCancel = useCallback(() => {
    cancelExtraction();
  }, [cancelExtraction]);

  const handleCloseSheet = useCallback(() => {
    if (!isExtracting) {
      bottomSheetRef.current?.close();
    }
  }, [isExtracting]);

  const handleCancelDrawing = useCallback(() => {
    clearPolygon();
  }, [clearPolygon]);

  // Expand bottom sheet when polygon is closed
  React.useEffect(() => {
    if (isPolygonClosed) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [isPolygonClosed]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        drawingGeoJSON={drawingGeoJSON}
        polygonGeoJSON={polygonGeoJSON}
        vertexGeoJSON={vertexGeoJSON}
        firstVertexGeoJSON={firstVertexGeoJSON}
        previewRoads={previewRoads}
        extractedRoads={extractedRoads}
        isDrawing={isDrawing}
        onMapPress={onMapPress}
      />

      {/* Top Controls */}
      <TopControls
        onCenterLocation={handleCenterLocation}
        onResetBearing={handleResetBearing}
        isLocating={isLocating}
      />

      {/* Drawing Mode Indicator */}
      <DrawingModeIndicator
        isDrawing={isDrawing}
        vertexCount={vertices.length}
        onCancel={handleCancelDrawing}
      />

      {/* Drawing Toolbar */}
      <DrawingToolbar
        isDrawing={isDrawing}
        hasVertices={vertices.length > 0}
        onStartDrawing={handleStartDrawing}
        onClearPolygon={handleClearPolygon}
      />

      {/* Measurement Card */}
      <MeasurementCard
        metrics={metrics}
        vertexCount={vertices.length}
      />

      {/* Extraction Bottom Sheet */}
      <ExtractionSheet
        bottomSheetRef={bottomSheetRef}
        isPolygonClosed={isPolygonClosed}
        vertices={vertices}
        boundingBox={boundingBox}
        stage={stage}
        isPreviewLoading={isPreviewLoading}
        isExtracting={isExtracting}
        hasPreview={!!previewRoads && previewRoads.features.length > 0}
        hasExtractedData={!!extractedRoads}
        downloadUrl={result.downloadUrl}
        onPreview={handlePreview}
        onExtract={handleExtract}
        onDownload={handleDownload}
        onCancel={handleCancel}
        onClose={handleCloseSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
