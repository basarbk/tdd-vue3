import http from '@/lib/http'

export const loadUsers = () => {
  return http.get('/api/v1/users')
}
