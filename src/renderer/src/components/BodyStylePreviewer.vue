<template>
  <div class="body" :style="bodyBlockStyle">
    {{ props.style.fontFamily }}
    <ColorPreview :color="props.style.textColor" label="Text color" />
    <ColorPreview :color="props.style.backgroundColor" label="Background color" />
  </div>
</template>
<script setup lang="ts">
import ColorPreview from './ColorPreview.vue'
import { computed } from 'vue'

const props = defineProps(['style'])
const bodyBlockStyle = computed(() => ({
  backgroundColor: props.style?.backgroundColor,
  color: props.style?.textColor,
  fontFamily: props.style?.fontFamily,
  fontSize: props.style?.fontSize,
  fontWeight: props.style?.fontWeight
}))
</script>
<style lang="scss">
.body {
  padding: 12px;
  cursor: pointer;
  margin: 0 32px;
}
</style>
