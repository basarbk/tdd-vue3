import { render, screen, waitFor } from 'test/helper'
import Request from './Request.vue'
import { setupServer } from 'msw/node'
import { delay, http, HttpResponse } from 'msw'
import { i18n } from '@/locales'

const server = setupServer()

beforeEach(() => server.resetHandlers())

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = async () => {
  const { result, user } = render(Request)
  const emailInput = screen.getByLabelText('E-mail')
  await user.type(emailInput, 'user1@mail.com')
  const button = screen.queryByRole('button', { name: 'Reset password' })
  return {
    ...result,
    user,
    elements: {
      button,
      emailInput
    }
  }
}

describe('Password Reset Request Page', () => {
  it('disables the button initially', () => {
    render(Request)
    expect(screen.queryByRole('button', { name: 'Reset password' })).toBeDisabled()
  })
  it('does not display spinner', async () => {
    render(Request)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
  describe('when user sets email', () => {
    it('enables the button', async () => {
      const {
        elements: { button }
      } = await setup()
      expect(button).toBeEnabled()
    })

    describe('when user submits form', () => {
      it('sends email to backend', async () => {
        let requestBody
        server.use(
          http.post('/api/v1/users/password-reset', async ({ request }) => {
            requestBody = await request.json()
            return HttpResponse.json({ message: 'Check your email' })
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        await waitFor(() => {
          expect(requestBody).toEqual({
            email: 'user1@mail.com'
          })
        })
      })

      describe('when there is an ongoing api request', () => {
        it('does not allow clicking to the button', async () => {
          let counter = 0
          server.use(
            http.post('/api/v1/users/password-reset', async () => {
              counter += 1
              await delay('infinite')
              return HttpResponse.json({ message: 'Check your email' })
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
            http.post('/api/v1/users/password-reset', async () => {
              await delay('infinite')
              return HttpResponse.json({ message: 'Check your email' })
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          expect(screen.getByRole('status')).toBeInTheDocument()
        })
      })

      describe.each([{ language: 'tr' }, { language: 'en' }])(
        'when language is $language',
        ({ language }) => {
          it('should send expected language in accept language header', async () => {
            let acceptLanguage
            server.use(
              http.post('/api/v1/users/password-reset', async ({ request }) => {
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

      describe('when success response is received', () => {
        it('displays message received from backend', async () => {
          server.use(
            http.post('/api/v1/users/password-reset', async () => {
              return HttpResponse.json({ message: 'Check your email' })
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          const text = await screen.findByText('Check your email')
          expect(text).toBeInTheDocument()
        })
      })
      describe('when network failure occurs', () => {
        it('displays message generic error message', async () => {
          server.use(
            http.post('/api/v1/users/password-reset', () => {
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
            http.post('/api/v1/users/password-reset', () => {
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
              http.post('/api/v1/users/password-reset', () => {
                if (!processedFirstRequest) {
                  processedFirstRequest = true
                  return HttpResponse.error()
                } else {
                  return HttpResponse.json({ message: 'Check your email' })
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

      describe('when email is invalid', () => {
        beforeEach(() => {
          server.use(
            http.post('/api/v1/users/password-reset', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    email: 'E-mail cannot be null'
                  }
                },
                { status: 400 }
              )
            })
          )
        })
        it('displays validation error', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const validationError = await screen.findByText('E-mail cannot be null')
          expect(validationError).toBeInTheDocument()
        })

        it('clears validation error after email field is updated', async () => {
          const {
            user,
            elements: { button, emailInput }
          } = await setup()
          await user.click(button)
          const validationError = await screen.findByText('E-mail cannot be null')
          await user.type(emailInput, 'Updated')
          expect(validationError).not.toBeInTheDocument()
        })
      })

      describe('when there is no validation error', () => {
        it('displays error returned from server', async () => {
          server.use(
            http.post('/api/v1/users/password-reset', () => {
              return HttpResponse.json(
                {
                  message: 'Unknown user'
                },
                { status: 404 }
              )
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const error = await screen.findByText('Unknown user')
          expect(error).toBeInTheDocument()
        })
      })
    })
  })
})
