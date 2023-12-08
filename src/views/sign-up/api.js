import http from '@/lib/http'

export const signUp = (body) => {
  return http.post('/api/v1/users', body)
}
