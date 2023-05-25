<template>
  <div class="text-block" :style="textBlockStyle">
    <div class="header" :style="headerStyle">{{ header() }}</div>
    <div class="paragraph" :style="paragraphStyle" v-html="paragraphs(1)" />
    <div class="paragraph" :style="paragraphStyle">
      <p>Please see <a href="#">link style here</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import header from '../utils/header.js'
import paragraphs from '../utils/paragraphs.js'

const props = defineProps(['design'])

const textBlockStyle = computed(() => ({
  backgroundColor: props.design?.bodyStyle?.backgroundColor,
  color: props.design?.bodyStyle?.textColor,
  fontFamily: props.design?.bodyStyle?.fontFamily,
  fontSize: props.design?.bodyStyle?.fontSize,
  fontWeight: props.design?.bodyStyle?.fontWeight
}))

const headerStyle = computed(() => ({
  color: props.design?.headingStyle?.textColor,
  fontFamily: props.design?.headingStyle?.fontFamily,
  fontSize: props.design?.headingStyle?.fontSize,
  fontWeight: props.design?.headingStyle?.fontWeight
}))

const paragraphStyle = computed(() => ({
  color: props.design?.textStyle?.textColor,
  fontFamily: props.design?.textStyle?.fontFamily,
  fontSize: props.design?.textStyle?.fontSize,
  fontWeight: props.design?.textStyle?.fontWeight
}))

const linkColor = computed(() => props.design?.linkStyle?.textColor)
</script>

<style lang="scss" scoped>
.text-block {
  padding: 12px;
  a {
    color: v-bind(linkColor);
  }
}
</style>
