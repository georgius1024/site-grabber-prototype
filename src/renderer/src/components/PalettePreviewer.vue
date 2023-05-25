<template>
  <div class="body">
    <h2>{{props.text}}</h2>
    <div v-for="color in palette" :key="color">
      <ColorPreview :color="color" />
    </div>
  </div>
</template>
<script setup lang="ts">
import ColorPreview from './ColorPreviewer.vue'

const props = defineProps(['palette', 'text'])
</script>
<style lang="scss">
.body {
  margin: 12px 0;
  padding: 12px;
}
</style>
