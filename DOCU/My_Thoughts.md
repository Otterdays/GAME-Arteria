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
