import { createI18n } from 'vue-i18n'
import en from './translations/en.json'
import tr from './translations/tr.json'

export const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    tr
  }
})
