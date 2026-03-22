module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        // Reanimated 4 uses worklets internally; do not add react-native-worklets/plugin
        // (duplicate Babel plugins break expo-modules-autolinking / Gradle autolink).
        plugins: ['react-native-reanimated/plugin'],
    };
};
