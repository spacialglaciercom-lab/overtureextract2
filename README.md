# Overture OSM Extractor Mobile

A native iOS polygon-draw map tool that lets users draw a boundary on a map, see live measurements, preview Overture road data, and trigger backend extraction. Mirrors the web version but with fully native iOS UX.

> **Backend:** The API and WebSocket extraction service for this app is intended to run on **[Railway](https://railway.app)**. Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to your Railway app URL (e.g. `https://your-app.up.railway.app`).

![iOS App Screenshot](assets/images/screenshot.png)

## Features

- **Full-screen Mapbox Map** - Vector tile rendering with Carto Dark Matter style
- **Custom Polygon Drawing** - Tap-to-add vertices with visual feedback
- **Live Measurements** - Real-time area and perimeter calculations using Turf.js
- **Road Data Preview** - Preview Overture road data within your polygon
- **WebSocket Extraction** - Real-time progress tracking for graph extraction
- **File Download & Share** - Download extracted graph files with iOS share sheet
- **Native iOS UI** - Bottom sheets, floating controls, iOS system fonts and colors

## Tech Stack

- **React Native + Expo** (SDK 51+) with Expo Router for navigation
- **@rnmapbox/maps** - Mapbox Maps SDK for React Native
- **@turf/turf** - Real-time area/perimeter calculations
- **@gorhom/bottom-sheet** - iOS-style bottom sheet modal
- **react-native-reanimated + react-native-gesture-handler** - Smooth animations
- **axios + WebSocket** - Backend communication
- **expo-file-system + expo-sharing** - File download/export
- **expo-location** - Geolocation and compass centering

## Prerequisites

- Node.js 18+ 
- iOS Simulator (macOS with Xcode) or physical iOS device
- Mapbox access token (free at [mapbox.com](https://account.mapbox.com))
- EAS CLI for builds: `npm install -g eas-cli`

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/spacialglaciercom-lab/overtureextract2.git
   cd overtureextract2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```
   EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here
   EXPO_PUBLIC_API_BASE_URL=https://your-app.up.railway.app
   EXPO_PUBLIC_MAP_STYLE=https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json
   ```

4. **Prebuild for iOS**
   ```bash
   npx expo prebuild -p ios
   ```

## Running the App

### iOS Simulator

```bash
npx expo run:ios
# or
npm run ios
```

### Physical iOS Device

```bash
npx expo run:ios --device
```

### Development Mode

```bash
npx expo start
# Then press 'i' for iOS
```

## Building for Production

### Configure EAS

1. **Login to Expo**
   ```bash
   eas login
   ```

2. **Configure project**
   ```bash
   eas build:configure
   ```

### Build Commands

**iOS Simulator Build**
```bash
eas build --platform ios --profile simulator
```

**Internal Distribution (TestFlight)**
```bash
eas build --platform ios --profile preview
```

**App Store Production**
```bash
eas build --platform ios --profile production
```

**Submit to App Store**
```bash
eas submit --platform ios
```

## Project Structure

```
overture-extractor-mobile/
├── app/
│   ├── tabs/
│   │   └── index.tsx          # Main map screen
│   └── _layout.tsx            # Root layout with providers
├── components/
│   ├── MapView.tsx            # Mapbox map + drawing layers
│   ├── DrawingToolbar.tsx     # Polygon + trash buttons
│   ├── MeasurementCard.tsx    # Live km²/km overlay
│   ├── ExtractionSheet.tsx    # Gorhom bottom sheet
│   ├── ProgressBar.tsx        # Animated WebSocket progress
│   ├── TopControls.tsx        # Compass + geolocation
│   └── DrawingModeIndicator.tsx # Drawing mode UI
├── hooks/
│   ├── usePolygonDraw.ts      # Drawing state/logic
│   ├── useMeasurements.ts     # Turf.js calculations
│   ├── useExtraction.ts       # WebSocket + download
│   └── useLocation.ts         # Geolocation
├── constants/
│   ├── mapStyles.ts           # Layer styles, colors
│   └── types.ts               # TypeScript types
├── app.json                   # Expo configuration
├── eas.json                   # EAS build profiles
├── .env                       # Environment variables
└── package.json
```

## Core Drawing Logic

```typescript
const handleMapPress = useCallback((e: MapPressEvent) => {
  if (!isDrawing) return;
  const coord = e.geometry.coordinates as Position;
  
  // Snap to first vertex to close polygon
  if (vertices.length > 2) {
    const first = point(vertices[0]);
    const tapped = point(coord);
    const dist = distance(first, tapped, { units: 'kilometers' });
    if (dist < 0.05) { // 50m snap radius
      closePolygon();
      return;
    }
  }
  setVertices(prev => [...prev, coord]);
}, [isDrawing, vertices]);
```

## WebSocket Extraction Flow

```typescript
const startExtraction = (polygonGeoJSON: GeoJSON) => {
  const ws = new WebSocket('wss://your-backend.up.railway.app/ws/extract');
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ polygon: polygonGeoJSON }));
  };
  
  ws.onmessage = (event) => {
    const { stage, progress, download_url } = JSON.parse(event.data);
    setExtractionProgress({ stage, progress });
    if (stage === 'complete') {
      setDownloadUrl(download_url);
      ws.close();
    }
  };
};
```

## Mapbox Layer Styles

```typescript
// Drawing line style
const lineStyle: LineLayerStyle = {
  lineColor: '#007AFF',       // iOS blue
  lineWidth: 2.5,
  lineOpacity: 0.9,
  lineDasharray: [2, 1]       // dashed while drawing
};

// Closed polygon fill
const fillStyle: FillLayerStyle = {
  fillColor: '#007AFF',
  fillOpacity: 0.15,
  fillOutlineColor: '#007AFF'
};

// Vertex dots
const circleStyle: CircleLayerStyle = {
  circleRadius: 6,
  circleColor: '#FFFFFF',
  circleStrokeColor: '#007AFF',
  circleStrokeWidth: 2
};
```

## Environment Configuration

### Mapbox Token

Get your free Mapbox access token at [account.mapbox.com](https://account.mapbox.com).

**Important**: The token needs the following scopes:
- `styles:read`
- `fonts:read`

### Backend API

The app expects a backend API with the following endpoints:

- `POST /preview` - Preview roads within polygon
  ```json
  {
    "polygon": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      }
    }
  }
  ```

- `WS /ws/extract` - WebSocket for extraction progress
  ```json
  // Request
  { "polygon": { ... } }
  
  // Response
  { "stage": "downloading|clipping|building|complete", "progress": 0-100 }
  ```

### Map Styles

**CartoDB (Free, Default)**
```
https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json
```

**Stadia Maps** (requires API key)
```
https://tiles.stadiamaps.com/styles/dark.json?api_key=YOUR_KEY
```

**Mapbox** (requires token)
```
mapbox://styles/mapbox/dark-v11
```

## Performance Targets

- Polygon vertex rendering: 60fps with up to 500 vertices
- Turf.js measurement recalculation: < 16ms per vertex add
- Backend preview road render: < 3 seconds for 10 km² area
- Full extraction WebSocket flow: < 30 seconds for 10 km²

## Troubleshooting

### Mapbox token errors
Ensure your token has the correct scopes and is set in `.env` file.

### iOS build errors
```bash
cd ios && pod install && cd ..
npx expo run:ios
```

### Location permission denied
Go to iOS Settings > Privacy & Security > Location Services > Overture Extractor > Allow While Using App

### WebSocket connection issues
Ensure your backend URL uses `wss://` for HTTPS backends.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open a GitHub issue or contact the maintainers.

---

Built with ❤️ using React Native, Expo, and Mapbox.
