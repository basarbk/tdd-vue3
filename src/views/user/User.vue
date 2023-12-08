<template>
  <div data-testid="user-page">
    <Alert variant="danger" v-if="status === 'fail'">{{ errorMessage }}</Alert>
    <Alert variant="secondary" center v-if="status === 'loading'">
      <Spinner size="normal" />
    </Alert>
    <ProfileCard v-if="status === 'success'" :user="user" />
  </div>
</template>
<script setup>
import ProfileCard from './components/ProfileCard.vue'
import { useRoute } from 'vue-router'
import { getUserById } from './api'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { Alert, Spinner } from '@/components'
const { t } = useI18n()
const route = useRoute()

const errorMessage = ref('')
const status = ref()
const user = ref()

watchEffect(async () => {
  status.value = 'loading'
  try {
    const response = await getUserById(route.params.id)
    user.value = response.data
    status.value = 'success'
  } catch (apiError) {
    status.value = 'fail'
    if (apiError.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('genericError')
    }
  }
})
</script>
