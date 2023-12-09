<template>
  <AppInput id="username" :label="$t('username')" v-model="auth.username" />
  <AppButton>{{ $t('save') }}</AppButton>
  <div class="d-inline m-1"></div>
  <AppButton variant="outline-secondary" @click="$emit('cancel')">{{ $t('cancel') }}</AppButton>
</template>
<script setup>
import { AppButton, AppInput } from '@/components'
import { useAuthStore } from '@/stores/auth'

defineEmits(['cancel'])

const { auth } = useAuthStore()
</script>
