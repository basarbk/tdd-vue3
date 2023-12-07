import { render, waitFor, router } from 'test/helper'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { afterAll, beforeAll } from 'vitest'
import Activation from './Activation.vue'
let counter = 0
let token
const server = setupServer(
  http.patch('/api/v1/users/:token/active', ({ params }) => {
    counter += 1
    token = params.token
    return HttpResponse.json({})
  })
)

beforeEach(() => {
  counter = 0
  token = undefined
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = async (path) => {
  router.push(path)
  await router.isReady()
  return render(Activation)
}

describe('Activation', () => {
  it('sends activation request to server', async () => {
    await setup('/')
    await waitFor(() => {
      expect(counter).toBe(1)
    })
  })

  describe.each([{ activationToken: '123' }, { activationToken: '456' }])(
    'when token is $token',
    ({ activationToken }) => {
      it('sends token in request', async () => {
        await setup(`/activation/${activationToken}`)
        await waitFor(() => {
          expect(token).toBe(activationToken)
        })
      })
    }
  )

  describe('when token is changed', () => {
    it('sends request with new token', async () => {
      await setup('/activation/123')
      await waitFor(() => {
        expect(token).toBe('123')
      })
      router.push('/activation/456')
      await waitFor(() => {
        expect(token).toBe('456')
      })
    })
  })
})
