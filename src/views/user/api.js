import http from '@/lib/http'

export const getUserById = (id) => {
  return http.get(`/api/v1/users/${id}`)
}
