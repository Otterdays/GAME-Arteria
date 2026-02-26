# ARCHITECTURE

## Tech Stack (as of Feb 2026)
- **Framework:** Expo SDK 54 (React Native 0.81.5, New Architecture enabled)
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** Redux Toolkit (RTK) + react-redux
- **Local Storage:** react-native-mmkv (fast synchronous KV store for saves)
- **Routing:** Expo Router v6 (file-based)
- **Animations:** React Native Reanimated v4
- **Testing:** Jest + ts-jest (engine package)

## Monorepo Structure (npm workspaces)

```
Arteria/
├── apps/
│   └── mobile/              # Expo React Native app
│       ├── app/             # Expo Router screens
│       │   ├── _layout.tsx  # Root layout (Redux Provider)
│       │   └── (tabs)/      # Bottom tab navigation
│       ├── store/           # Redux store
│       │   ├── index.ts     # Store config
│       │   ├── gameSlice.ts # Player state slice
│       │   └── hooks.ts     # Typed useDispatch/useSelector
│       └── ...
├── packages/
│   └── engine/              # Pure TypeScript game engine (zero React deps)
│       └── src/
│           ├── index.ts     # Public API barrel
│           ├── types.ts     # All type definitions
│           ├── XPTable.ts   # RuneScape-style XP curve
│           ├── TickSystem.ts# Delta-time tick processor
│           ├── GameEngine.ts# Offline/realtime orchestrator
│           └── data/
│               ├── mining.ts       # Mining action defs
│               └── playerFactory.ts# New player creator
├── DOCS/                    # Project documentation
└── package.json             # Root monorepo config
```

## Data Flow
1. **App opens** → Load saved PlayerState from MMKV
2. **Offline calc** → `GameEngine.processOffline(playerState)` computes delta since last save
3. **Redux dispatch** → OfflineReport applied to Redux store via `gameSlice` actions
4. **Foreground loop** → `setInterval` calls `GameEngine.processRealtime()` every ~100ms
5. **App backgrounds** → Save PlayerState to MMKV with current timestamp
