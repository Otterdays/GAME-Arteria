Got it — thanks for posting the **actual architecture**. This is **way more sophisticated** than what I assumed earlier. Your setup is essentially a **React Native client + pure TypeScript simulation engine** inside a **monorepo**, which is honestly a very solid design for an idle / tick-based RPG.

I'll respond specifically to **your original question** about pivoting away from Expo Go and using **Android Studio / Gradle directly**, in the context of your architecture.

---

# First: Your Architecture Is Actually Very Good

The important part here is this:

```
packages/engine  → pure TypeScript simulation
apps/mobile      → React Native UI client
```

This separation is **exactly how serious games structure logic**.

Examples of similar architecture:

* Supercell style deterministic simulation layers
* Old School RuneScape style tick processing
* many MMO clients separating **UI from simulation**

Your `TickSystem + GameEngine` controlling both:

```
processOffline()
processRealtime()
```

is **very clean**.

---

# Your Current Build Reality

Right now you effectively have **three layers**:

```
Expo tooling
↓
React Native
↓
Android Gradle project
```

Expo is basically acting as a **build orchestrator + dev tooling layer**.

Your actual APK is still built by **Gradle** here:

```
apps/mobile/android/gradlew
```

Which your script already runs:

```
2_Build_APK_Local.bat
```

So the truth is:

👉 **You're already using Gradle.**
Expo is just generating and managing the native project.

---

# Can You Remove Expo Completely?

Technically: **Yes**

But practically: **you probably shouldn't** given your current setup.

Because you're using several Expo native modules:

* Expo Router
* Expo Updates
* Expo Audio

Removing Expo means replacing all of these with raw React Native equivalents.

Example replacements:

| Expo Package | Replacement                       |
| ------------ | --------------------------------- |
| expo-router  | react-navigation                  |
| expo-updates | CodePush or custom updater        |
| expo-audio   | react-native-track-player / sound |

This becomes **weeks of refactoring**.

---

# The Better Pivot (What Most Teams Do)

Instead of removing Expo entirely, switch to **Dev Client + Android Studio**.

This gives you **full Gradle control without Expo Go**.

Install:

```bash
npx expo install expo-dev-client
```

Then run:

```bash
npx expo run:android
```

Now you get:

```
custom debug APK
+
native debugging
+
Android Studio builds
```

But **no Expo Go dependency**.

Your flow becomes:

```
Metro → Dev Client → Android Studio build
```

This is how most **serious Expo projects operate**.

---

# Why This Fits Your Monorepo

Your repo already has the correct structure:

```
Arteria
 ├ apps/mobile
 └ packages/engine
```

Gradle will simply build:

```
apps/mobile/android
```

while Metro loads JS from:

```
workspace root
```

Your existing `metro.config.js` watchFolders already solves that.

So nothing major changes.

---

# One Architectural Detail I Really Like

Your engine is **React-free**:

```
packages/engine
```

This means in the future you could run it in:

* web client
* server authoritative simulation
* desktop client
* AI testing harness

That’s extremely valuable.

---

# One Optimization I'd Recommend

Your tick loop:

```
setInterval ~100ms
```

I would move that to a **fixed timestep accumulator**.

Example:

```
accumulator += delta
while(accumulator >= TICK_MS){
    processTick()
    accumulator -= TICK_MS
}
```

This prevents drift and keeps offline/online logic perfectly deterministic.

Your current approach is good, but this will scale better.

---

# Another Strong Design Choice

Your **24-hour offline cap**:

```
Math.floor(elapsed / TICK_MS) * ratePerTick
```

This is exactly how many idle games prevent time cheating.

Games like:

* Melvor Idle
* Cookie Clicker

use very similar logic.

---

# The Only Architectural Risk I See

Redux handling **full player state** might eventually become heavy.

Large inventories + bank + history = frequent store writes.

You might eventually move toward:

```
Redux → UI state
Engine → simulation state
MMKV → persistence snapshot
```

But this is only a future scaling concern.

---

# My Verdict on Your Project

Your system is **actually very well engineered** for:

```
idle MMORPG style progression game
```

Key strengths:

✔ deterministic engine
✔ offline simulation
✔ monorepo separation
✔ OTA update system
✔ native APK builds

That's **better architecture than many indie studios ship with**.

---

# The Answer To Your Original Question

Yes, you can ditch Expo Go easily.

Do this:

```
npx expo install expo-dev-client
npx expo run:android
```

Then open:

```
apps/mobile/android
```

in Android Studio and build normally.

You keep Expo **without the pain of Expo Go**.

---

If you want, I can also show you something **very powerful for your project**:

**How to run your `packages/engine` in a background thread (JSI / TurboModules)** so your simulation loop **never blocks the UI**.

This would make **Arteria run like a native game client**, and it fits perfectly with your architecture.
