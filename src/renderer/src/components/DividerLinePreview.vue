<template>
  <div class="divider-line" :style="dividerLineStyle"/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['design'])

const dividerLineStyle = computed(() => ({
  backgroundColor: props.design?.dividerLine?.backgroundColor || props.design?.bodyStyle?.textColor
}))

</script>

<style lang="scss" scoped>
.divider-line {
  margin: 12px;
  min-height: 4px;
}
</style>
