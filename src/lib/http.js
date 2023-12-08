import { i18n } from '@/locales'
import axios from 'axios'

const http = axios.create()

http.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.global.locale
  return config
})

export default http
