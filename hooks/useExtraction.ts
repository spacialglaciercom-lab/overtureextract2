import { useState, useCallback, useRef } from 'react';
import { Position } from '@turf/turf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { ExtractionStage, ExtractionResult, PreviewRoadsResponse, WebSocketMessage } from '@/constants/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-app.up.railway.app';

export interface UseExtractionReturn {
  stage: ExtractionStage;
  result: ExtractionResult;
  previewRoads: PreviewRoadsResponse | null;
  isPreviewLoading: boolean;
  isExtracting: boolean;
  startExtraction: (vertices: Position[]) => void;
  cancelExtraction: () => void;
  previewRoadsData: (vertices: Position[]) => Promise<void>;
  downloadGraph: () => Promise<void>;
  clearPreview: () => void;
  resetExtraction: () => void;
}

export function useExtraction(): UseExtractionReturn {
  const [stage, setStage] = useState<ExtractionStage>({
    stage: 'idle',
    progress: 0,
  });
  const [result, setResult] = useState<ExtractionResult>({
    downloadUrl: null,
    filename: '',
  });
  const [previewRoads, setPreviewRoads] = useState<PreviewRoadsResponse | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);

  const clearPreview = useCallback(() => {
    setPreviewRoads(null);
  }, []);

  const resetExtraction = useCallback(() => {
    setStage({ stage: 'idle', progress: 0 });
    setResult({ downloadUrl: null, filename: '' });
    setPreviewRoads(null);
    setIsExtracting(false);
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const cancelExtraction = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsExtracting(false);
    setStage({ stage: 'idle', progress: 0 });
  }, []);

  const previewRoadsData = useCallback(async (vertices: Position[]) => {
    if (vertices.length < 3) return;

    setIsPreviewLoading(true);
    clearPreview();

    try {
      const closedCoordinates = [...vertices, vertices[0]];
      const polygonGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [closedCoordinates],
        },
      };

      const response = await axios.post<PreviewRoadsResponse>(
        `${API_BASE_URL}/preview`,
        { polygon: polygonGeoJSON },
        { timeout: 30000 }
      );

      setPreviewRoads(response.data);
    } catch (error) {
      console.error('Error previewing roads:', error);
      // Set empty preview on error
      setPreviewRoads({
        type: 'FeatureCollection',
        features: [],
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [clearPreview]);

  const startExtraction = useCallback((vertices: Position[]) => {
    if (vertices.length < 3) return;

    setIsExtracting(true);
    setStage({ stage: 'downloading', progress: 0 });
    setResult({ downloadUrl: null, filename: '' });

    const closedCoordinates = [...vertices, vertices[0]];
    const polygonGeoJSON = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [closedCoordinates],
      },
    };

    // Create WebSocket connection
    const wsUrl = `${API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/extract`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ polygon: polygonGeoJSON }));
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        setStage({
          stage: data.stage,
          progress: data.progress,
          message: data.message,
        });

        if (data.stage === 'complete' && data.download_url) {
          setResult({
            downloadUrl: data.download_url,
            filename: data.filename || 'graph.graphml',
          });
          setIsExtracting(false);
          ws.close();
        } else if (data.stage === 'error') {
          setIsExtracting(false);
          ws.close();
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStage({
        stage: 'error',
        progress: 0,
        message: 'Connection error. Please try again.',
      });
      setIsExtracting(false);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      wsRef.current = null;
    };
  }, []);

  const downloadGraph = useCallback(async () => {
    if (!result.downloadUrl) return;

    try {
      const downloadUrl = result.downloadUrl.startsWith('http') 
        ? result.downloadUrl 
        : `${API_BASE_URL}${result.downloadUrl}`;

      // Download file
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        FileSystem.documentDirectory + result.filename,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const { uri } = await downloadResumable.downloadAsync() || {};

      if (uri) {
        // Share the file
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/xml',
            dialogTitle: 'Download Graph File',
            UTI: 'public.xml',
          });
        }
      }
    } catch (error) {
      console.error('Error downloading graph:', error);
    }
  }, [result]);

  return {
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
  };
}
