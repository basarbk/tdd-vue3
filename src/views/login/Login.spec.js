import { render, screen, waitFor } from 'test/helper'
import Login from './Login.vue'
import { setupServer } from 'msw/node'
import { delay, http, HttpResponse } from 'msw'
import { i18n } from '@/locales'

let requestBody,
  counter = 0
const server = setupServer(
  http.post('/api/v1/auth', async ({ request }) => {
    requestBody = await request.json()
    counter += 1
    return HttpResponse.json({ id: 1, username: 'user1', email: 'user1@mail.com', image: null })
  })
)

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = async () => {
  const { result, user } = render(Login)
  const emailInput = screen.getByLabelText('E-mail')
  const passwordInput = screen.getByLabelText('Password')
  await user.type(emailInput, 'user1@mail.com')
  await user.type(passwordInput, 'P4ssword')
  const button = screen.queryByRole('button', { name: 'Login' })
  return {
    ...result,
    user,
    elements: {
      button,
      emailInput,
      passwordInput
    }
  }
}

describe('Login Page', () => {
  it('has header', () => {
    render(Login)
    const header = screen.queryByRole('heading', { name: 'Login' })
    expect(header).toBeInTheDocument()
  })
  it('has email input', () => {
    render(Login)
    expect(screen.queryByLabelText('E-mail')).toBeInTheDocument()
  })
  it('has password input', () => {
    render(Login)
    expect(screen.queryByLabelText('Password')).toBeInTheDocument()
  })
  it('has password type for password input', () => {
    render(Login)
    expect(screen.queryByLabelText('Password')).toHaveAttribute('type', 'password')
  })
  it('has Login button', () => {
    render(Login)
    expect(screen.queryByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
  it('disables the button initially', () => {
    render(Login)
    expect(screen.queryByRole('button', { name: 'Login' })).toBeDisabled()
  })
  it('does not display spinner', async () => {
    render(Login)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
  describe('when user sets same value for inputs', () => {
    it('enables the button', async () => {
      const {
        elements: { button }
      } = await setup()
      expect(button).toBeEnabled()
    })

    describe('when user submits form', () => {
      it('sends email and password to backend', async () => {
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        await waitFor(() => {
          expect(requestBody).toEqual({
            email: 'user1@mail.com',
            password: 'P4ssword'
          })
        })
      })

      it('does not allow clicking to button when there is an ongoing api call', async () => {
        let counter = 0
        server.use(
          http.post('/api/v1/auth', async () => {
            counter += 1
            await delay('infinite')
            return HttpResponse.json({
              id: 1,
              username: 'user1',
              email: 'user1@mail.com',
              image: null
            })
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()

        await user.click(button)
        await user.click(button)

        await waitFor(() => {
          expect(counter).toBe(1)
        })
      })

      it('displays spinner', async () => {
        server.use(
          http.post('/api/v1/auth', async (req, res, ctx) => {
            await delay('infinite')
            return HttpResponse.json({
              id: 1,
              username: 'user1',
              email: 'user1@mail.com',
              image: null
            })
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      describe.each([{ language: 'tr' }, { language: 'en' }])(
        'when language is $language',
        ({ language }) => {
          it('should send expected language in accept language header', async () => {
            let acceptLanguage
            server.use(
              http.post('/api/v1/auth', async ({ request }) => {
                acceptLanguage = request.headers.get('Accept-Language')
                return HttpResponse.error()
              })
            )
            const {
              user,
              elements: { button }
            } = await setup()
            i18n.global.locale = language
            await user.click(button)
            await waitFor(() => {
              expect(acceptLanguage).toBe(language)
            })
          })
        }
      )

      describe('when network failure occurs', () => {
        it('displays message generic error message', async () => {
          server.use(
            http.post('/api/v1/auth', () => {
              return HttpResponse.error()
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          expect(text).toBeInTheDocument()
        })
        it('hides spinner', async () => {
          server.use(
            http.post('/api/v1/auth', () => {
              return HttpResponse.error()
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          })
        })
        describe('when user submits again', () => {
          it('hides error when api request in progress', async () => {
            let processedFirstRequest = false
            server.use(
              http.post('/api/v1/auth', () => {
                if (!processedFirstRequest) {
                  processedFirstRequest = true
                  return HttpResponse.error()
                } else {
                  return HttpResponse.json({
                    id: 1,
                    username: 'user1',
                    email: 'user1@mail.com',
                    image: null
                  })
                }
              })
            )
            const {
              user,
              elements: { button }
            } = await setup()
            await user.click(button)
            await screen.findByText('Unexpected error occurred, please try again')
            await user.click(button)
            await waitFor(() => {
              expect(
                screen.queryByText('Unexpected error occurred, please try again')
              ).not.toBeInTheDocument()
            })
          })
        })
      })

      describe.each([
        { field: 'email', error: 'E-mail cannot be null' },
        { field: 'password', error: 'Password cannot be null' }
      ])('when $field is invalid', ({ field, error }) => {
        it('displays validation error', async () => {
          server.use(
            http.post('/api/v1/auth', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    [field]: error
                  }
                },
                { status: 400 }
              )
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const validationError = await screen.findByText(error)
          expect(validationError).toBeInTheDocument()
        })

        it(`clears validation error after ${field} field is updated`, async () => {
          server.use(
            http.post('/api/v1/auth', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    [field]: error
                  }
                },
                { status: 400 }
              )
            })
          )
          const { user, elements } = await setup()
          await user.click(elements.button)
          const validationError = await screen.findByText(error)
          await user.type(elements[`${field}Input`], 'Updated')
          expect(validationError).not.toBeInTheDocument()
        })
      })
      describe('when there is no validation error', () => {
        it('displays error returned from server', async () => {
          server.use(
            http.post('/api/v1/auth', () => {
              return HttpResponse.json(
                {
                  message: 'Incorrect credentials'
                },
                { status: 401 }
              )
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const error = await screen.findByText('Incorrect credentials')
          expect(error).toBeInTheDocument()
        })
      })
    })
  })
})
