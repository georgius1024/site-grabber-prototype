<template>
  <ul class="header-links" :style="headerLinksStyle">
    <li v-for="link in props.links" :key="link.text">
      <a :href="link.href" :title="link.href"> {{ link.text }} </a>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['links', 'style'])
const headerLinksStyle = computed(() => ({
  backgroundColor: props.style?.backgroundColor,
  color: props.style?.textColor,
  fontFamily: props.style?.fontFamily,
  fontSize: props.style?.fontSize,
  fontWeight: props.style?.fontWeight
}))
const headerLinkColor = computed(() => props.style?.textColor)
</script>
<style lang="scss">
ul.header-links {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  li {
    margin: 12px;
    cursor: pointer;
    a {
      pointer-events: none;
      color: v-bind(headerLinkColor);
    }
  }
}
</style>
