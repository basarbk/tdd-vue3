<template>
  <li class="list-group-item list-group-item-action" @click="router.push('/user/' + user.id)">
    <ProfileImage
      alt="Profile"
      width="30"
      height="30"
      class="rounded-circle shadow-sm"
      :image="user.image"
    />
    {{ user.username }}
  </li>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ProfileImage } from '@/components'

defineProps({
  user: Object
})
const router = useRouter()
</script>
<style scoped>
li {
  cursor: pointer;
}
</style>
