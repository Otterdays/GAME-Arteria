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

module.exports = ({ config }) => {
  const baseExpoConfig = appJson.expo || config || {};
  const isLeanProdBuild = process.env.ARTERIA_LEAN_PROD === '1';

  if (!isLeanProdBuild) {
    return { expo: baseExpoConfig };
  }

  // Lean production: keep JS deps, but skip dev-client native modules at link time.
  const baseAutolinking = baseExpoConfig.autolinking || {};
  const baseAndroid = baseAutolinking.android || {};

  return {
    expo: {
      ...baseExpoConfig,
      autolinking: {
        ...baseAutolinking,
        exclude: mergeUnique(baseAutolinking.exclude, LEAN_PROD_EXCLUDES),
        android: {
          ...baseAndroid,
          exclude: mergeUnique(baseAndroid.exclude, LEAN_PROD_EXCLUDES),
        },
      },
    },
  };
};
