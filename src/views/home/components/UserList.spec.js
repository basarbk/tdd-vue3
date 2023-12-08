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
})
