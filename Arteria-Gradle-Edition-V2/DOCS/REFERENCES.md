<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial REFERENCES.md (expanded from `gradle_website_links.md`). |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Gradle Build Daemon / JVM criteria link. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Cinzel font upstream + Expo parity (`theme.ts`). |
| 2026-03-30 | Cursor Agent | Composer | Title V2; wrapper path note → `Arteria-Gradle-Edition-V2/gradle/wrapper/`. |

*Future contributors: append a row when you materially change this doc.*

---

# References — Arteria Gradle Edition V2

Curated links for **Gradle 9.6 nightly**, Android native UI, GameActivity, and migration work. Prefer official sources over third-party tutorials.

---

## Gradle

- **Nightly distributions:** [https://gradle.org/nightly/](https://gradle.org/nightly/) — lists current nightlies; this project pins an exact snapshot URL in `Arteria-Gradle-Edition-V2/gradle/wrapper/gradle-wrapper.properties`.
- **Gradle releases / compatibility:** [https://docs.gradle.org/current/userguide/compatibility.html](https://docs.gradle.org/current/userguide/compatibility.html)
- **Wrapper:** [https://docs.gradle.org/current/userguide/gradle_wrapper.html](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- **Build Daemon (JVM the daemon uses; criteria / toolchain):** [https://docs.gradle.org/current/userguide/build_daemon.html](https://docs.gradle.org/current/userguide/build_daemon.html) — matches Android Studio *Migrate to Gradle Daemon toolchain* and `gradle/gradle-daemon-jvm.properties`.

---

## Android Gradle Plugin (AGP)

- **AGP release notes + Gradle version table:** [https://developer.android.com/build/releases/gradle-plugin](https://developer.android.com/build/releases/gradle-plugin) — verify AGP 9.x vs Gradle 9.x before upgrading either.

---

## Jetpack Compose

- **Compose setup (Kotlin):** [https://developer.android.com/jetpack/compose/setup](https://developer.android.com/jetpack/compose/setup)
- **Navigation Compose:** [https://developer.android.com/jetpack/compose/navigation](https://developer.android.com/jetpack/compose/navigation)
- **State and ViewModel:** [https://developer.android.com/topic/libraries/architecture/viewmodel](https://developer.android.com/topic/libraries/architecture/viewmodel)

---

## Typography / brand parity (Expo → native)

- **Cinzel (Google Fonts, OFL):** [https://fonts.google.com/specimen/Cinzel](https://fonts.google.com/specimen/Cinzel) — v1.2 bundles variable `cinzel.ttf` from [google/fonts `ofl/cinzel`](https://github.com/google/fonts/tree/main/ofl/cinzel) to match `Cinzel_400Regular` / `Cinzel_700Bold` usage in `apps/mobile/app/_layout.tsx` and `constants/theme.ts` (`FontCinzel`, `FontCinzelBold`).
- **Arteria dark palette reference:** `apps/mobile/constants/theme.ts` (`DARK_PALETTE`, `THEMES`) — Compose colors in `ui/theme/ArteriaTheme.kt` + Docking Station screens.

---

## Kotlin coroutines

- **Coroutines guide:** [https://kotlinlang.org/docs/coroutines-guide.html](https://kotlinlang.org/docs/coroutines-guide.html)
- **StateFlow / SharedFlow:** [https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/)

---

## GameActivity and native C++

- **Add native code (CMake):** [https://developer.android.com/studio/projects/add-native-code](https://developer.android.com/studio/projects/add-native-code)
- **Games libraries (GameActivity):** [https://developer.android.com/games/agdk/libraries](https://developer.android.com/games/agdk/libraries)
- **Prefab / game-activity package:** Delivered via `androidx.games:games-activity` (see `SBOM.md`).

---

## Android 16 / API 36

- **Behavior changes:** Check [https://developer.android.com/about/versions/16](https://developer.android.com/about/versions/16) (update URL if the platform doc slug changes in future releases).
- **compileSdk / targetSdk:** Follow AGP and Studio release notes when bumping minor API levels.

---

## Persistence (when added)

- **DataStore:** [https://developer.android.com/topic/libraries/architecture/datastore](https://developer.android.com/topic/libraries/architecture/datastore)
- **Room:** [https://developer.android.com/training/data-storage/room](https://developer.android.com/training/data-storage/room)
- **MMKV (Tencent):** [https://github.com/Tencent/MMKV](https://github.com/Tencent/MMKV) — if used, add version rows to `SBOM.md` and note NDK/ABI implications.

---

## Legacy note

[AMENDED 2026-03-22]: The file `gradle_website_links.md` in this folder was a single-line stub. Use **this document** as the canonical link list. Do not delete `gradle_website_links.md`; it may receive pointer-only updates per preservation rules.
