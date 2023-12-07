<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit" data-testid="form-sign-up" v-if="!successMessage">
      <div class="card-header text-center">
        <h1>{{ $t('signUp') }}</h1>
      </div>
      <div class="card-body">
        <AppInput
          id="username"
          :label="$t('username')"
          :help="errors.username"
          v-model="formState.username"
        />
        <AppInput id="email" :label="$t('email')" :help="errors.email" v-model="formState.email" />
        <AppInput
          id="password"
          :label="$t('password')"
          :help="errors.password"
          v-model="formState.password"
          type="password"
        />
        <AppInput
          id="passwordRepeat"
          :label="$t('passwordRepeat')"
          :help="passwordMismatchError"
          v-model="formState.passwordRepeat"
          type="password"
        />
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span v-if="apiProgress" role="status" class="spinner-border spinner-border-sm"></span>
            {{ $t('signUp') }}
          </button>
        </div>
      </div>
    </form>
    <div v-else class="alert alert-success">{{ successMessage }}</div>
  </div>
</template>
<script setup>
import axios from 'axios'
import { reactive, computed, ref, watch } from 'vue'
import { AppInput } from '@/components'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: ''
})

const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  const { passwordRepeat, ...body } = formState
  try {
    const response = await axios.post('/api/v1/users', body, {
      headers: {
        'Accept-Language': locale.value
      }
    })
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.status === 400) {
      errors.value = apiError.response.data.validationErrors
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
}

const isDisabled = computed(() => {
  return formState.password || formState.passwordRepeat
    ? formState.password !== formState.passwordRepeat
    : true
})
const passwordMismatchError = computed(() => {
  return formState.password !== formState.passwordRepeat ? t('passwordMismatch') : undefined
})

watch(
  () => formState.username,
  () => {
    delete errors.value.username
  }
)
watch(
  () => formState.email,
  () => {
    delete errors.value.email
  }
)

watch(
  () => formState.password,
  () => {
    delete errors.value.password
  }
)
</script>
<!-- <script>
import axios from 'axios'
import { AppInput } from '@/components'

export default {
  components: {
    AppInput
  },
  data() {
    return {
      formState: {
        username: '',
        email: '',
        password: '',
        passwordRepeat: ''
      },
      apiProgress: false,
      successMessage: undefined,
      errorMessage: undefined,
      errors: {}
    }
  },
  methods: {
    async submit() {
      this.apiProgress = true
      this.errorMessage = undefined
      const { passwordRepeat, ...body } = this.formState
      try {
        const response = await axios.post('/api/v1/users', body, {
          headers: {
            'Accept-Language': this.$i18n.locale
          }
        })
        this.successMessage = response.data.message
      } catch (apiError) {
        if (apiError.response?.status === 400) {
          this.errors = apiError.response.data.validationErrors
        } else {
          this.errorMessage = this.$t('genericError')
        }
      } finally {
        this.apiProgress = false
      }
    }
  },
  computed: {
    isDisabled() {
      return this.formState.password || this.formState.passwordRepeat
        ? this.formState.password !== this.formState.passwordRepeat
        : true
    },
    passwordMismatchError() {
      return this.formState.password !== this.formState.passwordRepeat
        ? this.$t('passwordMismatch')
        : undefined
    }
  },
  watch: {
    'formState.username'() {
      delete this.errors.username
    },
    'formState.email'() {
      delete this.errors.email
    },
    'formState.password'() {
      delete this.errors.password
    }
  }
}
</script> -->
