# FUTURE NOTES — Research & Forward Planning

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
**Last Updated:** 2026-02-26 | **Source:** Arize MCP + Web Research

This document captures research-based insights to guide future development decisions for Arteria.
Do not delete — append new entries at the bottom.

---

## ⚠️ CRITICAL: Expo SDK 55 Migration (When Ready)

SDK 54 is the **last version supporting the Legacy Architecture**.
SDK 55 (React Native 0.83.1, React 19.2.0) makes New Architecture **mandatory**.

### What Changes in SDK 55
| Area | Change | Action Required |
|------|--------|----------------|
| New Architecture | Mandatory, `newArchEnabled` flag removed from `app.json` | Delete the flag when upgrading |
| Legacy Architecture | Dropped entirely | No action, we're already on New Arch |
| `notification` field in `app.json` | Removed — causes prebuild failure | Migrate to `expo-notifications` config plugin |
| Expo Go + Push Notifications (Android) | Hard error instead of warning | Use Dev Client (already doing this ✅) |
| `expo-av` | Removed from Expo Go | Migrate to `expo-video` + `expo-audio` when needed |
| Package versioning | All Expo packages share the SDK major version (e.g., `expo-camera@^55.0.0`) | Update SBOM checks |
| Hermes v1 | Opt-in for Hermes v1 — smaller EAS Update bundles (~75% smaller) | Opt in when stable |

### SDK 55 Migration Steps (When We're Ready)
```sh
# 1. Upgrade
npx expo install expo@next --fix

# 2. Remove newArchEnabled from app.json (it's now meaningless)

# 3. Delete android/ (we use CNG, so Expo regenerates it)

# 4. Check for library incompatibilities
npx expo-doctor@latest

# 5. Rebuild Development Build via EAS
```

---

## 🗺️ Monorepo Best Practices (SDK 54+)

### Autolinking Improvement (SDK 54)
SDK 54 introduced a **new autolinking algorithm** for monorepos. Enable it now for better reliability:

```json
// apps/mobile/app.json
{
  "expo": {
    "experiments": {
      "autolinkingModuleResolution": "yarn-workspaces"
    }
  }
}
```
> From SDK 55+, this becomes the automatic default for monorepos.

### Isolated Dependencies (SDK 54+)
If the project ever migrates to **pnpm** or **Bun**, they support isolated dependency installation
which prevents duplicate `react` / `react-native` versions across workspaces — a common source of
runtime crashes. Worth considering if npm hoisting causes more pain.

### Metro Config (Good News)
Since SDK 52+, `expo/metro-config` handles monorepo `watchFolders` and `nodeModulesPaths` automatically.
Our manual `metro.config.js` settings are correct; future upgrades should verify this remains aligned.

---

## 💾 MMKV Persistence Strategy

### Current Approach (Direct MMKV)
We use MMKV directly for save/load in `persistence.ts`. This is **valid and recommended** for our use case.

### Direct MMKV vs redux-persist + MMKV
| Approach | Best For | Overhead |
|----------|----------|----------|
| **Direct MMKV** (our current plan) | Game save data, fast tick-level reads | Very low |
| **redux-persist + MMKV** | Persisting entire Redux slices automatically | Adds redux-persist dependency |

**Recommendation for Arteria:** Stay with direct MMKV for game saves (PlayerState).
If we ever need to auto-persist Redux slices (e.g., settings, auth), add `redux-persist` then.

### MMKV v4 Notes (Nitro Rewrite)
MMKV v4.x was rewritten using the Nitro native module system:
- ~30x faster than AsyncStorage
- Fully synchronous API (no async/await needed)
- Built-in encryption support (useful for anti-cheat timestamp storage)
- Multiple instances supported (e.g., separate `playerSave` and `settings` stores)

### Custom redux-persist Storage Wrapper (if ever needed)
```typescript
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
```

---

## 🎮 Game Loop & Offline Progression Patterns

### Offline Calculation Formula
```typescript
// Standard idle RPG pattern
const gained = Math.floor((now - lastSaved) / TICK_MS) * ratePerTick;
```

### Important Caps and Guards
- **Cap max offline duration** (e.g., 24 hours) to prevent exploit and calculation overflows
- **Validate timestamps** — never trust `Date.now()` alone for anti-cheat; store on backend if needed
- **Clock manipulation resistance:** Store last-save timestamp server-side for competitive features

### Background Task Reality on Mobile
| Platform | Reality |
|----------|---------|
| **Android** | Headless JS can run when app is closed, but Android 12+ restricts launching bg tasks from bg |
| **iOS** | Only a few minutes allowed; no true background game loop without audio/location hacks |

**Our Architecture Decision (Correct):** We use timestamp-based offline calculation, NOT a true
background loop. This is the right call — it's reliable, battery-friendly, and works on all platforms.
The `GameEngine.processOffline()` pattern is industry-standard for idle RPGs.

### setInterval Tick Loop Gotchas
- `setInterval` in React Native can drift under heavy load; use delta-time: `const delta = now - lastTick`
- Clear the interval in `useEffect` cleanup to prevent memory leaks
- Consider `AppState` listener to pause/resume the loop on background/foreground transitions

```typescript
// Recommended foreground loop pattern
useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'background') saveToMMKV();
    if (state === 'active') loadFromMMKV();
  });
  return () => subscription.remove();
}, []);
```

---

## 🔮 Future Feature Considerations (YAGNI — Do Not Build Yet)

- **SQLite via expo-sqlite:** Consider if PlayerState grows beyond simple KV (e.g., item history, combat logs)
- **Hermes v1 (OTA update size 75% reduction):** Opt in when SDK 55 migration is done
- **expo-widgets (iOS alpha in SDK 55):** Could surface Arteria skill progress as a Lock Screen widget — interesting UX opportunity
- **Turborepo or Nx:** If monorepo complexity grows beyond 2 packages, these tools help with caching and parallel builds
- **Anti-cheat backend timestamps:** Store `lastSaved` server-side via a lightweight API if leaderboards are ever added

---

## 📋 Key Commands Reference

```sh
# Check project health
npx expo-doctor@latest

# Upgrade to next SDK (when ready)
npx expo install expo@next --fix

# Verify current installed versions
npm ls --depth=0

# Start dev server (clean cache)
npx expo start --clear
```
