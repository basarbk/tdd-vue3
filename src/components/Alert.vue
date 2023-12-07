<template>
  <div :class="`alert alert-${variant} ${center ? 'text-center' : ''}`">
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'success'
  },
  center: {
    type: Boolean,
    default: false
  }
})
</script>
