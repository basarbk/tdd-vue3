<template>
  <div class="card">
    <div class="card-header text-center">
      <h3>User List</h3>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action" v-for="user in pageData.content">
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { loadUsers } from './api'
import { onMounted, reactive } from 'vue'

const pageData = reactive({
  content: [],
  page: 0,
  size: 0,
  totalPages: 0
})

onMounted(async () => {
  const {
    data: { content, page, size, totalPages }
  } = await loadUsers()
  pageData.content = content
  pageData.page = page
  pageData.size = size
  pageData.totalPages = totalPages
})
</script>
