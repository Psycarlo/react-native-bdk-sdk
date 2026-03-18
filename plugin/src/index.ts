import type { ConfigPlugin } from '@expo/config-plugins';
import { createRunOncePlugin, withPlugins } from '@expo/config-plugins';
import { withBdkAndroid } from './withAndroid';
import { withBdkIOS } from './withIOS';

const pkg = require('../../package.json');

export interface BdkPluginProps {
  skipBinaryDownload?: boolean;
}

const withBdkReactNative: ConfigPlugin<BdkPluginProps | void> = (config, props = {}) => {
  const { skipBinaryDownload = false } = props || {};

  return withPlugins(config, [
    [withBdkAndroid, { skipBinaryDownload }],
    [withBdkIOS, { skipBinaryDownload }],
  ]);
};

export default createRunOncePlugin(withBdkReactNative, pkg.name, pkg.version);
