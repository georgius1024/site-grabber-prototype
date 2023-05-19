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
import Icons from './icons'
import { computed } from 'vue'

const props = defineProps(['links'])
const socialLinks = computed(() => props.links || [])
const socialLinksStyle = computed(() => ({
}))

const imageSrc = (provider): any => {
  return Icons[provider]
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
