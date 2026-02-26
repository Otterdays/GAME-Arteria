# The ADHD Guide to Arteria Updates

**Q: How do I test the app while I'm coding?**
A: Double-click `0_Start_Dev_Server.bat` in the root folder.

**Q: Do I have to wait 10 minutes to test my code?**
A: No, the Dev Server streams your code instantly to your phone when you hit save.

**Q: How do I push a game update to players (like fixing math or changing colors)?**
A: Run `Update_2_EAS_OTA_Update.bat` to beam the update straight to their phones.

**Q: How do I save my code to GitHub so I don't lose my work?**
A: Run `Update_1_Git_Push.bat`.

**Q: When DO I actually have to wait for a 10-minute build?**
A: Only when you install a new NPM package with native C++ code (like `expo-camera`) or change the app icon!

**Q: How do I make a brand new test APK for my phone?**
A: Run `Update_3_EAS_Build_Android_Dev.bat`.

**Q: How do I make the final version for the Google Play Store?**
A: Run `Update_4_EAS_Build_Android_Prod.bat`.
