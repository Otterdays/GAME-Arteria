const appJson = require('./app.json');

const LEAN_PROD_EXCLUDES = [
  'expo-dev-client',
  'expo-dev-launcher',
  'expo-dev-menu',
  'expo-dev-menu-interface',
  'expo-json-utils',
  'expo-manifests',
  'expo-log-box',
];

function mergeUnique(valuesA = [], valuesB = []) {
  return Array.from(new Set([...(valuesA || []), ...(valuesB || [])]));
}

/**
 * Dev vs Prod app identity. [TRACE: DOCU/EXPO_GUIDE.md — Dev/Prod Coexistence]
 * - ARTERIA_LEAN_PROD=1 (2_Build_APK_Local.bat): "Arteria", com.anonymous.arteria
 * - Default (1_Run_Local_Android_Build, expo start): "Arteria-dev", com.anonymous.arteria.dev
 * Both can be installed on the same device.
 */
function getAppIdentity() {
  const isProd = process.env.ARTERIA_LEAN_PROD === '1';
  return isProd
    ? { name: 'Arteria', package: 'com.anonymous.arteria' }
    : { name: 'Arteria-dev', package: 'com.anonymous.arteria.dev' };
}

module.exports = ({ config }) => {
  const baseExpoConfig = appJson.expo || config || {};
  const isLeanProdBuild = process.env.ARTERIA_LEAN_PROD === '1';
  const { name, package: pkg } = getAppIdentity();

  const merged = {
    ...baseExpoConfig,
    name,
    android: {
      ...baseExpoConfig.android,
      package: pkg,
    },
  };

  if (isLeanProdBuild) {
    const baseAutolinking = merged.autolinking || {};
    const baseAndroid = baseAutolinking.android || {};
    merged.autolinking = {
      ...baseAutolinking,
      exclude: mergeUnique(baseAutolinking.exclude, LEAN_PROD_EXCLUDES),
      android: {
        ...baseAndroid,
        exclude: mergeUnique(baseAndroid.exclude, LEAN_PROD_EXCLUDES),
      },
    };
  }

  return { expo: merged };
};
