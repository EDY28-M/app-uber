const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add web-specific extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure react-native-web is properly resolved
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  'react-native': 'react-native-web',
};

// Web-specific transformer config to handle modules properly
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Ensure proper module resolution for web
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;
