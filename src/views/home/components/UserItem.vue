<template>
  <li class="list-group-item list-group-item-action">
    <img src="@/assets/profile.png" alt="Profile" width="30" class="rounded-circle shadow-sm" />
    {{ user.username }}
  </li>
</template>
<script setup>
defineProps({
  user: Object
})
</script>
