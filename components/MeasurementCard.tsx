import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PolygonMetrics } from '@/constants/types';
import { IOS_BLUE } from '@/constants/mapStyles';

interface MeasurementCardProps {
  metrics: PolygonMetrics | null;
  vertexCount: number;
}

export function MeasurementCard({ metrics, vertexCount }: MeasurementCardProps) {
  if (!metrics || vertexCount < 3) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Area:</Text>
        <Text style={styles.value}>{metrics.area} km²</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Perimeter:</Text>
        <Text style={styles.value}>{metrics.perimeter} km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 80,
    right: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 280,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  label: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
