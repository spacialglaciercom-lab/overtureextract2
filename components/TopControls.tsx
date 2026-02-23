import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOS_BLUE, IOS_GRAY } from '@/constants/mapStyles';

interface TopControlsProps {
  onCenterLocation: () => void;
  onResetBearing: () => void;
  isLocating?: boolean;
}

export function TopControls({
  onCenterLocation,
  onResetBearing,
  isLocating = false,
}: TopControlsProps) {
  return (
    <View style={styles.container}>
      {/* Compass button - reset bearing */}
      <TouchableOpacity
        style={styles.button}
        onPress={onResetBearing}
        activeOpacity={0.8}
      >
        <Ionicons name="compass-outline" size={24} color={IOS_BLUE} />
      </TouchableOpacity>

      {/* Geolocation button - center on user */}
      <TouchableOpacity
        style={styles.button}
        onPress={onCenterLocation}
        disabled={isLocating}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isLocating ? "locate" : "locate-outline"} 
          size={24} 
          color={isLocating ? IOS_GRAY : IOS_BLUE} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 16,
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
});
