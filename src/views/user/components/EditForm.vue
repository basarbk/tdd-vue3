<template>
  <form @submit.prevent="submit">
    <AppInput id="username" :label="$t('username')" v-model="username" />
    <AppButton type="submit" :api-progress="apiProgress">{{ $t('save') }}</AppButton>
    <div class="d-inline m-1"></div>
    <AppButton type="button" variant="outline-secondary" @click="$emit('cancel')">{{
      $t('cancel')
    }}</AppButton>
  </form>
</template>
<script setup>
import { AppButton, AppInput } from '@/components'
import { useAuthStore } from '@/stores/auth'
import { updateUser } from './api'
import { ref } from 'vue'

const emit = defineEmits(['cancel', 'save'])

const { auth, update } = useAuthStore()
const apiProgress = ref(false)
const username = ref(auth.username)

const submit = async () => {
  apiProgress.value = true
  await updateUser(auth.id, { username: username.value })
  update({ username: username.value })
  emit('save')
}
</script>
