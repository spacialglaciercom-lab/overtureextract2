import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { Position } from '@turf/turf';

export interface UseLocationReturn {
  location: Position | null;
  heading: number | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Position | null>;
  startWatchingLocation: () => Promise<void>;
  stopWatchingLocation: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Position | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return false;
      }
      return true;
    } catch (err) {
      setError('Error requesting location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<Position | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const coords: Position = [
        currentLocation.coords.longitude,
        currentLocation.coords.latitude,
      ];

      setLocation(coords);
      setHeading(currentLocation.coords.heading);
      setIsLoading(false);
      return coords;
    } catch (err) {
      setError('Error getting current location');
      setIsLoading(false);
      return null;
    }
  }, [requestPermission]);

  const startWatchingLocation = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    // Stop any existing subscription
    stopWatchingLocation();

    try {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation([
            newLocation.coords.longitude,
            newLocation.coords.latitude,
          ]);
          setHeading(newLocation.coords.heading);
        }
      );
    } catch (err) {
      setError('Error watching location');
    }
  }, [requestPermission]);

  const stopWatchingLocation = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, [stopWatchingLocation]);

  return {
    location,
    heading,
    error,
    isLoading,
    requestPermission,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
  };
}
