<template>
  <div v-if="title || description" class="text-block" :style="textBlockStyle">
    <div class="header" :style="headerStyle" v-html="title" />
    <div class="paragraph" :style="paragraphStyle" v-html="description" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const title = computed(() => props.design?.meta?.title || 'No title detected')
const description = computed(() => props.design?.meta?.description || 'No description detected')
</script>

<style lang="scss" scoped>
.text-block {
  padding: 12px;
}
</style>
