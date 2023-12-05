<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit" data-testid="form-sign-up" v-if="!successMessage">
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input class="form-control" id="username" v-model="formState.username" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="email">E-mail</label>
          <input class="form-control" id="email" v-model="formState.email" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input class="form-control" id="password" type="password" v-model="formState.password" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="passwordRepeat">Password Repeat</label>
          <input
            class="form-control"
            id="passwordRepeat"
            type="password"
            v-model="formState.passwordRepeat"
          />
        </div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span v-if="apiProgress" role="status" class="spinner-border spinner-border-sm"></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div v-else class="alert alert-success">{{ successMessage }}</div>
  </div>
</template>
<script setup>
import axios from 'axios'
import { reactive, computed, ref } from 'vue'
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: ''
})

const apiProgress = ref(false)
const successMessage = ref()

const submit = async () => {
  apiProgress.value = true
  const { passwordRepeat, ...body } = formState
  const response = await axios.post('/api/v1/users', body)
  successMessage.value = response.data.message
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
      },
      apiProgress: false,
      successMessage: undefined
    }
  },
  methods: {
    async submit() {
      this.apiProgress = true
      const { passwordRepeat, ...body } = this.formState
      const response = await axios.post('/api/v1/users', body)
      this.successMessage = response.data.message
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
