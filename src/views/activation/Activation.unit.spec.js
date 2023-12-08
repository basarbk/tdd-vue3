vi.mock('./api')
vi.mock('vue-i18n')
vi.mock('vue-router')
import { render, waitFor, screen } from '@testing-library/vue'
import Activation from './Activation.vue'
import { useI18n } from 'vue-i18n'
import en from '@/locales/translations/en.json'
import { activate } from './api'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

vi.mocked(useI18n).mockReturnValue({
  t: (key) => en[key]
})

const mockUseRoute = vi.mocked(useRoute).mockReturnValue({
  params: {
    token: '123'
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

const setup = async (token) => {
  const route = reactive({
    params: {
      token
    }
  })
  const result = render(Activation, {
    global: {
      mocks: {
        $t: (key) => en[key],
        $route: route
      }
    }
  })
  return {
    ...result,
    route
  }
}

describe('Activation', () => {
  it('sends activation request to server', async () => {
    await setup('/')
    await waitFor(() => {
      expect(activate).toHaveBeenCalledTimes(1)
    })
  })

  describe.each([{ activationToken: '123' }, { activationToken: '456' }])(
    'when token is $activationToken',
    ({ activationToken }) => {
      it('sends token in request', async () => {
        mockUseRoute.mockReturnValue({
          params: {
            token: activationToken
          }
        })
        await setup(activationToken)
        await waitFor(() => {
          expect(activate).toHaveBeenCalledWith(activationToken)
        })
      })
    }
  )

  describe('when token is changed', () => {
    it('sends request with new token', async () => {
      const route = reactive({
        params: {
          token: '123'
        }
      })
      mockUseRoute.mockReturnValue(route)
      await setup()
      // const { route } = await setup('123')
      await waitFor(() => {
        expect(activate).toHaveBeenCalledWith('123')
      })
      route.params.token = '456'
      await waitFor(() => {
        expect(activate).toHaveBeenCalledWith('456')
      })
    })
  })

  describe('when network error occurs', () => {
    it('displays generic error message', async () => {
      activate.mockRejectedValue({})
      await setup('/activation/123')
      const text = await screen.findByText('Unexpected error occurred, please try again')
      expect(text).toBeInTheDocument()
    })
  })

  describe('when token is invalid', () => {
    it('displays error message received in response', async () => {
      let rejectFunc
      activate.mockImplementation(
        () =>
          new Promise((reject) => {
            rejectFunc = reject
          })
      )
      await setup()
      expect(screen.queryByText('Activation failure')).not.toBeInTheDocument()
      await rejectFunc({ data: { message: 'Activation failure' } })
      await waitFor(() => {
        expect(screen.queryByText('Activation failure')).toBeInTheDocument()
      })
    })
  })

  describe('when token is valid', () => {
    it('displays success message received in response', async () => {
      let resolveFunc
      activate.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFunc = resolve
          })
      )
      await setup()
      expect(screen.queryByText('Account is activated')).not.toBeInTheDocument()
      await resolveFunc({ data: { message: 'Account is activated' } })
      await waitFor(() => {
        expect(screen.queryByText('Account is activated')).toBeInTheDocument()
      })
    })
  })

  it('displays spinner', async () => {
    let resolveFunc
    activate.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFunc = resolve
        })
    )
    await setup()
    const spinner = await screen.findByRole('status')
    expect(spinner).toBeInTheDocument()
    await resolveFunc({ data: { message: 'Account is activated' } })
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument()
    })
  })
})
