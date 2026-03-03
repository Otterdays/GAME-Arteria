# Thoughts on EAS Build Times & User Confusion

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
The user is experiencing the slow turnaround time of Cloud Builds (Free Tier EAS queues can take a few minutes). They are concerned that they have to wait 5-10 minutes every time they want to test a change or push an update.

I need to explain the "Aha!" moment of Expo: Fast Refresh and OTA Updates.
1. **Testing is instant**: Once the Custom Dev Client is installed on their phone, they never have to build to test. They just run `npx expo start`, hit save in VSCode, and the app updates instantly over Wi-Fi (Fast Refresh).
2. **Updates are fast (OTA)**: Pushing simple logic/UI updates doesn't require a build. Run `Update_2_EAS_OTA_Update.bat` or `npx eas-cli update` — no global EAS install needed.
3. **Why build?**: They only wait in this EAS queue when they change something *native* (like adding a new C++ module) or when they want to put a final `.aab` on the Google Play Store. And if they really hated the wait for native builds, they *could* build locally using standard Gradle (`npx expo run:android`), but sticking to EAS is safer for maintaining an ephemeral `android` folder.
4. **Local Builds (Run Android)**: I've successfully transitioned to local builds via `1_Run_Local_Android_Build.bat`. This is much faster for dev iteration.

# The Immersion Pivot (v0.2.1)
The jump from "basic AFK loop" to "Immersive RPG" happened here.
- **Icon Senses**: Swapping generic Material icons for `MaterialCommunityIcons` changed the vibe instantly. `pickaxe` and `sword-cross` are much more thematic.
- **The "Ticker" Pulse (Relocated v0.2.1)**: Initially at the top, the ticker felt like a jarring overlay. I've relocated it to a **Bottom Dock** (above the Tab Bar). This merges it with the navigation UI, keeping headers clean while maintaining task visibility.
- **Android "Native" Feel**: Edge-to-edge layout with translucent bars removes the "web-wrapper" feel.
- **Universal Heartbeat (v0.2.1)**: Moving the ticker to the root `_layout.tsx` was critical. RPG players hate losing feedback when they "dive" into a skill screen. Now, the ticker intelligently ducks behind the tab bar or hugs the bottom bezel depending on where the user is.
- **Dual-Layer Progression**: The header now handles the "Long Grind" (XP Bar), while the Ticker handles the "Instant Pulse" (Tick bar). This dual-feedback loop is what makes "number go up" feel satisfying.

# The Dialogue System & Story Engine (v1.2.0+)
- **Global Modals vs Screens**: Decided to build dialogues as an overlay rather than a dedicated route. This keeps the player "grounded" in the game world. When an NPC speaks, it should feel like an interruption, not a completely different app section.
- **Redux Integration**: By storing `activeDialogueId` in Redux, we ensure dialogues can be triggered from ANY screen - a random event while skilling, checking an item in the bank, or explicitly going to a location.
- **Tree-based Logic**: The engine is purely functional, storing arrays/objects of `DialogueTree`. The UI is just a dumb renderer, keeping our codebase clean and MVC-aligned.

# Android Build Failure: JRE vs JDK (2026-03-03)
- **Symptom**: Build fails because the toolchain found in `C:\Program Files\Eclipse Adoptium\jre-21.0.10.7-hotspot` lacks `[JAVA_COMPILER]`.
- **Root Cause**: Gradle is auto-detecting a JRE instead of a JDK. Modern Expo/Gradle builds require a full JDK to compile the Expo Gradle plugin and other native components.
- **Fix**: Force Gradle to use the JDK located at `C:\Program Files\Java\jdk-21.0.10` by setting `org.gradle.java.home` in the local `gradle.properties` or ensuring the environment variable `JAVA_HOME` is correctly set to a JDK path, not a JRE path.

# Android Bundling Failure: Path Depth Desync (2026-03-03)
- **Symptom**: `:app:createBundleReleaseJsAndAssets` fails with "Android Bundling failed".
- **Root Cause**: Desync in relative import paths (`../../../../packages/engine/...`). In `DialogueOverlay.tsx` (depth 3), 4 dots were used, pointing outside the project root.
- **Fix**: Adjusted relative paths in `DialogueOverlay.tsx`, `constants/mining.ts`, and `constants/runecrafting.ts` to correctly point to the engine package at `Arteria/packages/engine`.
