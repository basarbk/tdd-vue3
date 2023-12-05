<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input id="username" v-model="formState.username" />
  </div>
  <div>
    <label for="email">E-mail</label>
    <input id="email" v-model="formState.email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input id="password" type="password" v-model="formState.password" />
  </div>
  <div>
    <label for="passwordRepeat">Password Repeat</label>
    <input id="passwordRepeat" type="password" v-model="formState.passwordRepeat" />
  </div>
  <button :disabled="isDisabled" @click="submit">Sign Up</button>
</template>
<script setup>
import axios from 'axios'
import { reactive, computed } from 'vue'
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: ''
})

const submit = () => {
  const { passwordRepeat, ...body } = formState
  axios.post('/api/v1/users', body)
}

const isDisabled = computed(() => {
  return formState.password || formState.passwordRepeat
    ? formState.password !== formState.passwordRepeat
    : true
})
</script>
<!-- <script>
import axios from 'axios'

export default {
  data() {
    return {
      formState: {
        username: '',
        email: '',
        password: '',
        passwordRepeat: ''
      }
    }
  },
  methods: {
    submit() {
      const { passwordRepeat, ...body } = this.formState
      axios.post('/api/v1/users', body)
    }
  },
  computed: {
    isDisabled() {
      return this.formState.password || this.formState.passwordRepeat
        ? this.formState.password !== this.formState.passwordRepeat
        : true
    }
  }
}
</script> -->
