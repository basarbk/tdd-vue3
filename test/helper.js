import { i18n } from '@/locales'
import router from '@/router'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'

const customRender = (component, options) => {
  const user = userEvent.setup()
  const result = render(component, {
    global: {
      plugins: [i18n, router]
    },
    ...options
  })
  return {
    result,
    user
  }
}

export * from '@testing-library/vue'
export { customRender as render }
export { router }
