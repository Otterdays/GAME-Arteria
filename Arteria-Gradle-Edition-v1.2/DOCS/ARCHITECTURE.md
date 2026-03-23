<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Grok | xAI | Original whitepaper (`whitepaper.md`); direction evolved to native Kotlin + C++. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | `ARCHITECTURE.md`, `SBOM.md`, RN vs Gradle 9.x analysis, supersession notices, doc suite (SCRATCHPAD, ROADMAP, MIGRATION_SPEC, REFERENCES). |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | §7a directory tree: added `Gradle_Tool_Chain_Migration.md`. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | §2 identity table amended (package, minSdk, engine/graphics status); §3/§4 amended (Compose shell reality); §5 Gradle files table amended; §7b source layout amended; §7c package note amended. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | §4 module inventory: Compose UI + theme/Cinzel row; MainActivity row amended (`ArteriaTheme`). |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | §4 Compose UI row amended: animated `DockingBackground` note. |

*Future contributors: append a row here when you materially change this doc.*

---

# Arteria v1.2 — Gradle Edition: Architecture

> **Status:** Scaffold — native Kotlin + C++/OpenGL ES 3 on bleeding-edge Android tooling
> **Last updated:** 2026-03-22
> **Direction:** This is the future for Arteria. Pure native. No React Native.

---

## 1. Why Native-Only (No React Native)

React Native's Gradle plugin (`@react-native/gradle-plugin`) uses internal Gradle APIs (`JavaVendorSpec.JVM_EXTERN` and others) that were **removed in Gradle 9.0**. The RN team targets Gradle 8.x; there is no announced timeline for Gradle 9 support. This was confirmed firsthand when the main Arteria RN app had to downgrade from Gradle 9.0 to 8.13 to build at all.

Artera-Gradle-Edition targets **Gradle 9.6 nightly** and **AGP 9.1.0** — two major versions ahead of what RN supports. Combining them is not possible without gutting the toolchain advantage.

**Decision:** Arteria v1.2 is a native-first Android project. UI via **Kotlin + Jetpack Compose** (when added). Rendering via **C++/OpenGL ES 3** through `GameActivity`. No JS bridge, no Metro, no Hermes, no Expo.

---

## 2. Project Identity

| Field | Value |
|-------|-------|
| **Name** | Arteria V1.2 — Gradle Edition |
| **Package** | `com.example.arteriav15_gradleedition` |
| **Build system** | Gradle 9.6.0-nightly (snapshot `20260322000231+0000`) |
| **AGP** | 9.1.0 |
| **Min SDK** | 36 (Android 16) |
| **Target / Compile SDK** | 36 (minor API level 1) |
| **Language — App** | Kotlin (GameActivity subclass) |
| **Language — Engine** | C++17 via CMake 3.22.1 + NDK |
| **Graphics API** | OpenGL ES 3.0 (EGL surface, GLES3 context) |
| **JDK** | 21 (foojay toolchain auto-provisioning) |
| **React Native** | **Not used. Incompatible with Gradle 9.x.** |

`[AMENDED 2026-03-22]:` Current state of **`Arteria-Gradle-Edition-v1.2/`** (the live project):

