import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import SignUp from '@/views/sign-up/SignUp.vue'
import Activation from '@/views/activation/Activation.vue'

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
    },
    {
      path: '/activation/:token',
      component: Activation
    }
  ]
})

export default router
