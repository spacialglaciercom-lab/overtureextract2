import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Position } from '@turf/turf';
import { ProgressBar } from './ProgressBar';
import { ExtractionStage, BoundingBox } from '@/constants/types';
import { IOS_BLUE, IOS_GREEN, IOS_ORANGE, IOS_GRAY } from '@/constants/mapStyles';

interface ExtractionSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  isPolygonClosed: boolean;
  vertices: Position[];
  boundingBox: BoundingBox | null;
  stage: ExtractionStage;
  isPreviewLoading: boolean;
  isExtracting: boolean;
  hasPreview: boolean;
  hasExtractedData: boolean;
  downloadUrl: string | null;
  onPreview: () => void;
  onExtract: () => void;
  onDownload: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function ExtractionSheet({
  bottomSheetRef,
  isPolygonClosed,
  vertices,
  boundingBox,
  stage,
  isPreviewLoading,
  isExtracting,
  hasPreview,
  hasExtractedData,
  downloadUrl,
  onPreview,
  onExtract,
  onDownload,
  onCancel,
  onClose,
}: ExtractionSheetProps) {
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  if (!isPolygonClosed) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={!isExtracting}
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Polygon Summary</Text>
          {!isExtracting && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Polygon Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="locate-outline" size={18} color={IOS_GRAY} />
            <Text style={styles.infoLabel}>Vertices:</Text>
            <Text style={styles.infoValue}>{vertices.length}</Text>
          </View>
          
          {boundingBox && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Ionicons name="map-outline" size={18} color={IOS_GRAY} />
                <Text style={styles.infoLabel}>Bounds:</Text>
                <View style={styles.boundsContainer}>
                  <Text style={styles.boundsText}>
                    {formatCoordinate(boundingBox.minLng)}, {formatCoordinate(boundingBox.minLat)}
                  </Text>
                  <Text style={styles.boundsText}>
                    {formatCoordinate(boundingBox.maxLng)}, {formatCoordinate(boundingBox.maxLat)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Progress Section */}
        {(isExtracting || stage.stage === 'complete' || stage.stage === 'error') && (
          <View style={styles.progressSection}>
            <ProgressBar stage={stage} />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Preview Roads Button */}
          {!hasExtractedData && stage.stage !== 'complete' && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.previewButton,
                (isPreviewLoading || isExtracting) && styles.buttonDisabled,
              ]}
              onPress={onPreview}
              disabled={isPreviewLoading || isExtracting}
            >
              {isPreviewLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {hasPreview ? 'Update Preview' : 'Preview Roads'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Extract & Process Button */}
          {!hasExtractedData && stage.stage !== 'complete' && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.extractButton,
                isExtracting && styles.buttonDisabled,
              ]}
              onPress={onExtract}
              disabled={isExtracting}
            >
              {isExtracting ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.actionButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Extract & Process</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Cancel Button (during extraction) */}
          {isExtracting && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* Download Button (after completion) */}
          {stage.stage === 'complete' && downloadUrl && (
            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton]}
              onPress={onDownload}
            >
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Download Graph</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Messages */}
        {hasPreview && !hasExtractedData && stage.stage !== 'complete' && (
          <View style={styles.statusMessage}>
            <Ionicons name="checkmark-circle" size={16} color={IOS_GREEN} />
            <Text style={styles.statusText}>Roads preview loaded</Text>
          </View>
        )}

        {hasExtractedData && (
          <View style={styles.statusMessage}>
            <Ionicons name="checkmark-circle" size={16} color={IOS_GREEN} />
            <Text style={styles.statusText}>Graph extracted successfully</Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#1C1C1E',
  },
  handle: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  handleIndicator: {
    backgroundColor: '#8E8E93',
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  infoCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  boundsContainer: {
    flex: 1,
  },
  boundsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    fontVariant: ['tabular-nums'],
  },
  progressSection: {
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  previewButton: {
    backgroundColor: IOS_ORANGE,
  },
  extractButton: {
    backgroundColor: IOS_BLUE,
  },
  cancelButton: {
    backgroundColor: IOS_GRAY,
  },
  downloadButton: {
    backgroundColor: IOS_GREEN,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  statusText: {
    color: IOS_GREEN,
    fontSize: 14,
    fontWeight: '500',
  },
});
