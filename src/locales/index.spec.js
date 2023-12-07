import { createInstance } from './index'

const mockNavigatorLanguage = vi.spyOn(window.navigator, 'language', 'get')

afterEach(() => {
  mockNavigatorLanguage.mockReset()
})

describe('createInstance', () => {
  describe('when app-lang is not set in localStorage', () => {
    describe('when browser language is undefined', () => {
      it('sets the language as en', () => {
        mockNavigatorLanguage.mockReturnValue(undefined)
        const i18n = createInstance()
        expect(i18n.global.locale).toBe('en')
      })
    })
    describe('when browser language is set', () => {
      it('sets the language as browser language', () => {
        mockNavigatorLanguage.mockReturnValue('ab')
        const i18n = createInstance()
        expect(i18n.global.locale).toBe('ab')
      })
    })
  })

  describe('when app-lang is set in localStorage', () => {
    it('sets the language from localStorage', () => {
      localStorage.setItem('app-lang', 'fr')
      const i18n = createInstance()
      expect(i18n.global.locale).toBe('fr')
    })
  })
})
