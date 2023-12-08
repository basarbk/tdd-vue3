import { i18n } from '@/locales'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

afterEach(() => {
  i18n.global.locale = 'en'
  localStorage.clear()
})
