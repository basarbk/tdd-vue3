<template>
  <img alt="image" :src="path" />
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  image: String,
  tempImage: String
})

const path = computed(() => {
  if (props.tempImage) {
    return props.tempImage
  }
  if (props.image) {
    return `/images/${props.image}`
  }
  return '/assets/profile.png'
})
</script>
