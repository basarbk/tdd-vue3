<template>
  <Card>
    <template v-slot:header>
      <img
        class="rounded-circle shadow"
        width="200"
        height="200"
        :alt="user.username + ' profile'"
        src="@/assets/profile.png"
      />
    </template>
    <template v-slot:body>
      <div class="text-center">
        <h3>{{ user.username }}</h3>
        <UserDeleteButton :id="user.id" />
      </div>
    </template>
  </Card>
</template>
<script setup>
import { Card } from '@/components'
import UserDeleteButton from './UserDeleteButton.vue'

defineProps({
  user: Object
})
</script>
