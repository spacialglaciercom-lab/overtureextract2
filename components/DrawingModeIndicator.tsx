import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_BLUE } from '@/constants/mapStyles';

interface DrawingModeIndicatorProps {
  isDrawing: boolean;
  vertexCount: number;
  onCancel: () => void;
}

export function DrawingModeIndicator({
  isDrawing,
  vertexCount,
  onCancel,
}: DrawingModeIndicatorProps) {
  if (!isDrawing) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="create" size={18} color={IOS_BLUE} />
        <Text style={styles.text}>
          {vertexCount === 0 
            ? 'Tap map to add first point' 
            : vertexCount === 1 
              ? 'Add more points'
              : `Tap first point to close (${vertexCount} vertices)`
          }
        </Text>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.4)',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.4)',
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
  },
});
