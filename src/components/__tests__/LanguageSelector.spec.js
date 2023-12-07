import { render, screen } from 'test/helper'
import LanguageSelector from '../LanguageSelector.vue'

describe('Language selector', () => {
  describe.each([
    { language: 'tr', text: 'Kayıt Ol' },
    { language: 'en', text: 'Sign Up' }
  ])('when user select $language', ({ language, text }) => {
    it('displays expected text', async () => {
      const TempComponent = {
        components: {
          LanguageSelector
        },
        template: `
            <span>{{ $t('signUp') }}</span>
            <LanguageSelector />
            `
      }

      const { user } = render(TempComponent)
      await user.click(screen.getByTestId(`language-${language}-selector`))
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    it('stores language in localStorage', async () => {
      const TempComponent = {
        components: {
          LanguageSelector
        },
        template: `
                <span>{{ $t('signUp') }}</span>
                <LanguageSelector />
                `
      }

      const { user } = render(TempComponent)
      await user.click(screen.getByTestId(`language-${language}-selector`))
      expect(localStorage.getItem('app-lang')).toBe(language)
    })
  })
})
