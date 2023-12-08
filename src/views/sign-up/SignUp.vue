<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
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
        <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
        <div class="text-center">
          <AppButton :is-disabled="isDisabled" :api-progress="apiProgress">
            {{ $t('signUp') }}
          </AppButton>
        </div>
      </div>
    </form>
    <Alert v-else>{{ successMessage }}</Alert>
  </div>
</template>
<script setup>
import { reactive, computed, ref, watch } from 'vue'
import { Alert, AppInput, AppButton } from '@/components'
import { useI18n } from 'vue-i18n'
import { signUp } from './api'
const { t } = useI18n()
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
    const response = await signUp(body)
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
import { Alert, AppInput, AppButton } from '@/components'
import { signUp } from './api'

export default {
  components: {
    AppInput,
    Alert,
    AppButton
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
        const response = await signUp(body)
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
