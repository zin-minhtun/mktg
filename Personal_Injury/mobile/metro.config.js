const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// REQUIRED for Firebase + SDK 52+
config.resolver.unstable_enablePackageExports = false;

// HARD SAFETY: Metro must NEVER look outside mobile/
config.watchFolders = [];

module.exports = config;
