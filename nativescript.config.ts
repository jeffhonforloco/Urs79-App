import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.urs79.app',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true,
    suppressCallJSMethodExceptions: false
  },
  ios: {
    discardUncaughtJsExceptions: false,
    SPMPackages: []
  },
  webpackConfigPath: 'webpack.config.js',
  appVersion: '1.0.0',
  displayName: 'URS79',
  author: 'URS79 Team'
} as NativeScriptConfig;