import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ExtractionStage } from '@/constants/types';
import { IOS_BLUE, IOS_GREEN, IOS_ORANGE, IOS_GRAY } from '@/constants/mapStyles';

interface ProgressBarProps {
  stage: ExtractionStage;
}

const stageLabels: Record<string, string> = {
  idle: 'Ready',
  downloading: 'Downloading OSM Data...',
  clipping: 'Clipping to Polygon...',
  building: 'Building Graph...',
  complete: 'Complete!',
  error: 'Error',
};

const stageIcons: Record<string, string> = {
  idle: '○',
  downloading: '↓',
  clipping: '✂',
  building: '⚙',
  complete: '✓',
  error: '✕',
};

export function ProgressBar({ stage }: ProgressBarProps) {
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${stage.progress}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  const getStageColor = () => {
    switch (stage.stage) {
      case 'complete':
        return IOS_GREEN;
      case 'error':
        return '#FF3B30';
      case 'downloading':
        return IOS_BLUE;
      case 'clipping':
        return IOS_ORANGE;
      case 'building':
        return IOS_BLUE;
      default:
        return IOS_GRAY;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.icon, { color: getStageColor() }]}>
          {stageIcons[stage.stage]}
        </Text>
        <Text style={styles.label}>
          {stage.message || stageLabels[stage.stage]}
        </Text>
        <Text style={styles.percentage}>{Math.round(stage.progress)}%</Text>
      </View>
      
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            progressAnimatedStyle,
            { backgroundColor: getStageColor() },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
