import { render, waitFor, router, screen } from 'test/helper'
import User from './User.vue'
import { setupServer } from 'msw/node'
import { delay, http, HttpResponse } from 'msw'
import { i18n } from '@/locales'

let counter = 0
let id
const server = setupServer(
  http.get('/api/v1/users/:id', async ({ params }) => {
    counter += 1
    id = params.id
    return HttpResponse.json({
      id: Number(id),
      username: `user${id}`,
      email: `user${id}@mail.com`,
      image: null
    })
  })
)

beforeAll(() => server.listen())

beforeEach(() => {
  counter = 0
  id = undefined
  server.resetHandlers()
})

afterAll(() => server.close())

const confirmSpy = vi.spyOn(window, 'confirm')

const setup = async (path) => {
  router.push(path)
  await router.isReady()
  return render(User)
}

describe('User Page', () => {
  it('sends user fetch request to server', async () => {
    await setup('/')
    await waitFor(() => {
      expect(counter).toBe(1)
    })
  })

  describe.each([{ userId: '123' }, { userId: '345' }])('when user id is $userId', ({ userId }) => {
    it('sends id in request', async () => {
      await setup(`/user/${userId}`)
      await waitFor(() => {
        expect(id).toBe(userId)
      })
    })
  })

  describe('when id is changed', () => {
    it('sends request with new id', async () => {
      await setup('/user/123')
      await waitFor(() => {
        expect(id).toBe('123')
      })
      router.push('/user/345')
      await waitFor(() => {
        expect(id).toBe('345')
      })
    })
  })

  describe('when network error occurs', () => {
    it('displays generic error message', async () => {
      server.use(
        http.get('/api/v1/users/:id', () => {
          return HttpResponse.error()
        })
      )
      await setup('/user/1')
      const text = await screen.findByText('Unexpected error occurred, please try again')
      expect(text).toBeInTheDocument()
    })
  })

  describe('when user not found', () => {
    it('displays error message received in response', async () => {
      let resolveFunc
      const promise = new Promise((resolve) => {
        resolveFunc = resolve
      })
      server.use(
        http.get('/api/v1/users/:id', async () => {
          await promise
          return HttpResponse.json({ message: 'User not found' }, { status: 404 })
        })
      )
      await setup('/user/1')
      expect(screen.queryByText('User not found')).not.toBeInTheDocument()
      await resolveFunc()
      await waitFor(() => {
        expect(screen.queryByText('User not found')).toBeInTheDocument()
      })
    })
  })

  describe('when user is found', () => {
    it('displays user name', async () => {
      let resolveFunc
      const promise = new Promise((resolve) => {
        resolveFunc = resolve
      })
      server.use(
        http.get('/api/v1/users/:id', async () => {
          await promise
          return HttpResponse.json({
            id: 1,
            username: 'user1',
            email: 'user1@mail.com',
            image: null
          })
        })
      )
      await setup('/user/1')
      expect(screen.queryByText('user1')).not.toBeInTheDocument()
      await resolveFunc()
      await waitFor(() => {
        expect(screen.queryByText('user1')).toBeInTheDocument()
      })
    })
  })

  it('displays spinner', async () => {
    let resolveFunc
    const promise = new Promise((resolve) => {
      resolveFunc = resolve
    })
    server.use(
      http.get('/api/v1/users/:id', async () => {
        await promise
        return HttpResponse.json({ id: 1, username: 'user1', email: 'user1@mail.com', image: null })
      })
    )
    await setup('/user/1')
    const spinner = await screen.findByRole('status')
    expect(spinner).toBeInTheDocument()
    await resolveFunc()
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe.each([{ language: 'tr' }, { language: 'en' }])(
    'when language is $language',
    ({ language }) => {
      it('should send expected language in accept language header', async () => {
        let acceptLanguage
        server.use(
          http.get('/api/v1/users/:id', async ({ request }) => {
            acceptLanguage = request.headers.get('Accept-Language')
            return HttpResponse.error()
          })
        )
        i18n.global.locale = language
        await setup('/user/1')
        await waitFor(() => {
          expect(acceptLanguage).toBe(language)
        })
      })
    }
  )

  describe('when there is logged in user', () => {
    const setupPageLoaded = async (id = '3') => {
      const result = await setup(`/user/${id}`)
      await screen.findByText(`user${id}`)
      const deleteButton = screen.queryByRole('button', { name: 'Delete' })
      const editButton = screen.queryByRole('button', { name: 'Edit' })
      return { ...result, elements: { deleteButton, editButton } }
    }

    beforeEach(() => {
      localStorage.setItem('auth', JSON.stringify({ id: 3, username: 'user3' }))
    })
    describe('when user id matches to logged in user id', () => {
      it('displays delete button', async () => {
        const {
          elements: { deleteButton }
        } = await setupPageLoaded()
        expect(deleteButton).toBeInTheDocument()
      })

      it('displays edit button', async () => {
        const {
          elements: { editButton }
        } = await setupPageLoaded()
        expect(editButton).toBeInTheDocument()
      })

      describe('when user clicks edit button', () => {
        it('displays username input', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(screen.getByLabelText('Username')).toBeInTheDocument()
        })
        it('hides edit button', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(editButton).not.toBeInTheDocument()
        })

        it('hides delete button', async () => {
          const {
            user,
            elements: { editButton, deleteButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(deleteButton).not.toBeInTheDocument()
        })

        it('hides username', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(screen.queryByText('user3')).not.toBeInTheDocument()
        })

        it('sets username as initial value for input', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(screen.getByLabelText('Username')).toHaveValue('user3')
        })

        it('displays save button', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(screen.queryByRole('button', { name: 'Save' })).toBeInTheDocument()
        })

        it('displays cancel button', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          expect(screen.queryByRole('button', { name: 'Cancel' })).toBeInTheDocument()
        })

        it('displays file upload input', async () => {
          const {
            user,
            elements: { editButton }
          } = await setupPageLoaded()
          await user.click(editButton)
          const fileUploadInput = screen.getByLabelText('Select Image')
          expect(fileUploadInput).toHaveAttribute('type', 'file')
        })

        describe('when user selects photo', () => {
          it('displays in existing profile image', async () => {
            const {
              user,
              elements: { editButton }
            } = await setupPageLoaded()
            await user.click(editButton)
            const fileUploadInput = screen.getByLabelText('Select Image')
            await user.upload(
              fileUploadInput,
              new File(['hello'], 'hello.png', { type: 'image/png' })
            )
            const image = screen.getByAltText('user3 profile')
            await waitFor(() => {
              expect(image).toHaveAttribute('src', 'data:image/png;base64,aGVsbG8=')
            })
          })

          describe('when user clicks cancel', () => {
            it('displays default image', async () => {
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              const fileUploadInput = screen.getByLabelText('Select Image')
              await user.upload(
                fileUploadInput,
                new File(['hello'], 'hello.png', { type: 'image/png' })
              )
              await user.click(screen.queryByRole('button', { name: 'Cancel' }))
              const image = screen.getByAltText('user3 profile')
              await waitFor(() => {
                expect(image).toHaveAttribute('src', '/assets/profile.png')
              })
            })
          })
        })

        describe('when username is changed', () => {
          describe('when user clicks cancel', () => {
            it('displays initial username', async () => {
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.type(screen.getByLabelText('Username'), '-updated')
              await user.click(screen.queryByRole('button', { name: 'Cancel' }))
              await waitFor(() => {
                expect(screen.queryByText('user3')).toBeInTheDocument()
              })
            })
          })
        })

        describe('when user clicks cancel', () => {
          it('displays username', async () => {
            const {
              user,
              elements: { editButton }
            } = await setupPageLoaded()
            await user.click(editButton)
            await user.click(screen.queryByRole('button', { name: 'Cancel' }))
            await waitFor(() => {
              expect(screen.queryByText('user3')).toBeInTheDocument()
            })
          })
        })

        describe('when user clicks save', () => {
          it('sends update request for logged in user', async () => {
            let id
            server.use(
              http.put('/api/v1/users/:id', async ({ params }) => {
                id = params.id
                return HttpResponse.json({})
              })
            )
            const {
              user,
              elements: { editButton }
            } = await setupPageLoaded()
            await user.click(editButton)
            await user.click(screen.getByRole('button', { name: 'Save' }))
            await waitFor(() => {
              expect(id).toBe('3')
            })
          })

          it('sends request with updated username', async () => {
            let requestBody
            server.use(
              http.put('/api/v1/users/:id', async ({ request, params }) => {
                requestBody = await request.json()
                return HttpResponse.json({})
              })
            )
            const {
              user,
              elements: { editButton }
            } = await setupPageLoaded()
            await user.click(editButton)
            await user.type(screen.getByLabelText('Username'), '-updated')
            await user.click(screen.getByRole('button', { name: 'Save' }))
            await waitFor(() => {
              expect(requestBody).toStrictEqual({ username: 'user3-updated' })
            })
          })
          describe('when api request in progress', () => {
            it('displays spinner', async () => {
              server.use(
                http.put('/api/v1/users/:id', async () => {
                  await delay('infinite')
                  return HttpResponse.json({})
                })
              )
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.click(screen.getByRole('button', { name: 'Save' }))
              await waitFor(() => {
                expect(screen.queryByRole('status')).toBeInTheDocument()
              })
            })
          })
          describe('when result is success', () => {
            it('displays non edit mode', async () => {
              server.use(
                http.put('/api/v1/users/:id', async () => {
                  return HttpResponse.json({})
                })
              )
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.click(screen.getByRole('button', { name: 'Save' }))
              await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
              })
            })

            it('displays updated name', async () => {
              server.use(
                http.put('/api/v1/users/:id', async () => {
                  return HttpResponse.json({ username: 'user3-updated' })
                })
              )
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.type(screen.getByLabelText('Username'), '-updated')
              await user.click(screen.getByRole('button', { name: 'Save' }))
              await waitFor(() => {
                expect(screen.getByText('user3-updated')).toBeInTheDocument()
              })
            })
          })

          describe('when network failure occurs', () => {
            it('displays message generic error message', async () => {
              server.use(
                http.put('/api/v1/users/:id', () => {
                  return HttpResponse.error()
                })
              )
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.click(screen.getByRole('button', { name: 'Save' }))
              const text = await screen.findByText('Unexpected error occurred, please try again')
              expect(text).toBeInTheDocument()
            })

            it('hides spinner', async () => {
              server.use(
                http.put('/api/v1/users/:id', () => {
                  return HttpResponse.error()
                })
              )
              const {
                user,
                elements: { editButton }
              } = await setupPageLoaded()
              await user.click(editButton)
              await user.click(screen.getByRole('button', { name: 'Save' }))
              await waitFor(() => {
                expect(screen.queryByRole('status')).not.toBeInTheDocument()
              })
            })

            describe('when user submits again', () => {
              it('hides error when api request in progress', async () => {
                let processedFirstRequest = false
                server.use(
                  http.put('/api/v1/users/:id', async () => {
                    if (!processedFirstRequest) {
                      processedFirstRequest = true
                      return HttpResponse.error()
                    } else {
                      await delay('infinite')
                      return HttpResponse.json({})
                    }
                  })
                )
                const {
                  user,
                  elements: { editButton }
                } = await setupPageLoaded()
                await user.click(editButton)
                await user.click(screen.getByRole('button', { name: 'Save' }))
                await screen.findByText('Unexpected error occurred, please try again')
                await user.click(screen.getByRole('button', { name: 'Save' }))
                await waitFor(() => {
                  expect(
                    screen.queryByText('Unexpected error occurred, please try again')
                  ).not.toBeInTheDocument()
                })
              })
            })

            describe('when username is invalid', () => {
              it('displays validation error', async () => {
                server.use(
                  http.put('/api/v1/users/:id', () => {
                    return HttpResponse.json(
                      {
                        validationErrors: {
                          username: 'Username cannot be null'
                        }
                      },
                      { status: 400 }
                    )
                  })
                )
                const {
                  user,
                  elements: { editButton }
                } = await setupPageLoaded()
                await user.click(editButton)
                await user.click(screen.getByRole('button', { name: 'Save' }))
                const validationError = await screen.findByText('Username cannot be null')
                expect(validationError).toBeInTheDocument()
              })
              it('clears validation error after username field is updated', async () => {
                server.use(
                  http.put('/api/v1/users/:id', () => {
                    return HttpResponse.json(
                      {
                        validationErrors: {
                          username: 'Username cannot be null'
                        }
                      },
                      { status: 400 }
                    )
                  })
                )
                const {
                  user,
                  elements: { editButton }
                } = await setupPageLoaded()
                await user.click(editButton)
                await user.click(screen.getByRole('button', { name: 'Save' }))
                const validationError = await screen.findByText('Username cannot be null')
                await user.type(screen.getByLabelText('Username'), '-updated')
                expect(validationError).not.toBeInTheDocument()
              })
            })
          })
        })
      })

      describe('when user clicks delete button', () => {
        beforeEach(() => {
          confirmSpy.mockReturnValue(false)
        })
        it('displays confirm dialog', async () => {
          const {
            user,
            elements: { deleteButton }
          } = await setupPageLoaded()
          await user.click(deleteButton)
          expect(confirmSpy).toHaveBeenCalledWith('Are you sure?')
        })
        describe('when user confirms', () => {
          beforeEach(() => {
            confirmSpy.mockReturnValueOnce(true)
          })
          it('sends delete request to backend', async () => {
            let id
            server.use(
              http.delete('/api/v1/users/:id', async ({ params }) => {
                id = params.id
                return HttpResponse.json({})
              })
            )
            const {
              user,
              elements: { deleteButton }
            } = await setupPageLoaded()
            await user.click(deleteButton)
            await waitFor(() => {
              expect(id).toBe('3')
            })
          })

          describe('when api request in progress', () => {
            it('displays spinner', async () => {
              server.use(
                http.delete('/api/v1/users/:id', async () => {
                  await delay('infinite')
                  return HttpResponse.json({})
                })
              )
              const {
                user,
                elements: { deleteButton }
              } = await setupPageLoaded()
              expect(screen.queryByRole('status')).not.toBeInTheDocument()
              await user.click(deleteButton)
              await waitFor(() => {
                expect(screen.queryByRole('status')).toBeInTheDocument()
              })
            })
          })
          describe('when result is success', () => {
            it('navigates to home', async () => {
              server.use(
                http.delete('/api/v1/users/:id', async () => {
                  return HttpResponse.json({})
                })
              )
              const {
                user,
                elements: { deleteButton }
              } = await setupPageLoaded()
              await user.click(deleteButton)
              await waitFor(() => {
                expect(router.currentRoute.value.path).toBe('/')
              })
            })

            it('should log user out', async () => {
              server.use(
                http.delete('/api/v1/users/:id', async () => {
                  return HttpResponse.json({})
                })
              )
              const {
                user,
                elements: { deleteButton }
              } = await setupPageLoaded()
              await user.click(deleteButton)
              await waitFor(() => {
                expect(JSON.parse(localStorage.getItem('auth')).id).toBe(0)
              })
            })
          })

          describe('when result is error', () => {
            it('displays generic error message', async () => {
              server.use(
                http.delete('/api/v1/users/:id', async () => {
                  return HttpResponse.error()
                })
              )
              const {
                user,
                elements: { deleteButton }
              } = await setupPageLoaded()
              await user.click(deleteButton)
              await waitFor(() => {
                expect(
                  screen.queryByText('Unexpected error occurred, please try again')
                ).toBeInTheDocument()
              })
            })

            it('hides spinner', async () => {
              server.use(
                http.delete('/api/v1/users/:id', async () => {
                  return HttpResponse.error()
                })
              )
              const {
                user,
                elements: { deleteButton }
              } = await setupPageLoaded()
              await user.click(deleteButton)
              await screen.findByText('Unexpected error occurred, please try again')
              expect(screen.queryByRole('status')).not.toBeInTheDocument()
            })
            describe('when user clicks again', () => {
              it('hides error message', async () => {
                let processedFirstRequest = false
                server.use(
                  http.delete('/api/v1/users/:id', async () => {
                    if (!processedFirstRequest) {
                      return HttpResponse.error()
                    } else {
                      await delay('infinite')
                      return HttpResponse.json({})
                    }
                  })
                )
                const {
                  user,
                  elements: { deleteButton }
                } = await setupPageLoaded()
                await user.click(deleteButton)
                const error = await screen.findByText('Unexpected error occurred, please try again')
                await user.click(deleteButton)
                expect(error).not.toBeInTheDocument()
              })
            })
          })
        })

        describe('when user cancels', () => {
          it('stays on profile page', async () => {
            server.use(
              http.delete('/api/v1/users/:id', async () => {
                return HttpResponse.json({})
              })
            )
            const {
              user,
              elements: { deleteButton }
            } = await setupPageLoaded()
            await user.click(deleteButton)
            await waitFor(() => {
              expect(router.currentRoute.value.path).toBe('/user/3')
            })
          })
        })
      })
    })

    describe('when user id do not match to logged in user id', () => {
      it('does not display delete button', async () => {
        const {
          elements: { deleteButton }
        } = await setupPageLoaded('1')
        expect(deleteButton).not.toBeInTheDocument()
      })

      it('does not display edit button', async () => {
        const {
          elements: { editButton }
        } = await setupPageLoaded('1')
        expect(editButton).not.toBeInTheDocument()
      })
    })
  })
})
