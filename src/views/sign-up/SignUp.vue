<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input id="username" v-model="username" />
  </div>
  <div>
    <label for="email">E-mail</label>
    <input id="email" v-model="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input id="password" type="password" v-model="password" />
  </div>
  <div>
    <label for="passwordRepeat">Password Repeat</label>
    <input id="passwordRepeat" type="password" v-model="passwordRepeat" />
  </div>
  <button :disabled="isDisabled" @click="submit">Sign Up</button>
</template>
<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
const username = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')

const submit = () => {
  axios.post('/api/v1/users', {
    username: username.value,
    email: email.value,
    password: password.value
  })
}

const isDisabled = computed(() => {
  return password.value || passwordRepeat.value ? password.value !== passwordRepeat.value : true
})
</script>
<!-- <script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  },
  methods: {
    submit() {
      axios.post('/api/v1/users', {
        username: this.username,
        email: this.email,
        password: this.password
      })
    }
  },
  computed: {
    isDisabled() {
      return this.password || this.passwordRepeat ? this.password !== this.passwordRepeat : true
    }
  }
}
</script> -->
