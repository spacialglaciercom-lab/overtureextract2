import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_BLUE, IOS_RED, IOS_GRAY } from '@/constants/mapStyles';

interface DrawingToolbarProps {
  isDrawing: boolean;
  hasVertices: boolean;
  onStartDrawing: () => void;
  onClearPolygon: () => void;
}

export function DrawingToolbar({
  isDrawing,
  hasVertices,
  onStartDrawing,
  onClearPolygon,
}: DrawingToolbarProps) {
  return (
    <View style={styles.container}>
      {/* Polygon tool button */}
      <TouchableOpacity
        style={[
          styles.button,
          isDrawing && styles.buttonActive,
        ]}
        onPress={onStartDrawing}
        activeOpacity={0.8}
      >
        <Ionicons
          name="create-outline"
          size={24}
          color={isDrawing ? '#FFFFFF' : IOS_BLUE}
        />
      </TouchableOpacity>

      {/* Trash button */}
      <TouchableOpacity
        style={[
          styles.button,
          !hasVertices && styles.buttonDisabled,
        ]}
        onPress={onClearPolygon}
        disabled={!hasVertices}
        activeOpacity={0.8}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={hasVertices ? IOS_RED : IOS_GRAY}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: IOS_BLUE,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
