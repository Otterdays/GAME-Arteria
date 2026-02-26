# SBOM (Security Bill of Materials)

*All installed packages and libraries will be tracked here with versions and dates to monitor security.*

## Root Monorepo (`package.json`)

| Date       | Package              | Version   | Purpose                                        |
|------------|----------------------|-----------|-------------------------------------------------|
| 2026-02-26 | expo                 | 54.0.33   | Core React Native framework                    |
| 2026-02-26 | expo-router          | 6.0.23    | File-based routing (hoisted for Babel)          |
| 2026-02-26 | react                | 19.1.0    | UI component library                           |
| 2026-02-26 | react-native         | 0.81.5    | Native UI rendering (New Arch enabled)          |
| 2026-02-26 | babel-preset-expo    | 55.0.8    | Babel preset for Expo (root monorepo, dev)      |

## Mobile App (`apps/mobile/package.json`)

| Date       | Package                        | Version   | Purpose                                |
|------------|--------------------------------|-----------|----------------------------------------|
| 2026-02-26 | @expo/vector-icons             | 15.1.1    | Icon library                           |
| 2026-02-26 | @react-navigation/bottom-tabs  | 7.15.2    | Bottom tab navigator                   |
| 2026-02-26 | @react-navigation/elements     | 2.9.8     | Navigation shared elements             |
| 2026-02-26 | @react-navigation/native       | 7.1.31    | Core navigation                        |
| 2026-02-26 | @reduxjs/toolkit               | 2.11.2    | State management                       |
| 2026-02-26 | expo-constants                 | 18.0.13   | App constants (version, etc.)          |
| 2026-02-26 | expo-dev-client                | 6.0.20    | Custom dev build client                |
| 2026-02-26 | expo-font                      | 14.0.11   | Custom font loading                    |
| 2026-02-26 | expo-haptics                   | 15.0.8    | Haptic feedback                        |
| 2026-02-26 | expo-image                     | 3.0.11    | Image component                        |
| 2026-02-26 | expo-linking                   | 8.0.11    | Deep linking                           |
| 2026-02-26 | expo-router                    | 6.0.23    | File-based routing                     |
| 2026-02-26 | expo-splash-screen             | 31.0.13   | Splash screen                          |
| 2026-02-26 | expo-status-bar                | 3.0.9     | Status bar control                     |
| 2026-02-26 | expo-symbols                   | 1.0.8     | SF Symbols                             |
| 2026-02-26 | expo-system-ui                 | 6.0.9     | System UI control                      |
| 2026-02-26 | expo-web-browser               | 15.0.10   | In-app browser                         |
| 2026-02-26 | react-dom                      | 19.1.0    | Web DOM rendering                      |
| 2026-02-26 | react-native-gesture-handler   | 2.28.0    | Touch gestures                         |
| 2026-02-26 | react-native-mmkv              | 4.1.2     | Fast synchronous storage (saves)       |
| 2026-02-26 | react-native-nitro-modules     | latest    | Native module bridge (MMKV peer dep)   |
| 2026-02-26 | react-native-reanimated        | 4.1.6     | Smooth animations                      |
| 2026-02-26 | react-native-safe-area-context | 5.6.2     | Safe area insets                       |
| 2026-02-26 | react-native-screens           | 4.16.0    | Native screen containers               |
| 2026-02-26 | react-native-web               | 0.21.2    | Web compatibility layer                |
| 2026-02-26 | react-native-worklets          | 0.5.1     | Reanimated worklet threading           |
| 2026-02-26 | react-redux                    | 9.2.0     | React bindings for Redux               |
| 2026-02-26 | typescript                     | 5.9.3     | Type safety (dev)                      |
| 2026-02-26 | eslint                         | 9.39.3    | Linting (dev)                          |
| 2026-02-26 | eslint-config-expo             | 10.0.0    | Expo lint rules (dev)                  |
| 2026-02-26 | @types/react                   | 19.1.17   | React type definitions (dev)           |

## Engine Package (`packages/engine/package.json`)

| Date       | Package              | Version   | Purpose                                |
|------------|----------------------|-----------|----------------------------------------|
| 2026-02-26 | jest                 | 29.7.0    | Unit testing framework (dev)           |
| 2026-02-26 | ts-jest              | 29.4.6    | TypeScript support for Jest (dev)      |
| 2026-02-26 | @types/jest          | 29.5.14   | Jest type definitions (dev)            |
| 2026-02-26 | typescript           | 5.9.3     | Type safety (dev)                      |
