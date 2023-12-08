<template>
  <Card>
    <template v-slot:header>
      <h3>{{ $t('userList.header') }}</h3>
    </template>
    <template v-slot:default>
      <ul class="list-group list-group-flush">
        <UserItem v-for="user in pageData.content" :user="user" :key="user.id" />
      </ul>
    </template>
    <template v-slot:footer>
      <Spinner v-if="apiProgress" size="normal" />
      <button
        class="btn btn-outline-secondary btn-sm float-start"
        @click="loadData(pageData.page - 1)"
        v-if="pageData.page !== 0"
      >
        {{ $t('userList.previous') }}
      </button>
      <button
        class="btn btn-outline-secondary btn-sm float-end"
        @click="loadData(pageData.page + 1)"
        v-if="pageData.page + 1 < pageData.totalPages"
      >
        {{ $t('userList.next') }}
      </button>
    </template>
  </Card>
</template>
<script setup>
import { loadUsers } from './api'
import { onMounted, reactive, ref } from 'vue'
import { Card, Spinner } from '@/components'
import UserItem from './UserItem.vue'

const pageData = reactive({
  content: [],
  page: 0,
  size: 0,
  totalPages: 0
})

const apiProgress = ref(true)

onMounted(() => {
  loadData()
})

const loadData = async (pageIndex) => {
  apiProgress.value = true
  const {
    data: { content, page, size, totalPages }
  } = await loadUsers(pageIndex)
  pageData.content = content
  pageData.page = page
  pageData.size = size
  pageData.totalPages = totalPages
  apiProgress.value = false
}
</script>
