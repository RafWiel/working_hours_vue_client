import Vue from 'vue';
import VueI18n from 'vue-i18n';
import getBrowserLocale from '@/misc/browserLocale';

Vue.use(VueI18n);

const supportedLocales = [];

function loadLocaleMessages() {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i,
  );

  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
      supportedLocales.push(locale);
    }
  });

  return messages;
}

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });

  if (supportedLocales.indexOf(browserLocale) >= 0) {
    return browserLocale;
  }

  return process.env.VUE_APP_I18N_LOCALE || 'en';
}

export default new VueI18n({
  messages: loadLocaleMessages(),
  locale: getStartingLocale(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
});
