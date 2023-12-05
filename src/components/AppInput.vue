<template>
  <div class="mb-3">
    <label class="form-label" :for="id">{{ label }}</label>
    <input class="form-control" :id="id" @input="$emit('update:modelValue', $event.target.value)" />
    <span>{{ help }}</span>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  id: String,
  help: String,
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>
<!-- <script>
export default {
  props: {
    label: String,
    id: String,
    help: String,
    modelValue: String
  },
  emits: ['update:modelValue']
}
</script> -->
