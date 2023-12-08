<template>
  <UserItem v-for="user in pageData.content" :user="user" :key="user.id" />
</template>
<script setup>
import { reactive } from 'vue'
import UserItem from '../UserItem.vue'

const pageData = reactive({
  content: [
    {
      id: 1,
      username: 'test user'
    }
  ],
  page: 0,
  size: 0,
  totalPages: 0
})
</script>
