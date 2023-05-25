<template>
  <div v-if="props.design" class="header-block" :style="headerBlockStyle">
    <div class="view-in-browser" :style="viewInBrowserStyle">View in browser</div>
    <div v-if="props.design?.logo" class="logo">
      <img :src="props.design.logo" height="64" align="center" />
    </div>
    <div v-else-if="props.design?.url" class="logo">{{ getHost(props.design?.url) }}</div>
    <HeaderLinksPreview
      v-if="props.design?.headerLinks"
      :links="props.design?.headerLinks?.links"
      :style="props.design?.headerLinks?.style"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import getHost from '../utils/getHost'
import HeaderLinksPreview from './HeaderLinksPreviewer.vue'

const props = defineProps(['design'])

const headerBlockStyle = computed(() => ({
  backgroundColor: props.design?.headerStyle?.backgroundColor,
  color: props.design?.headerStyle?.textColor
}))
const viewInBrowserStyle = computed(() => ({
  backgroundColor: props.design?.headerStyle?.backgroundColor,
  color: props.design?.headerStyle?.textColor,
  fontSize: props.design?.bodyStyle?.fontSize
}))
</script>
<style lang="scss" scoped>
.header-block {
  .logo {
    text-align: center;
    font-size: 32px;
    padding: 32px;
  }
  .view-in-browser {
    cursor: pointer;
    text-align: center;
    padding: 8px;
  }
}
</style>
