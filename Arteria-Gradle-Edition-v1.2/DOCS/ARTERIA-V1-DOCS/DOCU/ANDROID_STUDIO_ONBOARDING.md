# Android Studio — New clone checklist

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

This doc is for anyone who clones the repo and opens **Android Studio** expecting a ready-made Gradle project. If you skip the steps below, Studio often shows **no run configuration**, an empty tree, or only `.gradle` / `build` / `.cxx` — that is expected until native files are generated.

---

## Why this happens

1. **Continuous Native Generation (CNG)** — The real Android app is an **Expo** project under `apps/mobile`. The `android/` folder there is **generated**, not stored in Git. See **[EXPO_GUIDE.md](EXPO_GUIDE.md)** §1 (CNG).

2. **`apps/mobile/.gitignore`** ignores `/android` and `/ios`, so after `git clone` those folders are **missing** until you run prebuild.

3. **Wrong folder in Studio** — Opening `android/app` (module only) or an **empty** `Arteria/android` at the repo root gives no `settings.gradle` at the project root, so Gradle never configures an **app** run configuration.

4. **Optional root `android/`** — The monorepo root may contain an `android/` directory from old workflows or local experiments. It may be **empty or incomplete**. The supported native project for this repo is **`apps/mobile/android`** after prebuild.

---

## Fix (do this after clone)

### 1. Install dependencies (from repo root)

```bat
cd C:\path\to\Arteria
npm install
```

### 2. Generate the native Android project

From **`apps/mobile`**:

```bat
cd apps\mobile
npx expo prebuild --platform android
```

Or use the existing automation (also sets dev/prod native identity as documented in the batch headers):

- **`1_Run_Local_Android_Build.bat`** — dev client (`Arteria-dev`), runs prebuild when needed.
- **`2_Build_APK_Local.bat`** — release APK path; runs prebuild when switching prod mode.

After this, you should have files such as:

- `apps/mobile/android/settings.gradle` (or `.kts`)
- `apps/mobile/android/build.gradle` (or `.kts`)
- `apps/mobile/android/gradlew.bat`
- `apps/mobile/android/app/` (module)

### 3. Open the correct directory in Android Studio

**File → Open** and select:

```text
<repo>\apps\mobile\android
```

Not:

- `<repo>\android` (may be empty or not the Expo output)
- `<repo>\apps\mobile\android\app` (module only; no root Gradle project)

### 4. Wait for Gradle sync

When sync finishes, the run configuration dropdown should show **app** (or similar). If sync fails, check `local.properties` / SDK path — **`Ensure_Android_LocalProps.bat`** at repo root and **EXPO_GUIDE** §4b describe `sdk.dir` on Windows.

---

## Quick reference

| Symptom | Likely cause |
|--------|----------------|
| **Add Configuration** only; no **app** | Opened wrong folder, or `android/` never prebuilt |
| Project tree has no `settings.gradle` | Same — not the `apps/mobile/android` root |
| Only `.cxx`, `build`, `.idea` under `app` | Opened `app` subfolder instead of parent `android` |

**Related docs:** [EXPO_GUIDE.md](EXPO_GUIDE.md) (CNG, builds), [SUMMARY.md](SUMMARY.md) (doc index).
