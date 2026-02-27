# 📘 The Arteria Expo & EAS Guide

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

Welcome to Expo! If you're coming from traditional React Native (or standard native development), Expo's philosophy is a huge paradigm shift. 
This guide explains how Expo works, how we build the app, and the golden rules for when you actually need to trigger a build.

---

## 🏗️ 1. Continuous Native Generation (CNG)
In traditional React Native, you have permanent `android/` and `ios/` folders. You have to open Android Studio and Xcode, fiddle with Gradle files, update Podfiles, and manage native permissions manually.

**Expo throws all of that in the trash.**

With **Continuous Native Generation (CNG)**, your `android/` and `ios/` folders are considered **temporary (ephemeral)**. We do not commit them to Git. Instead, Expo completely regenerates them from scratch every time you build, using the configuration in `app.json`.

**Benefits:**
- Upgrades are painless (no more merge conflicts in Gradle files).
- You stay in JavaScript/TypeScript world 99% of the time.
- The project is much cleaner.

---

## 📱 2. How the App Actually Runs (The Development Build)

When you develop with Expo, you aren't building a final "Release" APK every time. Instead, we build a **Development Client**.

Think of the Development Client as a custom web browser installed on your phone. It contains all the heavy native C++/Java/Swift code (like our MMKV database, standard React Native engine, GPU gesture handlers, etc). 

When you run `npx expo start` on your computer, it starts a local server (Metro Bundler). When you open the Development Client app on your phone, it connects to your computer over Wi-Fi and **streams your JavaScript/TypeScript code straight into the app**.

*Every time you hit save in VS Code, the app updates on your phone in less than a second (Fast Refresh).*

**Where to run from:** Start the dev server from **`apps/mobile`** (e.g. double-click `0_Start_Dev_Server.bat`, or from root run `npm run mobile`). If you run `npx expo start` from the monorepo root, the root `package.json` has `"main": "apps/mobile/index.js"` so Metro still uses the correct Expo Router entry; without that, you would see "Unable to resolve '../../App'" because Expo's default entry expects a root `App` component.

---

## 🚦 3. The Golden Rule: Do I have to build every time? (NO! ⚡)

Because the Development Client just streams your TypeScript code, **you rarely need to build a new APK to test or send updates.**
Do not sit around waiting for a 10-minute EAS cloud build just to see your changes! 

### 🟢 DO NOT Rebuild (Just click `0_Start_Dev_Server.bat`)
You **do not** need to run an EAS build if you are only changing:
- React components (`.tsx` files).
- Styling, colors, or CSS.
- TypeScript logic, Redux state, or Redux actions.
- Game engine math or mechanics.
- Assets (images, fonts).

*Just hit save, and it instantly updates on your phone in under a second (Fast Refresh).*
### 🔴 YOU MUST Rebuild (EAS build)
You **must** generate a new EAS build (APK) if you:
- Install a new NPM package that contains **custom native code** (e.g., you add a camera package, a Bluetooth package, or an audio player).
- Change the app's Icon or Splash Screen.
- Change `app.json` configurations (like package name, version number, or permissions).
- Want to create the final "Release" version for the Google Play Store.

---

## ☁️ 4. EAS (Expo Application Services)

> [!CAUTION]
> **EAS Credits Exhausted (as of 2026):** Cloud builds via EAS are currently unavailable due to depleted build credits. Use the **local APK build** (Section 4b) instead.

Because we deleted the `android/` folder, we don't build the app locally on your computer anymore. We outsource the heavy lifting to Expo's cloud servers using **EAS**.

### How to trigger a cloud build (when credits available):
1. Run **`Update_3_EAS_Build_Android_Dev.bat`** (recommended), or from `apps/mobile`:
   ```bash
   npx eas-cli build --profile development --platform android
   ```
   *No global EAS install needed — the batch scripts and this command use `npx eas-cli`.*
2. EAS will zip up your project, send it to the cloud, and build it on their high-end Linux servers.
3. When it finishes (~5 minutes), your terminal will display a **QR Code**.
4. Scan the QR code with your Android phone's camera, download the `.apk`, and install it.

*Note on Monorepos: Because we are in a Monorepo (`packages/engine` and `apps/mobile`), EAS needs to know to install dependencies at the root level. If a build fails on "Install Dependencies", it's usually a monorepo root path issue.*

### 4b. Local APK Build (No EAS Credits Required)

When EAS credits are exhausted, use the **local build** to produce a shareable APK on your machine.

**Requirements:** Android Studio + Android SDK installed (same as `1_Run_Local_Android_Build.bat`).

**Run:** `2_Build_APK_Local.bat`

This runs `npx expo run:android --variant release` from `apps/mobile`, ensuring Metro uses the correct monorepo project root (avoids "Unable to resolve module ./index.js" when bundling from root).

APK output:
```
apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

You can copy this `.apk` file and share it (e.g. via USB, cloud drive, or direct transfer). Recipients may need to enable "Install from unknown sources" to sideload it.

---

## 📁 5. Monorepo Configuration Details

Because Arteria isolates its game engine from its mobile UI (a Monorepo workspace), NPM hoists overlapping packages to the very root desktop folder.
To prevent Metro and Babel from crashing (such as the `EXPO_ROUTER_APP_ROOT` environment error), we use a specific structure:
1. **The root `package.json`** directly requires `expo-router` so Babel does not ignore it.
2. **We maintain two `babel.config.js` files**: One at the root (to process hoisted modules), and one in `apps/mobile`.
3. **Custom entry proxy**: `apps/mobile/index.js` acts as a middleman importer to ensure Babel does not skip the `expo-router` context provider.

---

## 🚀 6. Daily Workflow Summary

**Step 1:** Download the latest Development Client APK to your phone (if you haven't already, or if you recently installed a native NPM package).

**Step 2:** Open your terminal on your PC.

**Step 3:** Start the streaming server! Either run `npm run mobile` or just double-click:
```bash
0_Start_Dev_Server.bat
```

**Step 4:** Open the Arteria Development app on your phone, and connect to your PC's IP address (or scan the QR code printed by `npx expo start`).

**Step 5:** Code! Hit save in VSCode and watch it instantly update on your phone.

---

## 🔄 7. Pushing Updates to Players

When you're ready to share your updates, you have three distinct methods depending on *what* you changed. We have created batch scripts in the project root to automate these!

### 1. Pushing code to GitHub (Version Control)
*Use this when: You want to save your progress or back up your code to GitHub.*
This doesn't send code to players, only to the repository. 
* **Run:** `Update_1_Git_Push.bat`

### 2. Over-the-Air (OTA) Updates ⚡ (Fast)
*Use this when: You change TypeScript/JavaScript logic, UI components, colors, text, or styling.*
EAS has a feature called **EAS Update** that bypasses App Store reviews! When returning players open the app, it pulls down your new JavaScript bundle instantly over Wi-Fi.
* **Run:** `Update_2_EAS_OTA_Update.bat`

### 3. Native App Store Updates 🏗️ (Slow, requires Review)
*Use this when: You upgrade Expo SDK versions, install new libraries with native code (like adding a custom native module), change app icons, or change permissions.*
OTA updates can't add or remove native C++/Java code. To do that, you must rebuild the application binary (APK/AAB) and submit it to the Google Play Store.
* **Run:** `Update_3_EAS_Build_Android_Dev.bat` (For internal testing)
* **Run:** `Update_4_EAS_Build_Android_Prod.bat` (For final App Store release)
