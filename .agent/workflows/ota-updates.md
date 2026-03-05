---
description: How to push an OTA (Over-The-Air) update using EAS
---
# Over-The-Air (OTA) Updates Workflow

Use OTA updates when you change **only** JavaScript/TypeScript files, React Native UI components, styling, or assets. 

**DO NOT** use this workflow if you have modified native code (e.g., modifying `android/` or `ios/` folders, adding a new native module package, upgrading Expo SDK, changing app icons/permissions). Those changes require a completely new App Store/APK build.

## Step 1: Check your versioning
Open `app.json` and check `expo.android.runtimeVersion` and `expo.ios.runtimeVersion`.
- **Just pushing a JS/UI fix to the current live build?** Do NOT touch `runtimeVersion`. Leave it as is.
- **Did you recently change native code or build a new APK?** You MUST bump `runtimeVersion` (e.g., from `"0.4.2"` to `"0.4.3"`) *before* generating the new APK. Then, subsequent OTAs will be tagged with `"0.4.3"` and will only apply to devices running the new APK. (Because of Arteria's local `android/` generated bare workflow, we cannot use `{"policy": "appVersion"}` and must manually increment static strings).

## Step 2: Push the Update
1. From the project root, run:
   ```cmd
   Update_2_EAS_OTA_Update.bat
   ```
2. The script will automatically trigger a clean Production JS/Asset bundle export (which mimics the `com.anonymous.arteria` environment).
3. The script will prompt you for an update message (e.g., "Fixed Cooking screen crash").
4. It will then push the bundle to EAS under the **`production`** channel.

## Step 3: Verify the Update
1. Open the Arteria app on your device (must be the production APK, not the `-dev` build).
2. Go to **Settings -> About**.
3. Tap **Check for Updates**. Look for the "Downloading update..." prompt and the restart confirmation to ensure it successfully fetched.

## Emergency Rollback
If you pushed a broken OTA that causes the app to crash for users upon startup:
1. Run the rollback script:
   ```cmd
   Rollback_OTA.bat
   ```
2. This creates a new OTA release on the `production` channel reverting devices back to the exact state of the *previous* update. Returning users will seamlessly revert the next time they launch the app.
