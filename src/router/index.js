import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import SignUp from '@/views/sign-up/SignUp.vue'
import Activation from '@/views/activation/Activation.vue'
import PasswordResetRequest from '@/views/password-reset/request/Request.vue'
import PasswordResetSet from '@/views/password-reset/set/Set.vue'

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
    },
    {
      path: '/password-reset/request',
      component: PasswordResetRequest
    },
    {
      path: '/password-reset/set',
      component: PasswordResetSet
    }
  ]
})

export default router
