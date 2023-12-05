import { render } from '@testing-library/vue'
import AppInput from '../AppInput.vue'

describe('AppInput', () => {
  describe('when help is set', () => {
    it('has is-invalid class for input', () => {
      const { container } = render(AppInput, { props: { help: 'Error message' } })
      const input = container.querySelector('input')
      expect(input).toHaveClass('is-invalid')
    })
    it('has invalid-feedback class for span', () => {
      const { container } = render(AppInput, { props: { help: 'Error message' } })
      const span = container.querySelector('span')
      expect(span).toHaveClass('invalid-feedback')
    })
  })
  describe('when help is not set', () => {
    it('does not have is-invalid class for input', () => {
      const { container } = render(AppInput)
      const input = container.querySelector('input')
      expect(input).not.toHaveClass('is-invalid')
    })
  })
})
