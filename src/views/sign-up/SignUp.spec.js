import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })

  it('has username input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('has email input', () => {
    render(SignUp)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('has password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('has password type for password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('has password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument()
  })

  it('has password type for password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toHaveAttribute('type', 'password')
  })

  it('has Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })

  it('disables the button initially', () => {
    render(SignUp)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled()
  })

  describe('when user sets same value for password inputs', () => {
    it('enables button', async () => {
      const user = userEvent.setup()
      render(SignUp)
      const passwordInput = screen.getByLabelText('Password')
      const passwordRepeatInput = screen.getByLabelText('Password Repeat')
      await user.type(passwordInput, 'P4ssword')
      await user.type(passwordRepeatInput, 'P4ssword')
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeEnabled()
    })

    describe('when user submits form', () => {
      it('sends username, email, password to the backend', async () => {
        let requestBody
        const server = setupServer(
          http.post('/api/v1/users', async ({ request }) => {
            requestBody = await request.json()
            return HttpResponse.json({})
          })
        )
        server.listen()
        const user = userEvent.setup()
        render(SignUp)
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('E-mail')
        const passwordInput = screen.getByLabelText('Password')
        const passwordRepeatInput = screen.getByLabelText('Password Repeat')
        await user.type(usernameInput, 'user1')
        await user.type(emailInput, 'user1@mail.com')
        await user.type(passwordInput, 'P4ssword')
        await user.type(passwordRepeatInput, 'P4ssword')
        const button = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(button)
        await waitFor(() => {
          expect(requestBody).toEqual({
            username: 'user1',
            email: 'user1@mail.com',
            password: 'P4ssword'
          })
        })
      })
    })
  })
})
