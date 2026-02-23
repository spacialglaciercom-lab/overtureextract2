# Quick Start Guide

Get Overture OSM Extractor Mobile running in 5 minutes.

## 1. Install Dependencies

```bash
cd overture-extractor-mobile
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Mapbox token:
```
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
EXPO_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app
```

Get a free Mapbox token at [account.mapbox.com](https://account.mapbox.com).

## 3. Prebuild iOS

```bash
npx expo prebuild -p ios
```

## 4. Run on iOS Simulator

```bash
npx expo run:ios
```

Or press `i` in the Expo CLI after:
```bash
npx expo start
```

## 5. Build for Device (Optional)

```bash
eas build --platform ios --profile simulator
```

## Common Issues

**Mapbox token errors**: Ensure token has `styles:read` and `fonts:read` scopes.

**iOS build fails**: 
```bash
cd ios && pod install && cd ..
```

**Metro bundler issues**:
```bash
npx expo start --clear
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Configure your backend API endpoints
- Customize map styles in `constants/mapStyles.ts`
