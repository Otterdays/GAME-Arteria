# SBOM (Security Bill of Materials)

*All installed packages and libraries tracked here with versions, available updates, and perceived release dates for security and freshness.*

**Table columns:** **Current** = installed version · **Available** = latest on npm · **Release** = perceived/known release date of Available.

---

## Root Monorepo (`package.json`)

| Date       | Package              | Current   | Available | Release (perceived) | Purpose                                        |
|------------|----------------------|-----------|-----------|----------------------|-------------------------------------------------|
| 2026-02-26 | expo                 | 55.0.2    | 55.0.2    | Jan 2026 (SDK 55)    | Core React Native framework                    |
| 2026-02-26 | expo-router          | 55.0.2    | 55.0.2    | Jan 2026             | File-based routing (hoisted for Babel)         |
| 2026-02-26 | react                | 19.2.4    | 19.2.4    | 2026                 | UI component library                           |
| 2026-02-26 | react-native         | 0.83.2    | 0.84.0    | 2026                 | Native UI rendering (New Arch only in SDK 55)  |
| 2026-02-26 | react-native-nitro-modules | 0.34.0 | (pinned)  | —                    | Native module bridge (MMKV peer dep)           |
| 2026-02-26 | babel-preset-expo    | 55.0.8    | 55.0.8    | current              | Babel preset for Expo (root monorepo, dev)     |

---

## Mobile App (`apps/mobile/package.json`)

| Date       | Package                        | Current   | Available | Release (perceived) | Purpose                                |
|------------|--------------------------------|-----------|-----------|----------------------|----------------------------------------|
| 2026-02-26 | @expo/vector-icons             | 15.1.1    | (SDK 54)  | current              | Icon library                           |
| 2026-02-26 | @react-navigation/bottom-tabs    | 7.15.2    | 7.15.2    | current              | Bottom tab navigator                   |
| 2026-02-26 | @react-navigation/elements      | 2.9.8     | 2.9.8     | current              | Navigation shared elements             |
| 2026-02-26 | @react-navigation/native       | 7.1.31    | 7.1.31    | current              | Core navigation                        |
| 2026-02-26 | @reduxjs/toolkit               | 2.11.2    | 2.11.2    | current              | State management                       |
| 2026-02-26 | @types/react                   | 19.1.17   | 19.2.14   | 2026                 | React type definitions (dev)          |
| 2026-02-26 | expo                           | 54.0.33   | 55.0.2    | Jan 2026 (SDK 55)    | Core framework                         |
| 2026-02-26 | expo-constants                 | 18.0.13   | 55.0.7    | Jan 2026             | App constants (version, etc.)          |
| 2026-02-26 | expo-dev-client                | 6.0.20    | 55.0.9    | Jan 2026             | Custom dev build client                |
| 2026-02-26 | expo-font                       | 14.0.11   | 55.0.4    | Jan 2026             | Custom font loading                    |
| 2026-02-26 | expo-haptics                    | 15.0.8    | 55.0.8    | Jan 2026             | Haptic feedback                        |
| 2026-02-26 | expo-image                      | 3.0.11    | 55.0.5    | Jan 2026             | Image component                        |
| 2026-02-26 | expo-linking                    | 8.0.11    | 55.0.7    | Jan 2026             | Deep linking                           |
| 2026-02-26 | expo-router                     | 6.0.23    | 55.0.2    | Jan 2026             | File-based routing                     |
| 2026-02-26 | expo-splash-screen              | 31.0.13   | 55.0.9    | Jan 2026             | Splash screen                          |
| 2026-02-26 | expo-status-bar                 | 3.0.9     | 55.0.4    | Jan 2026             | Status bar control                     |
| 2026-02-26 | expo-symbols                    | 1.0.8     | 55.0.4    | Jan 2026             | SF Symbols                             |
| 2026-02-26 | expo-system-ui                  | 6.0.9     | 55.0.9    | Jan 2026             | System UI control                      |
| 2026-02-26 | expo-web-browser                | 15.0.10   | 55.0.9    | Jan 2026             | In-app browser                         |
| 2026-02-26 | eslint                          | 9.39.3    | 10.0.2     | 2026                 | Linting (dev)                          |
| 2026-02-26 | eslint-config-expo              | 10.0.0    | 55.0.0     | Jan 2026             | Expo lint rules (dev)                  |
| 2026-02-26 | react                           | 19.1.0    | 19.2.4    | 2026                 | UI library                             |
| 2026-02-26 | react-dom                       | 19.1.0    | 19.2.4    | 2026                 | Web DOM rendering                      |
| 2026-02-26 | react-native                    | 0.81.5    | 0.84.0    | 2026                 | Native UI (bundled with Expo SDK)       |
| 2026-02-26 | react-native-gesture-handler    | 2.28.0    | 2.30.0    | recent               | Touch gestures                         |
| 2026-02-26 | react-native-mmkv               | 4.1.2     | 4.1.2     | current              | Fast synchronous storage (saves)       |
| 2026-02-26 | react-native-reanimated         | 4.1.6     | 4.2.2     | recent               | Smooth animations                      |
| 2026-02-26 | react-native-safe-area-context  | 5.6.2     | 5.7.0     | recent               | Safe area insets                       |
| 2026-02-26 | react-native-screens            | 4.16.0    | 4.24.0    | recent               | Native screen containers               |
| 2026-02-26 | react-native-web                | 0.21.2    | 0.21.2    | current              | Web compatibility layer                |
| 2026-02-26 | react-native-worklets           | 0.5.1     | 0.7.4     | recent               | Reanimated worklet threading            |
| 2026-02-26 | react-redux                     | 9.2.0     | 9.2.0     | current              | React bindings for Redux               |
| 2026-02-26 | typescript                      | 5.9.3     | 5.9.3     | current              | Type safety (dev)                      |

---

## Engine Package (`packages/engine/package.json`)

| Date       | Package       | Current   | Available | Release (perceived) | Purpose                                |
|------------|---------------|-----------|-----------|----------------------|----------------------------------------|
| 2026-02-26 | jest          | 29.7.0    | 30.2.0    | 2026                 | Unit testing framework (dev)           |
| 2026-02-26 | ts-jest       | 29.4.6    | 29.4.6    | current              | TypeScript support for Jest (dev)      |
| 2026-02-26 | @types/jest   | 29.5.14   | 30.0.0    | 2026                 | Jest type definitions (dev)            |
| 2026-02-26 | @jest/globals | 29.7.0    | 30.2.0    | 2026                 | Jest globals (dev)                      |
| 2026-02-26 | typescript    | 5.9.3     | 5.9.3     | current              | Type safety (dev)                      |

---

## Summary

- **Current stack:** Expo SDK 54, React 19.1, React Native 0.81.5.
- **Available major upgrade:** Expo SDK 55 (Jan 2026) with RN 0.83 and React 19.2; requires migration (New Arch only).
- **Minor/patch:** React 19.2.4, react-native-reanimated 4.2.2, react-native-screens 4.24.0, Jest 30.x, ESLint 10.x have newer versions; upgrade when convenient and after testing.
- **Release (perceived):** Based on npm latest + Expo/React release notes; "current" = no newer release tracked; "recent" = minor/patch in 2025–2026.

*Update this SBOM when adding/removing packages (see user rules).*
