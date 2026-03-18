"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroid_1 = require("./withAndroid");
const withIOS_1 = require("./withIOS");
const pkg = require('../../package.json');
const withBdkReactNative = (config, props = {}) => {
    const { skipBinaryDownload = false } = props || {};
    return (0, config_plugins_1.withPlugins)(config, [
        [withAndroid_1.withBdkAndroid, { skipBinaryDownload }],
        [withIOS_1.withBdkIOS, { skipBinaryDownload }],
    ]);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withBdkReactNative, pkg.name, pkg.version);
