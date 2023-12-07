<template>
  <span
    class="spinner-border"
    :class="{ 'spinner-border-sm': size === 'small' }"
    role="status"
  ></span>
</template>
<!-- <script setup>
defineProps({
  size: {
    type: String,
    default: 'small'
  }
})
</script> -->
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>
