# Thoughts on EAS Build Times & User Confusion
The user is experiencing the slow turnaround time of Cloud Builds (Free Tier EAS queues can take a few minutes). They are concerned that they have to wait 5-10 minutes every time they want to test a change or push an update.

I need to explain the "Aha!" moment of Expo: Fast Refresh and OTA Updates.
1. **Testing is instant**: Once the Custom Dev Client is installed on their phone, they never have to build to test. They just run `npx expo start`, hit save in VSCode, and the app updates instantly over Wi-Fi (Fast Refresh).
2. **Updates are fast (OTA)**: Pushing simple logic/UI updates doesn't require a build. `eas update` sends it straight to the players.
3. **Why build?**: They only wait in this EAS queue when they change something *native* (like adding a new C++ module) or when they want to put a final `.aab` on the Google Play Store. And if they really hated the wait for native builds, they *could* build locally using standard Gradle (`npx expo run:android`), but sticking to EAS is safer for maintaining an ephemeral `android` folder.
