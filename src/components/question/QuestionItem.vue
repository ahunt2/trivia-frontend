<script setup>
import { computed } from 'vue'

const props = defineProps(['text'])

const style = computed(() => {
  if (props.text.length < 80) return 'text-lg'
  return 'text-sm'
})
</script>

<template>
<div class="w-80 container py-2 mx-auto">
  <h2 :class="style">{{ props.text }}</h2>
</div>
</template>