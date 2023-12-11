<template>
  <nav class="navbar navbar-expand bg-body-tertiary shadow-sm">
    <div class="container">
      <router-link class="navbar-brand" data-testid="link-home-page" to="/">
        <img src="@/assets/hoaxify.png" alt="Hoaxify logo" width="60" />
        Hoaxify
      </router-link>
      <ul class="navbar-nav">
        <template v-if="!auth.id">
          <li class="nav-item">
            <router-link class="nav-link" to="/login" data-testid="link-login-page">{{
              $t('login')
            }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" data-testid="link-signup-page" to="/signup">{{
              $t('signUp')
            }}</router-link>
          </li>
        </template>
        <template v-if="auth.id">
          <li class="nav-item">
            <router-link class="nav-link" :to="'/user/' + auth.id" data-testid="link-my-profile">
              <ProfileImage
                :alt="auth.username + ' profile'"
                width="30"
                height="30"
                class="rounded-circle shadow-sm"
                :image="auth.image"
              />
              {{ auth.username }}
            </router-link>
          </li>
          <li class="nav-item">
            <span class="nav-link" data-testid="link-logout" role="button" @click="logout">
              {{ $t('logout') }}
            </span>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import http from '@/lib/http'
import { ProfileImage } from './index'
import { useAuthStore } from '@/stores/auth'
const { auth, logout: logoutStore } = useAuthStore()

const logout = async () => {
  logoutStore()
  try {
    await http.post('/api/v1/logout')
  } catch {}
}
</script>
<!-- <script>
import http from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import ProfileImage from './ProfileImage.vue'
export default {
  components: {
    ProfileImage
  },
  setup() {
    const { auth, logout } = useAuthStore()
    return { auth, logoutStore: logout }
  },
  methods: {
    async logout() {
      this.logoutStore()
      try {
        await http.post('/api/v1/logout')
      } catch {}
    }
  }
}
</script> -->
