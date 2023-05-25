<template>
  <div class="product-block" :style="productBlockStyle">
    <div class="picture">
      <img src="https://picsum.photos/500/250" width="500"/>
    </div>
    <div class="header" :style="headerStyle">{{ header() }}</div>
    <div class="paragraph" :style="paragraphStyle" v-html="paragraphs(1)" />
    <div class="button" :style="buttonStyle">{{ buttonText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import header from '../utils/header.js'
import paragraphs from '../utils/paragraphs.js'

const props = defineProps(['design'])

const buttonStyle = computed(() => ({
  backgroundColor: props.design?.buttonStyle?.backgroundColor,
  color: props.design?.buttonStyle?.textColor,
  fontFamily: props.design?.buttonStyle?.fontFamily,
  fontSize: props.design?.buttonStyle?.fontSize,
  fontWeight: props.design?.buttonStyle?.fontWeight,
  borderRadius: props.design?.buttonStyle?.borderRadius,
  borderWidth: props.design?.buttonStyle?.borderWidth,
  borderColor: props.design?.buttonStyle?.borderColor
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

const buttonText = computed(() => props.design?.buttonStyle?.text)

const productBlockStyle = computed(() => ({
  backgroundColor: props.design?.bodyStyle?.backgroundColor
}))
</script>

<style lang="scss" scoped>
.product-block {
  padding: 12px;
  display: flex;
  flex-direction: column;
}
.picture {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.button {
  margin-top: 24px;
  text-align: center;
  min-width: 200px;
  padding: 12px;
  border-style: solid;
}
</style>
