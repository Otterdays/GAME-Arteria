<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial SBOM tables, toolchain inventory, whitepaper supersession notice. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Android SDK targets amendment: API 36.1 compile via `CompileSdkSpec`, links to AGP 9.1 + Android 16 migration. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Build Toolchain row: Gradle Daemon JVM 21 / ADOPTIUM + `gradle-daemon-jvm.properties`. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | SBOM audit: canonical dependency tables (declared vs latest-known columns); deprecated stale runtime/test/native rows annotated. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | SBOM cleanup: removed deprecated/stale tables; single source of truth for new agents. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Title corrected to **Software** Bill of Materials (industry-standard SBOM expansion). |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | **Bundled fonts** section: Cinzel variable TTF in `res/font/`; SBOM + license pointer. |

*Future contributors: append a row here when you materially change this doc.*

---

# SBOM (Software Bill of Materials) — Arteria v1.2 Gradle Edition

> **Last updated:** 2026-03-22
> **Status:** Single source of truth for toolchain, SDK targets, and all declared dependencies.

---

## Build Toolchain

| Component | Version | Source / Notes |
|-----------|---------|----------------|
| Gradle | 9.6.0-nightly (`20260322000231+0000`) | Pinned snapshot — [distributions-snapshots](https://services.gradle.org/distributions-snapshots/) |
| Android Gradle Plugin | 9.1.0 | Root `build.gradle.kts` `plugins { }` |
| JDK (daemon + bytecode) | **21** / vendor **ADOPTIUM** | `gradle/gradle-daemon-jvm.properties` (Foojay auto-provision); `compileOptions` `JavaVersion.VERSION_21` in `:app` and `:core` |
| Kotlin | (AGP-bundled) | Kotlin compiler version managed by AGP 9.1.0 built-in Kotlin |
| CMake / NDK | **Not active** | No `externalNativeBuild` in current `:app` / `:core`. Will be added when C++/OpenGL GPU island lands (see `ARCHITECTURE.md` Phase 5+). |

---

## Android SDK Targets

| Property | Value | Notes |
|----------|-------|-------|
| compileSdk | **36.1** | `compileSdk { version = release(36) { minorApiLevel = 1 } }` — Android 16 / Baklava |
| targetSdk | **36** | `targetSdk { version = release(36) }` — opts into [Android 16 behaviors](https://developer.android.com/about/versions/16/migration) |
| minSdk | **26** | Android 8.0 — broadened for real-world reach |
| SDK Build Tools | 36.0.0 | Required by [AGP 9.1](https://developer.android.com/build/releases/agp-9-1-0-release-notes); max supported API is **36.1** |

---

## Bundled font assets (not on Maven)

Shipped as **`app/src/main/res/font/`** resources (no Gradle coordinate). Update this table when adding or replacing font files.

| Asset | File | License | Upstream / notes |
|-------|------|---------|------------------|
| Cinzel (variable, wght axis) | `cinzel.ttf` | **SIL Open Font License 1.1** | [google/fonts `ofl/cinzel`](https://github.com/google/fonts/tree/main/ofl/cinzel) — same family as Expo `@expo-google-fonts/cinzel` / `FontCinzel` in `apps/mobile/constants/theme.ts`. Full license text: [`OFL.txt` in that folder](https://github.com/google/fonts/blob/main/ofl/cinzel/OFL.txt). |

**Compose usage:** `FontFamily(Font(R.font.cinzel, …))` in `ui/theme/ArteriaTheme.kt` for display titles, app bar titles, and gold pretag (`labelSmall`). Body copy uses `FontFamily.SansSerif`.

---

## Dependency Inventory

**Gradle files audited:** `app/build.gradle.kts`, `core/build.gradle.kts`, root `build.gradle.kts`, `settings.gradle.kts`.

**How to use this section**

| Column | Meaning |
|--------|---------|
| **Module** | `:app`, `:core`, or `(root)` for plugins |
| **Scope** | Gradle configuration (`implementation`, `testImplementation`, etc.) |
| **Coordinates** | `group:artifact` |
| **Declared** | Version in Gradle, or `(via BOM)` for Compose BOM-managed libs |
| **Latest known (stable)** | Newer release identified for planning — **confirm on [Google Maven](https://maven.google.com/web/index.html) or [Maven Central](https://search.maven.org/) before bumping** |
| **Checked** | Date the "Latest known" value was researched |
| **Notes** | Role / upgrade cautions |

**Maintainers:** On each dependency pass, refresh **Latest known** + **Checked**, run `./gradlew :app:assembleDebug`, and run your test task. For Compose, bump **`compose-bom`** first, then sync other AndroidX versions to [BOM mapping](https://developer.android.com/develop/ui/compose/bom/bom-mapping).

### `:app` — `implementation`

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:app` | `implementation` | `androidx.core:core-ktx` | 1.13.1 | 1.18.0 | 2026-03-22 | Core Kotlin extensions |
| `:app` | `implementation` | `androidx.lifecycle:lifecycle-runtime-ktx` | 2.8.4 | 2.10.0 | 2026-03-22 | Lifecycle coroutines |
| `:app` | `implementation` | `androidx.activity:activity-compose` | 1.9.1 | 1.13.0 | 2026-03-22 | Compose entry Activity |
| `:app` | `implementation` | `androidx.compose:compose-bom` | `platform` 2024.06.00 | `platform` 2026.03.00 | 2026-03-22 | BOM pins Compose library versions |
| `:app` | `implementation` | `androidx.compose.ui:ui` | (via BOM) | (via newer BOM) | — | UI core |
| `:app` | `implementation` | `androidx.compose.ui:ui-graphics` | (via BOM) | (via newer BOM) | — | Graphics primitives |
| `:app` | `implementation` | `androidx.compose.ui:ui-tooling-preview` | (via BOM) | (via newer BOM) | — | `@Preview` |
| `:app` | `implementation` | `androidx.compose.material3:material3` | (via BOM) | (via newer BOM) | — | Material 3 |
| `:app` | `implementation` | `androidx.navigation:navigation-compose` | 2.8.0 | 2.9.7 | 2026-03-22 | Compose navigation |

### `:app` — `debugImplementation`

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:app` | `debugImplementation` | `androidx.compose.ui:ui-tooling` | (via BOM) | (via newer BOM) | — | Studio layout inspector |
| `:app` | `debugImplementation` | `androidx.compose.ui:ui-test-manifest` | (via BOM) | (via newer BOM) | — | Test manifest |

### `:app` — `androidTestImplementation`

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:app` | `androidTestImplementation` | `androidx.compose:compose-bom` | `platform` 2024.06.00 | `platform` 2026.03.00 | 2026-03-22 | Keep in sync with `implementation` BOM |
| `:app` | `androidTestImplementation` | `androidx.compose.ui:ui-test-junit4` | (via BOM) | (via newer BOM) | — | Compose UI tests |
| `:app` | `androidTestImplementation` | `androidx.test.ext:junit` | 1.2.1 | 1.3.0 | 2026-03-22 | AndroidX JUnit extensions |
| `:app` | `androidTestImplementation` | `androidx.test.espresso:espresso-core` | 3.6.1 | 3.7.0 | 2026-03-22 | UI test harness |

### `:app` — `testImplementation`

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:app` | `testImplementation` | `junit:junit` | 4.13.2 | 4.13.2 | 2026-03-22 | JVM unit tests (current for JUnit 4 line) |

### `:core`

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:core` | `implementation` | `androidx.core:core-ktx` | 1.13.1 | 1.18.0 | 2026-03-22 | Keep aligned with `:app` |
| `:core` | `testImplementation` | `junit:junit` | 4.13.2 | 4.13.2 | 2026-03-22 | JVM unit tests |

### Gradle Plugins

| Source | Plugin ID | Declared | Latest known | Checked | Notes |
|--------|-----------|----------|--------------|---------|-------|
| root `build.gradle.kts` | `com.android.application` | 9.1.0 | — | — | Match [AGP / Gradle matrix](https://developer.android.com/build/releases/gradle-plugin#updating-gradle) |
| root `build.gradle.kts` | `com.android.library` | 9.1.0 | — | — | Same as AGP |
| root `build.gradle.kts` | `org.jetbrains.kotlin.plugin.compose` | 2.0.0 | — | — | **Must stay compatible with Kotlin version shipped with AGP** ([Compose compiler setup](https://developer.android.com/develop/ui/compose/compiler)) |
| `settings.gradle.kts` | `org.gradle.toolchains.foojay-resolver-convention` | 1.0.0 | — | — | JDK toolchain discovery |

### Template — add new dependencies here

| Module | Scope | Coordinates | Declared | Latest known | Checked | Notes |
|--------|-------|-------------|----------|--------------|---------|-------|
| `:app` / `:core` | `implementation` / … | `group:artifact` | | | | |

---

## What Is NOT Here

| Technology | Why |
|------------|-----|
| React Native | `@react-native/gradle-plugin` requires Gradle 8.x APIs removed in Gradle 9.0. Incompatible. |
| Hermes / JSC | No JS engine — native-only project. |
| Expo | Depends on React Native. Not applicable. |
| Metro bundler | No JS bundling needed. |
| Node.js / npm | No JS dependencies. Build is Gradle-only. |
| Native C++ / OpenGL | **Planned** (Phase 5+). Not wired in current `:app` / `:core`. When added, create rows in Dependency Inventory and a new Native Libraries section. |

---

## Vulnerability Status

| Date | Tool | Result |
|------|------|--------|
| 2026-03-22 | Manual review | 0 known vulnerabilities. All deps are first-party Google/AndroidX. Re-check after any version bump. |

---

## Update Policy

- **Gradle nightly:** Pin exact snapshot URL. Only update intentionally — nightlies can break between days.
- **AGP:** Track stable releases. 9.1.0 is current.
- **AndroidX / Compose:** Bump **`compose-bom`** first; refresh Dependency Inventory columns after verifying on Google Maven. Optional: [Gradle Versions Plugin](https://github.com/ben-manes/gradle-versions-plugin) for `dependencyUpdates`.
- **NDK / CMake:** When native code is added, pin versions per AGP release notes and add rows to Dependency Inventory.

---

## Whitepaper Supersession Notice

The `whitepaper.md` in this DOCS folder describes a React Native CLI migration (Expo to RN 0.83, Hermes, Skia, Zustand). That approach is **superseded** — RN's Gradle plugin is incompatible with Gradle 9.x. Arteria v1.2 is native Kotlin + Compose. The whitepaper is retained for historical reference only; do not execute its instructions.
