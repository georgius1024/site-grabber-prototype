<template>
  <ul class="social-links" :style="socialLinksStyle">
    <li v-for="link in socialLinks" :key="link.url">
      <a :href="link.url">
        <img :src="imageSrc(link.provider)" height="32" />
      </a>
    </li>
  </ul>
</template>
<script setup lang="ts">
import ColorIcons from './color-icons.js'
import GrayIcons from './gray-icons.js'
import WhiteIcons from './white-icons.js'
import { computed } from 'vue'

const props = defineProps(['links', 'style'])
const socialLinks = computed(() => props.links || [])
const socialLinksStyle = computed(() => ({
  backgroundColor: props.style?.backgroundColor
}))

const imageSrc = (provider): any => {
  if (props.style?.scheme === 'gray') {
    return GrayIcons[provider]
  }
  if (props.style?.scheme === 'white') {
    return WhiteIcons[provider]
  }
  return ColorIcons[provider]
}
</script>
<style lang="scss">
ul.social-links {
  display: flex;
  flex-direction: row;
  justify-content: center;
  li {
    margin: 12px;
    cursor: pointer;
    a {
      pointer-events: none;
    }
  }
}
</style>
