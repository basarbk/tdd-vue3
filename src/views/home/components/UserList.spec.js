import { render, screen, waitFor } from 'test/helper'
import UserList from './UserList.vue'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

const page1 = {
  content: [
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
    }
  ],
  page: 0,
  size: 3,
  totalPages: 9
}

const server = setupServer(
  http.get('/api/v1/users', () => {
    return HttpResponse.json(page1)
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
