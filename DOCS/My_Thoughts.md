# My Thoughts
- Designing a Melvor Idle clone requires separating the "math engine" from the UI components. This is why a monorepo setup is perfect here. The `engine` package can just be pure TypeScript functions that calculate delta time and return state patches.
- Tamagui is excellent for performance and dark-mode by default.
- Since it's for mobile (Android specifically, modern stack 2026), Expo SDK 52+ with the New Architecture enabled is the standard. Let's make sure we plan for that.
