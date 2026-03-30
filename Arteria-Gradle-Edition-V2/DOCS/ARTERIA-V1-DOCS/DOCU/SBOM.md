# SBOM (Security Bill of Materials)

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

*All installed packages and libraries tracked here with versions, available updates, and perceived release dates for security and freshness.*

**Table columns:** **Current** = installed version · **Available** = latest on npm · **Release** = perceived/known release date of Available.

---

## Verification Update (2026-03-21)

- **Audit performed:** Executed dependency audit suite (`Audit_Deps.bat`).
- **Fixes applied:** Patched 2 high severity vulnerabilities (`flatted`, `svgo`) via `npm audit fix`.
- **Status:** 0 vulnerabilities remaining.
- **Previous Update (2026-03-08):**
- **Verified against:** root `package.json`, workspace manifests, lockfiles, `npm outdated`, and live package resolution from each workspace.
- **Active app truth:** the current mobile app is `apps/mobile`, not the separate legacy `mobile/` folder.
- **Legacy note:** `mobile/package.json` still exists and is on the older Expo 54 / React 19.1 / React Native 0.81 stack, but it is **not** in the root workspaces list.
- **Newly tracked here:** `tools/info_scraper/package.json` is now included in the SBOM.
- **Follow-up modernization pass:** safe dependency updates applied on 2026-03-08; table values below reflect the post-update state.

---

## Root Monorepo (`package.json`)

| Date       | Package              | Current   | Available | Release (perceived) | Purpose                                        |
|------------|----------------------|-----------|-----------|----------------------|-------------------------------------------------|
| 2026-03-08 | expo                 | 55.0.5    | 55.0.5    | 2026                 | Core React Native framework                    |
| 2026-03-08 | expo-router          | 55.0.4    | 55.0.4    | 2026                 | File-based routing (hoisted for Babel)         |
| 2026-03-08 | react                | 19.2.4    | 19.2.4    | current              | UI component library                           |
| 2026-03-08 | react-native         | 0.83.2    | 0.84.1    | 2026                 | Native UI rendering (New Arch only in SDK 55)  |
| 2026-03-08 | react-native-nitro-modules | 0.35.0    | 0.35.0    | 2026                 | Native module bridge (MMKV peer dep)           |
| 2026-03-08 | babel-preset-expo    | 55.0.10   | 55.0.10   | 2026                 | Babel preset for Expo (root monorepo, dev)     |
| 2026-03-08 | jest                 | 29.7.0    | 30.2.0    | 2026                 | Root test runner (dev)                         |
| 2026-03-08 | ts-jest              | 29.4.6    | 29.4.6    | current              | TypeScript support for Jest (dev)              |
| 2026-03-08 | @types/jest          | 29.5.14   | 30.0.0    | 2026                 | Jest type definitions (dev)                    |

---

## Mobile App (`apps/mobile/package.json`)

| Date       | Package                        | Current   | Available | Release (perceived) | Purpose                                |
|------------|--------------------------------|-----------|-----------|----------------------|----------------------------------------|
| 2026-03-08 | @expo-google-fonts/cinzel      | 0.4.2     | 0.4.2     | current              | Cinzel font family                     |
| 2026-03-08 | @expo/vector-icons             | 15.1.1    | 15.1.1    | current              | Icon library                           |
| 2026-03-08 | @react-navigation/bottom-tabs  | 7.15.5    | 7.15.5    | 2026                 | Bottom tab navigator                   |
| 2026-03-08 | @react-navigation/elements     | 2.9.10    | 2.9.10    | current              | Navigation shared elements             |
| 2026-03-08 | @react-navigation/native       | 7.1.33    | 7.1.33    | current              | Core navigation                        |
| 2026-03-08 | @reduxjs/toolkit               | 2.11.2    | 2.11.2    | current              | State management                       |
| 2026-03-08 | @types/react                   | 19.2.14   | 19.2.14   | current              | React type definitions (dev)           |
| 2026-03-08 | expo                           | 55.0.5    | 55.0.5    | 2026                 | Core framework                         |
| 2026-03-08 | expo-audio                     | 55.0.8    | 55.0.8    | current              | Audio playback (SFX: tink, thump, splash) |
| 2026-03-08 | expo-constants                 | 55.0.7    | 55.0.7    | current              | App constants (version, etc.)          |
| 2026-03-08 | expo-dev-client                | 55.0.11   | 55.0.11   | current              | Custom dev build client                |
| 2026-03-08 | expo-font                      | 55.0.4    | 55.0.4    | current              | Custom font loading                    |
| 2026-03-08 | expo-haptics                   | 55.0.8    | 55.0.8    | current              | Haptic feedback                        |
| 2026-03-08 | expo-image                     | 55.0.6    | 55.0.6    | current              | Image component                        |
| 2026-03-08 | expo-linear-gradient           | 55.0.8    | 55.0.8    | current              | Gradient backgrounds                   |
| 2026-03-08 | expo-linking                   | 55.0.7    | 55.0.7    | current              | Deep linking                           |
| 2026-03-08 | expo-notifications             | 55.0.11   | 55.0.11   | current              | Local/push notifications               |
| 2026-03-08 | expo-router                    | 55.0.4    | 55.0.4    | current              | File-based routing                     |
| 2026-03-08 | expo-splash-screen             | 55.0.10   | 55.0.10   | current              | Splash screen                          |
| 2026-03-08 | expo-status-bar                | 55.0.4    | 55.0.4    | current              | Status bar control                     |
| 2026-03-08 | expo-symbols                   | 55.0.5    | 55.0.5    | current              | SF Symbols                             |
| 2026-03-08 | expo-system-ui                 | 55.0.9    | 55.0.9    | current              | System UI control                      |
| 2026-03-08 | expo-updates                   | 55.0.12   | 55.0.12   | current              | Over-the-air (OTA) updates             |
| 2026-03-08 | expo-web-browser               | 55.0.9    | 55.0.9    | current              | In-app browser                         |
| 2026-03-08 | eslint                         | 9.39.3    | 10.0.3    | 2026                 | Linting (dev; ESLint 10 currently breaks this Expo lint stack) |
| 2026-03-08 | eslint-config-expo             | 55.0.0    | 55.0.0    | current              | Expo lint rules (dev)                  |
| 2026-03-08 | react                          | 19.2.4    | 19.2.4    | current              | UI library                             |
| 2026-03-08 | react-dom                      | 19.2.4    | 19.2.4    | current              | Web DOM rendering                      |
| 2026-03-08 | react-native                   | 0.83.2    | 0.84.1    | 2026                 | Native UI (bundled with Expo SDK)      |
| 2026-03-08 | react-native-gesture-handler   | 2.30.0    | 2.30.0    | current              | Touch gestures                         |
| 2026-03-08 | react-native-mmkv              | 4.2.0     | 4.2.0     | current              | Fast synchronous storage (saves)       |
| 2026-03-08 | react-native-reanimated        | 4.2.2     | 4.2.2     | current              | Smooth animations                      |
| 2026-03-08 | react-native-safe-area-context | 5.6.2     | 5.7.0     | 2026                 | Safe area insets                       |
| 2026-03-08 | react-native-screens           | 4.23.0    | 4.24.0    | 2026                 | Native screen containers               |
| 2026-03-08 | react-native-svg               | 15.15.3   | 15.15.3   | current              | SVG rendering (Goblin Peek modal)      |
| 2026-03-08 | react-native-svg-transformer   | 1.5.3     | 1.5.3     | current              | Import .svg as React components (dev)  |
| 2026-03-08 | react-native-web               | 0.21.2    | 0.21.2    | current              | Web compatibility layer                |
| 2026-03-08 | react-native-worklets          | 0.7.4     | 0.7.4     | current              | Reanimated worklet threading           |
| 2026-03-08 | react-redux                    | 9.2.0     | 9.2.0     | current              | React bindings for Redux               |
| 2026-03-08 | typescript                     | 5.9.3     | 5.9.3     | current              | Type safety (dev)                      |

