import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { debugOptions } from '@/parameters'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'es',
  messages: {
    es: require('@/locales/es.yml'),
  },
  silentTranslationWarn: !debugOptions.logTranslationWarn,
  missing: missingHandler,
})

export default ({ app }) => {
  app.i18n = i18n
}

// Support for Hot Reloading
if (module.hot) {
  module.hot.accept(['@/locales/es.yml'], function() {
    i18n.mergeLocaleMessage('es', require('@/locales/es.yml'))
  })
}

const debug = require('debug')('app:missing-trans')
const notified = {}
function missingHandler(lang, key) {
  if (!debug.enabled || notified[key] || !debugOptions.logMissingTranslations) return
  notified[key] = true
  debug(key)
}
