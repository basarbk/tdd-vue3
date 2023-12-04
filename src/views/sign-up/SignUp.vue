<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input id="username" />
  </div>
  <div>
    <label for="email">E-mail</label>
    <input id="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input id="password" type="password" @input="onChangePassword" />
  </div>
  <div>
    <label for="passwordRepeat">Password Repeat</label>
    <input id="passwordRepeat" type="password" @input="onChangePasswordRepeat" />
  </div>
  <button :disabled="disabled">Sign Up</button>
</template>
<script setup>
import { ref } from 'vue'
const disabled = ref(true)
const password = ref('')
const passwordRepeat = ref('')

const onChangePassword = (event) => {
  password.value = event.target.value
  disabled.value = password.value !== passwordRepeat.value
}

const onChangePasswordRepeat = (event) => {
  passwordRepeat.value = event.target.value
  disabled.value = password.value !== passwordRepeat.value
}
</script>
<!-- <script>
export default {
  data() {
    return {
      disabled: true,
      password: '',
      passwordRepeat: ''
    }
  },
  methods: {
    onChangePassword(event) {
      this.password = event.target.value
      this.disabled = this.password !== this.passwordRepeat
    },
    onChangePasswordRepeat(event) {
      this.passwordRepeat = event.target.value
      this.disabled = this.password !== this.passwordRepeat
    }
  }
}
</script> -->
