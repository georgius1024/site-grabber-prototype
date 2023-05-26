<template>
  <div class="body">
    <h2>Font scheme</h2>
    <TextStylePreviewer :style="props.design.headingStyle" text="Headings" />
    <TextStylePreviewer :style="props.design.textStyle" text="Plain text" />
    <TextStylePreviewer :style="props.design.buttonStyle" text="Buttons" />
  </div>
</template>
<script setup lang="ts">
import TextStylePreviewer from './TextStylePreviewer.vue'

const props = defineProps(['design'])
</script>
<style lang="scss">
.body {
  margin: 12px 0;
  padding: 12px;
}
</style>
