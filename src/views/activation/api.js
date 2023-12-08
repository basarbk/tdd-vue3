import axios from 'axios'
import { i18n } from '@/locales'

export const activate = (token) => {
  return axios.patch(
    `/api/v1/users/${token}/active`,
    {},
    {
      headers: {
        'Accept-Language': i18n.global.locale
      }
    }
  )
}
