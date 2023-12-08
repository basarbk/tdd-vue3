import http from '@/lib/http'

export const loadUsers = (page = 0) => {
  return http.get('/api/v1/users', { params: { page, size: 3 } })
}
