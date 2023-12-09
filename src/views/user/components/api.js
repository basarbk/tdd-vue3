import http from '@/lib/http'

export const deleteUser = (id) => {
  return http.delete(`/api/v1/users/${id}`)
}

export const updateUser = (id, body) => {
  return http.put(`/api/v1/users/${id}`, body)
}
