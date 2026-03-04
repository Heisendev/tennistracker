# TennisTracker Mobile Viewer

React Native (Expo) app with exactly two views:
- Live matches list
- Live match viewer (read-only, like web `ViewerMatch`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```
Update `EXPO_PUBLIC_API_URL` to your backend URL.

3. Start app:
```bash
npm run start
```

4. Run on device/simulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR in Expo Go

## Notes

- WebSocket live updates use `/live-updates` and subscribe by `matchId`.
- The app consumes:
  - `GET /live-scoring/sessions`
  - `GET /live-scoring/sessions/:matchId`
  - WebSocket `/live-updates?matchId=...`

## Create separate repository

From workspace root:
```bash
cd mobile-viewer
git init
git add .
git commit -m "Initial mobile viewer app"
```
Then create a new GitHub repo and push this folder.
