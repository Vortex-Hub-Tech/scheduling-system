const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /(server|client)\/.*|index\.html|vite\.config\.ts|drizzle\.config\.ts/;

config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

config.watchFolders = [path.resolve(__dirname, 'app'), path.resolve(__dirname, 'app/components'), path.resolve(__dirname, 'app/constants'), path.resolve(__dirname, 'app/hooks'), path.resolve(__dirname, 'shared')];

module.exports = config;
