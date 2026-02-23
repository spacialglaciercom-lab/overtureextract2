# Changelog

All notable changes to Overture OSM Extractor Mobile.

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of Overture OSM Extractor Mobile
- Full-screen Mapbox map with Carto Dark Matter tiles
- Custom polygon drawing with tap-to-add vertices
- Real-time area and perimeter calculations using Turf.js
- Live measurement card showing km² and km
- iOS-style bottom sheet with Gorhom bottom-sheet
- Road data preview functionality
- WebSocket-based extraction with progress tracking
- File download and iOS share sheet integration
- Geolocation and compass controls
- Drawing toolbar with polygon and trash buttons
- Animated progress bar for extraction stages
- Support for up to 500 vertices at 60fps

### Technical
- React Native + Expo SDK 51
- @rnmapbox/maps for Mapbox integration
- @turf/turf for geospatial calculations
- react-native-reanimated for smooth animations
- expo-location for geolocation
- expo-file-system and expo-sharing for downloads
- TypeScript throughout
- Custom hooks for state management

## Future Enhancements

- [ ] Offline map support
- [ ] Multiple polygon management
- [ ] Polygon editing (move vertices)
- [ ] Save/load polygons
- [ ] Dark/light theme toggle
- [ ] Android support
- [ ] Unit tests
- [ ] E2E testing with Detox
