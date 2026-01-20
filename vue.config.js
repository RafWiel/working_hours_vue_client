const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
  ],
  publicPath: '/settlement/',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  configureWebpack: {
    output: {
      hashFunction: 'sha256',
      hashDigestLength: 8,
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].version = new Date().getTime(); // Add a timestamp to force cache busting
      return args;
    });
  },
});
