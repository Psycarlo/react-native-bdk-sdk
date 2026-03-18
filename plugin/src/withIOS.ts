import { type ConfigPlugin } from '@expo/config-plugins';

export const withBdkIOS: ConfigPlugin = (config) => {
  // Currently no additional iOS configuration needed
  return config;
};