| Field | Current value |
|-------|--------------|
| **Package / applicationId** | `com.arteria.game` (renamed from `com.example.arteriav15_gradleedition`) |
| **Min SDK** | **26** (Android 8.0 — broadened from 36 for real-world reach) |
| **Target SDK** | 36 (`targetSdk { version = release(36) }`) |
| **Compile SDK** | 36.1 (`release(36) { minorApiLevel = 1 }`) |
| **Language — App** | Kotlin — `ComponentActivity` + Jetpack Compose (Phase 1 shell running) |
| **Language — Engine** | C++17 / CMake / NDK — **planned** (Phase 5+); not wired in current `:app` or `:core` |
| **Graphics API** | OpenGL ES 3.0 — **planned** (GPU island, Phase 5+); not active in current build |
| **JDK (daemon + bytecode)** | 21 (foojay; `gradle-daemon-jvm.properties` + `compileOptions VERSION_21`) |
| **Confirmed running** | "Welcome to Arteria Gradle Edition" on API 36.1 AVD [2026-03-22] |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Android OS (API 36)                 │
├─────────────────────────────────────────────────────┤
│  MainActivity.kt  (GameActivity subclass)           │
│    └── System.loadLibrary("arteriav15_gradleedition")│
├─────────────────────────────────────────────────────┤
│  Native Layer (C++ shared library .so)              │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  main.cpp  │→│ Renderer │→│ Shader / Model /  │ │
│  │ android_   │  │ (EGL +   │  │ TextureAsset /   │ │
│  │ main()     │  │ GLES 3)  │  │ Utility          │ │
│  └───────────┘  └──────────┘  └──────────────────┘ │
│        ↕ input events (GameActivity native glue)    │
├─────────────────────────────────────────────────────┤
│  Assets: android_robot.png (demo texture)           │
└─────────────────────────────────────────────────────┘
```

`[AMENDED 2026-03-22]:` The diagram above describes the **intended future** architecture (C++/OpenGL GPU island). The **current running app** (`Arteria-Gradle-Edition-v1.2/`) is a **Jetpack Compose shell** — no native `.so`, no EGL, no CMake wired yet:

```
┌─────────────────────────────────────────────────────┐
│                  Android OS (API 36.1)               │
├─────────────────────────────────────────────────────┤
│  MainActivity.kt  (ComponentActivity)               │
│    └── setContent { MaterialTheme { Surface { … } } }│
├─────────────────────────────────────────────────────┤
│  Compose UI layer                                    │
│    Greeting("Arteria") → "Welcome to Arteria         │
│                            Gradle Edition!"          │
├─────────────────────────────────────────────────────┤
│  :core module (empty Kotlin library — Phase 2+)     │
└─────────────────────────────────────────────────────┘
```

### Render Pipeline

1. `android_main` registers `handle_cmd` and a motion-event filter.
2. On `APP_CMD_INIT_WINDOW`, a `Renderer` is created — initialises EGL display/surface/context (GLES 3, 8-bit RGBA, 24-bit depth).
3. `Renderer::createModels()` loads a textured quad via `TextureAsset` + `AImageDecoder`.
4. Each frame: poll events → `handleInput()` → `render()` (orthographic projection, alpha blending, `eglSwapBuffers`).
5. On `APP_CMD_TERM_WINDOW`, the renderer is deleted and EGL resources are torn down.

`[AMENDED 2026-03-22]:` Render pipeline above is **planned** (Phase 5+). Current app uses the Compose rendering path only.

### Input Pipeline

- Motion events (pointer + joystick) filtered by `motion_event_filter_func`.
- Key events use the default `default_key_filter` from `android_native_app_glue`.
- `Renderer::handleInput()` drains both queues per frame.

`[AMENDED 2026-03-22]:` Input pipeline above is **planned** (Phase 5+). Current app uses standard Compose/Android input.

---

## 4. Module Inventory

| Module | Files | Responsibility |
|--------|-------|----------------|
| **Entry** | `main.cpp` | `android_main` game loop, command handler, event filter |
| **Renderer** | `Renderer.h/cpp` | EGL lifecycle, GL state, frame render, input drain |
| **Shader** | `Shader.h/cpp` | GLSL compile/link, draw calls, projection uniform |
| **Model** | `Model.h` | Vertex/Index data, texture reference (header-only) |
| **TextureAsset** | `TextureAsset.h/cpp` | PNG decode via `AImageDecoder`, GL texture upload |
| **Utility** | `Utility.h/cpp` | Orthographic matrix builder, GL error check |
| **AndroidOut** | `AndroidOut.h/cpp` | `aout` — `std::ostream` wrapper around `__android_log_write` |
| **MainActivity** | `MainActivity.kt` | `GameActivity` subclass, immersive system UI flags |

`[AMENDED 2026-03-22]:` The C++ modules above describe the **planned** GPU island (Phase 5+). **Current live modules** in `Arteria-Gradle-Edition-v1.2/`:

| Module | File | Status |
|--------|------|--------|
| **MainActivity** | `app/src/main/java/com/arteria/game/MainActivity.kt` | Live — `ComponentActivity` + Compose shell (`ArteriaTheme`, `enableEdgeToEdge`) |
| **Compose UI** | `app/.../ui/**` (`ArteriaApp`, `account/*`, `components/*`) | Live — Docking Station–style account flow; NavHost; **`DockingBackground`** animated Canvas (stars + nebula + gradient, `InfiniteTransition`) |
| **Theme / typography** | `ui/theme/ArteriaTheme.kt`, `res/font/cinzel.ttf` | Live — palette aligned with `apps/mobile/constants/theme.ts`; **Cinzel** titles (OFL, see `SBOM.md` **Bundled font assets**) |
| **:core** | `core/build.gradle.kts` | Live — empty Kotlin library module, no sources yet |

---

## 5. Build Toolchain

```
Gradle 9.6.0-nightly ──► AGP 9.1.0 ──► CMake 3.22.1 ──► NDK (clang)
       │                      │
       │                      └── Kotlin compilation (app module)
       └── JDK 21 (foojay auto-provision via gradle-daemon-jvm.properties)
```

### Key Gradle Files

| File | Purpose |
|------|---------|
| `settings.gradle.kts` | Plugin management, dependency resolution, foojay toolchain resolver |
| `build.gradle.kts` (root) | AGP plugin declaration (`apply false`) |
| `app/build.gradle.kts` | App module — SDK versions, CMake path, prefab, dependencies |
| `gradle/libs.versions.toml` | Version catalog (AGP 9.1.0, AndroidX, Material, Games Activity) |
| `gradle.properties` | JVM args (`-Xmx2048m`), Kotlin code style |
| `gradle/wrapper/gradle-wrapper.properties` | Gradle 9.6.0 nightly snapshot URL |
| `gradle/gradle-daemon-jvm.properties` | JDK 21 toolchain URLs (foojay, all platforms) |

`[AMENDED 2026-03-22]:` Actual files in `Arteria-Gradle-Edition-v1.2/` (no version catalog; no CMake/prefab in `:app` yet):

| File | Purpose |
|------|---------|
| `settings.gradle.kts` | Plugin management (foojay resolver), module includes (`:app`, `:core`) |
| `build.gradle.kts` (root) | AGP 9.1.0 + `org.jetbrains.kotlin.plugin.compose` 2.0.0 (`apply false`) |
| `app/build.gradle.kts` | compileSdk 36.1, minSdk 26, targetSdk 36, Compose BOM, AndroidX deps |
| `core/build.gradle.kts` | `com.android.library`, compileSdk 36.1, empty Kotlin module |
| `gradle.properties` | `-Xmx2048m`, `android.useAndroidX=true`, `kotlin.code.style=official` |
| `gradle/wrapper/gradle-wrapper.properties` | Gradle 9.6.0 nightly snapshot URL |
| `gradle/gradle-daemon-jvm.properties` | JDK 21 / Adoptium toolchain URLs (foojay, all platforms) |
| `build-apk-for-transfer.ps1` / `.bat` | Local build + copy APK to `dist/` for sideload/Drive transfer |

### Gradle 9.6 Nightly Considerations

- Snapshot URL is pinned to `gradle-9.6.0-20260322000231+0000-bin.zip` for reproducibility.
- Nightly builds may contain breaking API changes between snapshots.
- AGP 9.1.0 is compatible with Gradle 9.x. Always verify against the [AGP/Gradle compatibility matrix](https://developer.android.com/build/releases/gradle-plugin#updating-gradle).
- **React Native is incompatible** — `@react-native/gradle-plugin` requires Gradle 8.x APIs.

---

## 6. Relationship to Main Arteria Project

The main Arteria app (`apps/mobile/`) is a React Native / Expo SDK 55 idle RPG (v0.7.0) locked to Gradle 8.13. This Gradle Edition is a **separate, standalone native Android project** that:

- Lives at `Arteria/Arteria-Gradle-Edition-v1.2/` (docs) and `Arteria/Artera-Gradle-Edition/` (source scaffold) — shares **zero code** with the RN app.
- Targets bleeding-edge tooling (API 36, Gradle 9.6 nightly, AGP 9.1.0).
- Runs a native C++/OpenGL ES 3 render loop via `GameActivity`.
- Represents the **future direction** for Arteria — native Kotlin + C++ engine, no JS layer.

### Migration Path (RN → Native)

The existing RN game logic (Redux state, tick engine, skill system) will eventually need to be ported to native Kotlin. The approach:

1. **Game engine** — rewrite `packages/engine/` in Kotlin (data classes, sealed classes for state, coroutines for tick loop).
2. **UI** — Jetpack Compose replaces React Native screens.
3. **Persistence** — DataStore or direct MMKV NDK calls replace Redux-persist.
4. **Rendering** — C++/OpenGL layer handles any GPU-accelerated visuals the Compose layer can't.

This is a long-term migration, not an immediate task.

---

## 7. Directory Layout

### 7a. Documentation hub (`Arteria-Gradle-Edition-v1.2/`)

Agent continuity and planning (no Gradle project here):

```
Arteria-Gradle-Edition-v1.2/
└── DOCS/
    ├── ARCHITECTURE.md      # Stack, constraints, conventions (this file)
    ├── SBOM.md              # Versions and dependency inventory
    ├── ROADMAP.md           # Phases 0–6 — what to build next
    ├── MIGRATION_SPEC.md    # TS / Redux → Kotlin / Flow mapping + file index
    ├── REFERENCES.md        # Official external links (Gradle, AGP, Compose, GameActivity)
    ├── SCRATCHPAD.md        # Live status, blockers, last actions
    ├── Gradle_Tool_Chain_Migration.md  # Daemon JVM toolchain (Studio Migrate) + repo state
    ├── whitepaper.md        # Vision doc — not a pinned runbook for versions
    └── gradle_website_links.md  # Legacy stub; see REFERENCES.md
```

### 7b. Source scaffold today (`Artera-Gradle-Edition/`)

Current Android Studio project (GameActivity + C++/OpenGL demo). Matches on-disk layout **before** Phase 1 module split.

```
Artera-Gradle-Edition/
├── app/
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── assets/
│       ├── cpp/                 # Native engine / renderer (CMake)
│       ├── java/.../MainActivity.kt
│       └── res/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradle/
│   ├── libs.versions.toml
│   ├── wrapper/
│   └── gradle-daemon-jvm.properties
├── gradlew
├── gradlew.bat
└── local.properties             # gitignored
```

`[AMENDED 2026-03-22]:` The **live** Android Studio project is `Arteria-Gradle-Edition-v1.2/` (this repo folder), not `Artera-Gradle-Edition/`. Current on-disk layout:

```
Arteria-Gradle-Edition-v1.2/
├── app/
│   ├── build.gradle.kts         # compileSdk 36.1, minSdk 26, Compose BOM
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml  # package com.arteria.game, targetApi 36
│       ├── java/com/arteria/game/
│       │   └── MainActivity.kt  # ComponentActivity + Compose shell
│       └── res/
│           ├── drawable/ic_launcher.xml
│           └── values/          # strings, themes
├── core/
│   └── build.gradle.kts         # com.android.library, compileSdk 36.1 (no sources yet)
├── build.gradle.kts             # root — AGP 9.1.0 + Kotlin Compose plugin
├── settings.gradle.kts          # foojay resolver, :app + :core
├── gradle.properties
├── gradle/
│   ├── wrapper/gradle-wrapper.properties  # Gradle 9.6.0 nightly
│   └── gradle-daemon-jvm.properties       # JDK 21 / Adoptium (Foojay URLs)
├── gradlew / gradlew.bat
├── build-apk-for-transfer.ps1   # local APK → dist/ helper
├── build-apk-for-transfer.bat
├── DOCS/                        # this docs hub
└── local.properties             # gitignored
```

### 7c. Target application layout (after ROADMAP Phase 1+)

Place new Kotlin code under the app module (or a future `:core` module) using packages like:

```
app/src/main/java/com/arteria/game/
├── MainActivity.kt              # GameActivity or single-activity Compose host
├── core/                        # Pure Kotlin — no android.* imports (or :core module)
│   ├── engine/                  # Tick, XP, rules ported from packages/engine
│   ├── model/                   # data classes, sealed types
│   └── util/
├── ui/                          # Compose screens, theme, navigation
│   ├── navigation/
│   ├── skills/
│   ├── bank/
│   └── theme/
└── data/                        # Repositories, persistence, DTO mappers
    ├── persistence/
    └── repository/
```

**NOTE:** Package name `com.arteria.game` is illustrative — finalize with product owner before mass rename (CMake `loadLibrary`, namespace, applicationId must stay in sync).

`[AMENDED 2026-03-22]:` Package `com.arteria.game` is **finalized and active** — `applicationId`, `namespace`, and Kotlin source path all use it. When C++ is added, `System.loadLibrary` name must be coordinated with CMake target name.

---

## 8. Conventions

- **C++:** `PascalCase` classes, `camelCase` methods/locals, `kCamelCase` constants.
- **Kotlin:** Official style (`kotlin.code.style=official`). `PascalCase` classes, `camelCase` functions/properties.
- **Line limits:** 100 chars/line, 50 lines/function, 400 lines/file.
- **Comments:** WHY only, never WHAT. Prefixes: `TODO:`, `FIXME:`, `NOTE:`.
- **Secrets:** `local.properties` is gitignored. Never commit `sdk.dir` or API keys.
- **Git:** Conventional Commits — `feat(renderer): add sprite batching`.

---

## 9. Superseded Documents

| Document | Status | Reason |
|----------|--------|--------|
| `DOCS/whitepaper.md` | **Superseded** | Describes bare React Native CLI migration (Expo → RN 0.83, Hermes, Skia, Zustand). RN's Gradle plugin is incompatible with Gradle 9.x — APIs removed in 9.0. Retained for historical reference only. |

[AMENDED 2026-03-22]: Arteria v1.2 is native Kotlin + C++/OpenGL. No JS layer. The whitepaper's RN approach does not apply to this project.

[AMENDED 2026-03-22]: `whitepaper.md` may describe native Kotlin at a high level. **Authoritative** pinned versions remain in `SBOM.md` and `gradle/wrapper/gradle-wrapper.properties` in the source scaffold; **execution order** is `ROADMAP.md` + `MIGRATION_SPEC.md`, not the whitepaper prose.
