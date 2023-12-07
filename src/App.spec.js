import { render, router, screen } from 'test/helper'
import App from './App.vue'

describe('Routing', () => {
  describe.each([
    { path: '/', pageId: 'home-page' },
    { path: '/signup', pageId: 'signup-page' }
  ])('when path is $path', ({ path, pageId }) => {
    it(`displays ${pageId}`, async () => {
      router.push(path)
      await router.isReady()
      render(App)
      const page = screen.queryByTestId(pageId)
      expect(page).toBeInTheDocument()
    })
  })
})
