<template>
  <div class="body" :style="bodyBlockStyle">
    <p>{{props.text}}</p>
    <p>Family: {{ props.style.fontFamily }}</p>
    <p>Size: {{ props.style.fontSize }}</p>
    <ColorPreview :color="props.style.textColor" label="Text color" />
    <p>Weight: {{ props.style.fontWeight }}</p>
  </div>
</template>
<script setup lang="ts">
import ColorPreview from './ColorPreview.vue'
import { computed } from 'vue'

const props = defineProps(['style', 'text'])
const bodyBlockStyle = computed(() => ({
  color: props.style?.textColor,
  fontFamily: props.style?.fontFamily,
  fontSize: props.style?.fontSize,
  fontWeight: props.style?.fontWeight
}))
</script>
<style lang="scss">
.body {
  cursor: pointer;
}
</style>
