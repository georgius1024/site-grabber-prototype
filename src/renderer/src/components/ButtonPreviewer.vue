<template>
  <div class="button" :style="buttonStyle">{{ props.text || 'See more' }}</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['text', 'style'])
const buttonStyle = computed(() => ({
  backgroundColor: props.style?.backgroundColor,
  color: props.style?.textColor,
  fontFamily: props.style?.fontFamily,
  fontSize: props.style?.fontSize,
  fontWeight: props.style?.fontWeight,
  borderRadius: props.style?.borderRadius,
  borderWidth: props.style?.borderWidth,
  borderColor: props.style?.borderColor
}))
</script>
<style lang="scss">
.button {
  border-style: solid;
  padding: 12px;
  cursor: pointer;
  margin: 0 32px;
}
</style>
