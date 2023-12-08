<template>
  <div class="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2" data-testid="password-reset-request-page">
    <form class="card" @submit.prevent="submit">
      <div class="card-header text-center">
        <h1>{{ $t('passwordReset.request') }}</h1>
      </div>
      <div class="card-body">
        <AppInput id="e-mail" :label="$t('email')" :help="errors.email" v-model="email" />
        <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
        <Alert v-if="successMessage">{{ successMessage }}</Alert>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="!email || apiProgress">
            <Spinner v-if="apiProgress" />
            {{ $t('passwordReset.request') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { AppInput, Spinner, Alert } from '@/components'
import { ref, watch } from 'vue'
import { passwordReset } from './api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const email = ref('')
const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  try {
    const response = await passwordReset({ email: email.value })
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.data?.validationErrors) {
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
  () => email.value,
  () => {
    delete errors.value.email
  }
)
</script>
