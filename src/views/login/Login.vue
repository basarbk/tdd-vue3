<template>
  <div class="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2" data-testid="login-page">
    <form @submit.prevent="submit">
      <Card>
        <template v-slot:header>
          <h1>{{ $t('login') }}</h1>
        </template>
        <template v-slot:body>
          <AppInput
            id="e-mail"
            :label="$t('email')"
            :help="errors.email"
            v-model="formState.email"
          />
          <AppInput
            id="password"
            :label="$t('password')"
            :help="errors.password"
            v-model="formState.password"
            type="password"
          />
          <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
          <div class="text-center">
            <AppButton :is-disabled="isDisabled" :apiProgress="apiProgress">
              {{ $t('login') }}
            </AppButton>
          </div>
        </template>
        <template v-slot:footer>
          <router-link to="/password-reset/request">{{ $t('passwordReset.forgot') }}</router-link>
        </template>
      </Card>
    </form>
  </div>
</template>
<script setup>
import { AppInput, Alert, Card, AppButton } from '@/components'
import { ref, computed, reactive, watch } from 'vue'
import { login } from './api'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const { t } = useI18n()
const { setLoggedIn } = useAuthStore()

const router = useRouter()

const formState = reactive({ email: '', password: '' })
const apiProgress = ref(false)
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  try {
    const response = await login(formState)
    setLoggedIn(response.data)
    router.push('/')
  } catch (apiError) {
    if (apiError.response?.status === 400) {
      errors.value = apiError.response.data.validationErrors
    } else if (apiError.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
}

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

const isDisabled = computed(() => {
  return !(formState.password && formState.email)
})
</script>
