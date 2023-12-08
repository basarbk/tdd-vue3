import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  let initialState = {
    id: 0
  }

  const storedState = localStorage.getItem('auth')
  if (storedState !== null) {
    try {
      initialState = JSON.parse(storedState)
    } catch {}
  }

  const auth = reactive(initialState)

  function setLoggedIn(data) {
    auth.id = data.id
    auth.username = data.username
    auth.email = data.email
  }

  function logout() {
    auth.id = 0
    delete auth.username
    delete auth.email
  }

  watch(auth, () => {
    localStorage.setItem('auth', JSON.stringify(auth))
  })

  return { auth, setLoggedIn, logout }
})
