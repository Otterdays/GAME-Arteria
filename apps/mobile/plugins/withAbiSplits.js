/**
 * Expo Config Plugin: ABI Splits
 * 
 * Automatically injects the ABI splits block into android/app/build.gradle
 * so it survives `expo prebuild --clean`.
 * 
 * Without this, you'd have to manually re-add the splits block after every
 * prebuild, or risk building a fat ~93 MB universal APK.
 * 
 * [TRACE: DOCU/EXPO_GUIDE.md — ABI Splits]
 */
const { withAppBuildGradle } = require('expo/config-plugins');

/** The Gradle snippet to inject. Produces per-ABI APKs (arm64 ~30 MB, armv7 ~25 MB). */
const ABI_SPLITS_BLOCK = `
    // [ABI Splits — injected by plugins/withAbiSplits.js]
    // Produces per-architecture APKs instead of one fat universal APK.
    // arm64-v8a (~30 MB) for modern phones, armeabi-v7a (~25 MB) for older 32-bit.
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "arm64-v8a", "armeabi-v7a"
        }
    }`;

module.exports = function withAbiSplits(config) {
    return withAppBuildGradle(config, (cfg) => {
        const buildGradle = cfg.modResults.contents;

        // Only inject if not already present (idempotent)
        if (buildGradle.includes('splits {')) {
            return cfg;
        }

        // Insert the splits block right before the closing brace of the android { } block.
        // We find the last `}` that closes `android {` by looking for `androidResources`
        // (which is typically the last block inside android { }).
        const insertPoint = buildGradle.lastIndexOf('androidResources');
        if (insertPoint === -1) {
            // Fallback: find the packagingOptions block end
            const pkgPoint = buildGradle.lastIndexOf('packagingOptions');
            if (pkgPoint !== -1) {
                // Find the closing brace of packagingOptions, then insert after it
                const afterPkg = buildGradle.indexOf('}', buildGradle.indexOf('}', pkgPoint) + 1);
                if (afterPkg !== -1) {
                    cfg.modResults.contents =
                        buildGradle.slice(0, afterPkg + 1) +
                        '\n' + ABI_SPLITS_BLOCK +
                        buildGradle.slice(afterPkg + 1);
                }
            }
            return cfg;
        }

        // Find the closing `}` of the androidResources block, then insert after it
        const afterAndroidResources = buildGradle.indexOf('}', buildGradle.indexOf('{', insertPoint));
        if (afterAndroidResources !== -1) {
            cfg.modResults.contents =
                buildGradle.slice(0, afterAndroidResources + 1) +
                '\n' + ABI_SPLITS_BLOCK +
                buildGradle.slice(afterAndroidResources + 1);
        }

        return cfg;
    });
};
