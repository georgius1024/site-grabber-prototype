<template>
  <div class="button-block" :style="buttonBlockStyle">
    <div class="button" :style="buttonStyle">{{ buttonText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['design'])

const buttonStyle = computed(() => ({
  backgroundColor: props.design?.buttonStyle?.backgroundColor,
  color: props.design?.buttonStyle?.textColor,
  fontFamily: props.design?.buttonStyle?.fontFamily,
  fontSize: props.design?.buttonStyle?.fontSize,
  fontWeight: props.design?.buttonStyle?.fontWeight,
  borderRadius: props.design?.buttonStyle?.borderRadius,
  borderWidth: props.design?.buttonStyle?.borderWidth,
  borderColor: props.design?.buttonStyle?.borderColor
}))

const buttonText = computed(() => props.design?.buttonStyle?.text)

const buttonBlockStyle = computed(() => ({
  backgroundColor: props.design?.bodyStyle?.backgroundColor
}))
</script>

<style lang="scss" scoped>
.button-block {
  padding: 12px;
  display: flex;
  justify-content: center;
}
.button {
  text-align: center;
  min-width: 200px;
  padding: 12px;
  border-style: solid;
}
</style>
