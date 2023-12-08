import http from '@/lib/http'

export const passwordReset = (body) => {
  return http.post('/api/v1/users/password-reset', body)
}
