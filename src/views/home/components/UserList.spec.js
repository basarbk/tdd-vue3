import { render, screen, waitFor } from 'test/helper'
import UserList from './UserList.vue'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@mail.com'
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@mail.com'
  },
  {
    id: 3,
    username: 'user3',
    email: 'user3@mail.com'
  },
  {
    id: 4,
    username: 'user4',
    email: 'user4@mail.com'
  },
  {
    id: 5,
    username: 'user5',
    email: 'user5@mail.com'
  },
  {
    id: 6,
    username: 'user6',
    email: 'user6@mail.com'
  },
  {
    id: 7,
    username: 'user7',
    email: 'user7@mail.com'
  }
]

const getPage = (page, size) => {
  const start = page * size
  const end = start + size
  const totalPages = Math.ceil(users.length / size)
  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages
  }
}
const server = setupServer(
  http.get('/api/v1/users', ({ request }) => {
    const url = new URL(request.url)
    let size = Number.parseInt(url.searchParams.get('size'))
    let page = Number.parseInt(url.searchParams.get('page'))
    if (Number.isNaN(size)) {
      size = 5
    }
    if (Number.isNaN(page)) {
      page = 0
    }
    return HttpResponse.json(getPage(page, size))
  })
)

beforeEach(() => {
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

describe('UserList', () => {
  it('displays three user in list', async () => {
    render(UserList)
    await waitFor(() => {
      expect(screen.queryAllByText(/user/).length).toBe(3)
    })
  })

  it('displays next page button', async () => {
    render(UserList)
    await screen.findByText('user1')
    expect(screen.queryByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('does not display previous page button', async () => {
    render(UserList)
    await screen.findByText('user1')
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
  })

  describe('when user clicks next', () => {
    it('displays next page', async () => {
      const { user } = render(UserList)
      await screen.findByText('user1')
      await user.click(screen.queryByRole('button', { name: 'Next' }))
      const firstUserOnPage2 = await screen.findByText('user4')
      expect(firstUserOnPage2).toBeInTheDocument()
    })

    it('displays previous page button', async () => {
      const { user } = render(UserList)
      await screen.findByText('user1')
      await user.click(screen.queryByRole('button', { name: 'Next' }))
      await screen.findByText('user4')
      expect(screen.queryByRole('button', { name: 'Previous' })).toBeInTheDocument()
    })

    describe('when user clicks previous', () => {
      it('displays previous page', async () => {
        const { user } = render(UserList)
        await screen.findByText('user1')
        await user.click(screen.queryByRole('button', { name: 'Next' }))
        await screen.findByText('user4')
        await user.click(screen.queryByRole('button', { name: 'Previous' }))
        const firstUserOnPage1 = await screen.findByText('user1')
        expect(firstUserOnPage1).toBeInTheDocument()
      })
    })

    describe('when last page is loaded', () => {
      it('does not display next page button', async () => {
        const { user } = render(UserList)
        await screen.findByText('user1')
        await user.click(screen.queryByRole('button', { name: 'Next' }))
        await screen.findByText('user4')
        await user.click(screen.queryByRole('button', { name: 'Next' }))
        await screen.findByText('user7')
        expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
      })
    })
  })
})