---

## Engine Package (`packages/engine/package.json`)

| Date       | Package       | Current   | Available | Release (perceived) | Purpose                                |
|------------|---------------|-----------|-----------|----------------------|----------------------------------------|
| 2026-03-08 | jest          | 29.7.0    | 30.2.0    | 2026                 | Unit testing framework (dev)           |
| 2026-03-08 | ts-jest       | 29.4.6    | 29.4.6    | current              | TypeScript support for Jest (dev)      |
| 2026-03-08 | @types/jest   | 29.5.14   | 30.0.0    | 2026                 | Jest type definitions (dev)            |
| 2026-03-08 | @jest/globals | 29.7.0    | 30.2.0    | 2026                 | Jest globals (dev)                     |
| 2026-03-08 | tsconfigs     | 5.0.0     | 5.0.0     | current              | Shared TypeScript configs (dev)        |
| 2026-03-08 | typescript    | 5.9.3     | 5.9.3     | current              | Type safety (dev)                      |

---

## Info Scraper Tool (`tools/info_scraper/package.json`)

| Date       | Package    | Current   | Available | Release (perceived) | Purpose                                |
|------------|------------|-----------|-----------|----------------------|----------------------------------------|
| 2026-03-08 | express    | 4.22.1    | 5.2.1     | 2026                 | Lightweight local web server           |
| 2026-03-08 | playwright | 1.58.2    | 1.58.2    | current              | Browser automation and scraping        |
| 2026-03-08 | turndown   | 7.2.2     | 7.2.2     | current              | HTML to Markdown conversion            |

---

## Legacy Manifest Note (`mobile/package.json`)

- `mobile/package.json` still exists outside the workspace list and declares an older Expo 54-era app.
- Current declared stack there is roughly: Expo 54.0.33, React 19.1.0, React Native 0.81.5.
- Treat it as legacy/reference-only unless the project intentionally revives that folder.

---

## Summary

- **Active stack truth:** The live app stack is already on Expo SDK 55, React 19.2.4, and React Native 0.83.2 in `apps/mobile`.
- **Patch upgrades completed:** Root `expo`, `expo-router`, `babel-preset-expo`; mobile `@react-navigation/bottom-tabs`, `expo-dev-client`, `expo-notifications`, `expo-splash-screen`, and `react-native-mmkv`.
- **Remaining upgrade candidates:** Jest 30.x, `react-native-nitro-modules` 0.35.0, `react-native-safe-area-context` 5.7.0, `react-native-screens` 4.24.0, and React Native 0.84.1.
- **Lint tooling note:** ESLint 10.x is still incompatible with the current `eslint-config-expo@55.0.0` + `eslint-plugin-react@7.37.5` stack here, so the working line is ESLint 9.x for now.
- **Higher-risk item:** React Native 0.84.1 exists, but it should be treated as a framework-level upgrade coordinated with Expo support, not a casual bump.
- **Legacy caution:** `mobile/package.json` is stale relative to the active app and should not be used as the source of truth for modernization planning.

*Update this SBOM when adding/removing packages (see user rules).*
