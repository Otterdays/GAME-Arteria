# ARCHITECTURE

## Tech Stack (as of Feb 2026)
- **Framework:** Expo SDK 54 (React Native 0.81.5, New Architecture enabled)
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** Redux Toolkit (RTK) 2.11.2 + react-redux 9.2.0
- **Local Storage:** react-native-mmkv 4.1.2 (fast synchronous KV store for saves)
- **Routing:** Expo Router v6.0.23 (file-based)
- **Animations:** React Native Reanimated v4.1.6
- **Testing:** Jest 29.7 + ts-jest 29.4 (engine package)
- **Build System:** EAS (Expo Application Services) — cloud builds, no local android/ folder

## Monorepo Structure (npm workspaces)

```
Arteria/
├── babel.config.js          # Root Babel config (required for monorepo hoisting)
├── package.json             # Root monorepo config (workspaces, hoisted deps)
├── 0_Start_Dev_Server.bat   # Starts Metro dev server
├── Update_1_Git_Push.bat    # Git commit + push
├── Update_2_EAS_OTA_Update.bat  # OTA update to players
├── Update_3_EAS_Build_Android_Dev.bat   # Dev APK build
├── Update_4_EAS_Build_Android_Prod.bat  # Production AAB build
├── apps/
│   └── mobile/              # Expo React Native app
│       ├── index.js         # Entry proxy (bridges to expo-router/entry)
│       ├── babel.config.js  # Mobile Babel config
│       ├── metro.config.js  # Metro config (monorepo watchFolders)
│       ├── eas.json         # EAS build profiles
│       ├── app.json         # Expo app config
│       ├── app/             # Expo Router screens
│       │   ├── _layout.tsx  # Root layout (Redux Provider)
│       │   ├── modal.tsx    # Modal screen
│       │   └── (tabs)/      # Bottom tab navigation
│       │       ├── _layout.tsx   # Tab bar config
│       │       ├── index.tsx     # Skills screen
│       │       ├── combat.tsx    # Combat screen
│       │       ├── bank.tsx      # Bank screen
│       │       ├── shop.tsx      # Shop screen
│       │       ├── settings.tsx  # Settings screen
│       │       └── explore.tsx   # Explore screen
│       ├── store/           # Redux store
│       │   ├── index.ts     # Store config
│       │   ├── gameSlice.ts # Player state slice
│       │   ├── hooks.ts     # Typed useDispatch/useSelector
│       │   └── persistence.ts  # MMKV persistence helpers
│       ├── constants/
│       │   └── theme.ts     # Dark Melvor palette + design tokens
│       ├── components/      # Reusable UI components
│       └── hooks/           # Custom hooks (game loop, persistence, etc.)
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
└── DOCS/                    # Project documentation
```

## Data Flow
1. **App opens** → Load saved PlayerState from MMKV
2. **Offline calc** → `GameEngine.processOffline(playerState)` computes delta since last save
3. **Redux dispatch** → OfflineReport applied to Redux store via `gameSlice` actions
4. **Foreground loop** → `setInterval` calls `GameEngine.processRealtime()` every ~100ms
5. **App backgrounds** → Save PlayerState to MMKV with current timestamp

## Monorepo Babel/Metro Notes
- `babel-preset-expo` is installed at **both** the root and `apps/mobile` levels.
- The root `babel.config.js` exists because NPM hoists `expo-router` to root `node_modules`, and Babel needs to process it with the Expo preset.
- `apps/mobile/index.js` is a thin proxy (`import "expo-router/entry"`) that keeps the entry point inside the project directory so Babel doesn't skip it.
- `metro.config.js` sets `watchFolders` to the workspace root and `nodeModulesPaths` to both local and root `node_modules`.
