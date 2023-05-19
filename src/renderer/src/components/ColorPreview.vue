<template>
  <div class="color-sample">
    <div class="color-swatch" :style="{ backgroundColor: color }" />
    <div class="color-label">{{ label }} {{ color }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps(['color', 'label'])
</script>
<style lang="scss" scoped>
.color-sample {
  margin: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .color-swatch {
    width: 32px;
    height: 32px;
    border: 1px dotted #333;
  }
  .color-label {
    margin-left: 8px;
  }
}
</style>
