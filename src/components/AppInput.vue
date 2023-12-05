<template>
  <div class="mb-3">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
      class="form-control"
      :class="{ 'is-invalid': help }"
      :id="id"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
    />
    <span v-if="help" class="invalid-feedback">{{ help }}</span>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  id: String,
  help: String,
  modelValue: String,
  type: String
})
defineEmits(['update:modelValue'])
</script>
<!-- <script>
export default {
  props: {
    label: String,
    id: String,
    help: String,
    modelValue: String,
    type: String
  },
  emits: ['update:modelValue']
}
</script> -->
