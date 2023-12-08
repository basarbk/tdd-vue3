import { render, router, screen, waitFor } from 'test/helper'
import Set from './Set.vue'
import { setupServer } from 'msw/node'
import { delay, http, HttpResponse } from 'msw'
import { i18n } from '@/locales'

const server = setupServer()

beforeEach(() => server.resetHandlers())

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = async () => {
  router.push('/password-reset/set?tk=123')
  await router.isReady()
  const { result, user } = render(Set)
  const passwordInput = screen.getByLabelText('Password')
  const passwordRepeatInput = screen.getByLabelText('Password Repeat')
  await user.type(passwordInput, 'P4ssword')
  await user.type(passwordRepeatInput, 'P4ssword')
  const button = screen.queryByRole('button', { name: 'Set password' })
  return {
    ...result,
    user,
    elements: {
      button,
      passwordInput,
      passwordRepeatInput
    }
  }
}

describe('Password Reset Set Page', () => {
  it('disables the button initially', () => {
    render(Set)
    expect(screen.queryByRole('button', { name: 'Set password' })).toBeDisabled()
  })
  it('does not display spinner', async () => {
    render(Set)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
  describe('when user sets same value for password inputs', () => {
    it('enables the button', async () => {
      const {
        elements: { button }
      } = await setup()
      expect(button).toBeEnabled()
    })

    describe('when user submits form', () => {
      it('sends new password and token to backend', async () => {
        let body
        let token
        server.use(
          http.patch('/api/v1/users/:resetToken/password', async ({ request, params }) => {
            body = await request.json()
            token = params.resetToken
            return HttpResponse.json({ message: 'Password update success' })
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        await waitFor(() => {
          expect(token).toBe('123')
          expect(body).toEqual({
            password: 'P4ssword'
          })
        })
      })

      describe('when there is an ongoing api Set', () => {
        it('does not allow clicking to the button', async () => {
          let counter = 0
          server.use(
            http.patch('/api/v1/users/:resetToken/password', async () => {
              counter += 1
              await delay('infinite')
              return HttpResponse.json({ message: 'Password update success' })
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
            http.patch('/api/v1/users/:resetToken/password', async () => {
              await delay('infinite')
              return HttpResponse.json({ message: 'Password update success' })
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
              http.patch('/api/v1/users/:resetToken/password', async ({ request }) => {
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
            http.patch('/api/v1/users/:resetToken/password', async () => {
              return HttpResponse.json({ message: 'Password update success' })
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          const text = await screen.findByText('Password update success')
          expect(text).toBeInTheDocument()
        })
      })
      describe('when network failure occurs', () => {
        it('displays message generic error message', async () => {
          server.use(
            http.patch('/api/v1/users/:resetToken/password', () => {
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
            http.patch('/api/v1/users/:resetToken/password', () => {
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
          it('hides error when api Set in progress', async () => {
            let processedFirstSet = false
            server.use(
              http.patch('/api/v1/users/:resetToken/password', () => {
                if (!processedFirstSet) {
                  processedFirstSet = true
                  return HttpResponse.error()
                } else {
                  return HttpResponse.json({ message: 'Password update success' })
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

      describe('when password is invalid', () => {
        beforeEach(() => {
          server.use(
            http.patch('/api/v1/users/:resetToken/password', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    password: 'Password cannot be null'
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
          const validationError = await screen.findByText('Password cannot be null')
          expect(validationError).toBeInTheDocument()
        })

        it('clears validation error after email field is updated', async () => {
          const {
            user,
            elements: { button, passwordInput }
          } = await setup()
          await user.click(button)
          const validationError = await screen.findByText('Password cannot be null')
          await user.type(passwordInput, 'Updated')
          expect(validationError).not.toBeInTheDocument()
        })
      })

      describe('when there is no validation error', () => {
        it('displays error returned from server', async () => {
          server.use(
            http.patch('/api/v1/users/:resetToken/password', () => {
              return HttpResponse.json(
                {
                  message: 'Invalid token'
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
          const error = await screen.findByText('Invalid token')
          expect(error).toBeInTheDocument()
        })
      })
    })
  })
})
