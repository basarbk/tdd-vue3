vi.mock('@/lib/http')

import http from '@/lib/http'
import { signUp } from './api'

describe('signUp', () => {
  it('calls axios with expected params', () => {
    const body = { key: 'value' }
    signUp(body)
    expect(http.post).toHaveBeenCalledWith('/api/v1/users', body)
  })
})
