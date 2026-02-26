# 📘 The Arteria Expo & EAS Guide

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

---

## 🚦 3. The Golden Rule: When do I need to rebuild?

Because the Development Client just streams your TypeScript code, **you rarely need to build a new APK.**

### 🟢 DO NOT Rebuild (Just `npx expo start`)
You **do not** need to run an EAS build if you are only changing:
- React components (`.tsx` files).
- Styling, colors, or CSS.
- TypeScript logic, Redux state, or Redux actions.
- Game engine math or mechanics.
- Assets (images, fonts).

*Just hit save, and it instantly updates on your phone.*

### 🔴 YOU MUST Rebuild (`eas build`)
You **must** generate a new EAS build (APK) if you:
- Install a new NPM package that contains **custom native code** (e.g., you add a camera package, a Bluetooth package, or an audio player).
- Change the app's Icon or Splash Screen.
- Change `app.json` configurations (like package name, version number, or permissions).
- Want to create the final "Release" version for the Google Play Store.

---

## ☁️ 4. EAS (Expo Application Services)

Because we deleted the `android/` folder, we don't build the app locally on your computer anymore. We outsource the heavy lifting to Expo's cloud servers using **EAS**.

### How to trigger a cloud build:
1. Make sure you are in the `apps/mobile` directory.
2. Run the build command:
   ```bash
   eas build --profile development --platform android
   ```
3. EAS will zip up your project, send it to the cloud, and build it on their high-end Linux servers.
4. When it finishes (~5 minutes), your terminal will display a **QR Code**.
5. Scan the QR code with your Android phone's camera, download the `.apk`, and install it.

*Note on Monorepos: Because we are in a Monorepo (`packages/engine` and `apps/mobile`), EAS needs to know to install dependencies at the root level. If a build fails on "Install Dependencies", it's usually a monorepo root path issue.*

---

## 🚀 5. Daily Workflow Summary

**Step 1:** Download the latest Development Client APK to your phone (if you haven't already, or if you recently installed a native NPM package).

**Step 2:** Open your terminal on your PC.

**Step 3:** Start the streaming server:
```bash
cd apps/mobile
npx expo start
```

**Step 4:** Open the Arteria Development app on your phone, and connect to your PC's IP address (or scan the QR code printed by `npx expo start`).

**Step 5:** Code! Hit save in VSCode and watch it instantly update on your phone.
