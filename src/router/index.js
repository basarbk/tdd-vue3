import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import SignUp from '@/views/sign-up/SignUp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/signup',
      component: SignUp
    }
  ]
})

export default router
