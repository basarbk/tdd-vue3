import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const auth = reactive({
    id: 0
  })

  function setLoggedIn(data) {
    auth.id = data.id
    auth.username = data.username
    auth.email = data.email
  }

  return { auth, setLoggedIn }
})
