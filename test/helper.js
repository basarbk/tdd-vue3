import { i18n } from '@/locales'
import { render } from '@testing-library/vue'

const customRender = (component, options) => {
  return render(component, {
    global: {
      plugins: [i18n]
    },
    ...options
  })
}

export * from '@testing-library/vue'
export { customRender as render }
