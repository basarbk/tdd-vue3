<template>
  <div data-testid="user-page">
    <Alert variant="danger" v-if="status === 'fail'">{{ error }}</Alert>
    <Alert variant="secondary" center v-if="status === 'loading'">
      <Spinner size="normal" />
    </Alert>
    <ProfileCard v-if="status === 'success'" :user="data" />
  </div>
</template>
<script setup>
import ProfileCard from './components/ProfileCard.vue'
import { getUserById } from './api'
import { Alert, Spinner } from '@/components'

import useRouteParamApiRequest from '@/shared/useRouteParamApiRequest'

const { status, data, error } = useRouteParamApiRequest(getUserById, 'id')
</script>
