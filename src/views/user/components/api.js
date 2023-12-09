import http from '@/lib/http'

export const deleteUser = (id) => {
  return http.delete(`/api/v1/users/${id}`)
}
