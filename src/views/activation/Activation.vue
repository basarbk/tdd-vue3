<template>
  <div data-testid="activation-page">
    <h1>Activation Page</h1>
  </div>
</template>
<script setup>
import axios from 'axios'
import { onMounted } from 'vue'

onMounted(() => {
  axios.patch('/api/v1/users/this-will-be-taken-from-url/active')
})
</script>
<!-- <script>
import axios from 'axios'
export default {
  mounted() {
    axios.patch('/api/v1/users/this-will-be-taken-from-url/active')
  }
}
</script> -->
