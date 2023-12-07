import { i18n } from '@/locales'
import axios from 'axios'

export const signUp = (body) => {
  return axios.post('/api/v1/users', body, {
    headers: {
      'Accept-Language': i18n.global.locale
    }
  })
}
