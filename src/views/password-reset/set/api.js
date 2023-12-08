import http from '@/lib/http'

export const passwordSet = (token, body) => {
  return http.patch(`/api/v1/users/${token}/password`, body)
}
