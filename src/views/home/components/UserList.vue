<template>
  <div class="card">
    <div class="card-header text-center">
      <h3>{{ $t('userList.header') }}</h3>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action" v-for="user in pageData.content">
        {{ user.username }}
      </li>
    </ul>
    <div class="card-footer">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="loadData(pageData.page - 1)"
        v-if="pageData.page !== 0"
      >
        {{ $t('userList.previous') }}
      </button>
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="loadData(pageData.page + 1)"
        v-if="pageData.page + 1 < pageData.totalPages"
      >
        {{ $t('userList.next') }}
      </button>
    </div>
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

onMounted(() => {
  loadData()
})

const loadData = async (pageIndex) => {
  const {
    data: { content, page, size, totalPages }
  } = await loadUsers(pageIndex)
  pageData.content = content
  pageData.page = page
  pageData.size = size
  pageData.totalPages = totalPages
}
</script>
