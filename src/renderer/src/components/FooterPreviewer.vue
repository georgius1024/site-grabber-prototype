<template>
  <div v-if="props.design" class="footer-block" :style="footerBlockStyle">
    <SocialLinksPreviewer
      v-if="props.design?.socialLinks"
      :links="props.design?.socialLinks?.links"
      :style="props.design?.socialLinks?.style"
    />
    <div class="footer-text">
      <p v-text="'Send from {{ companyName }}'"></p>
      <p v-text="'{{ companyAdress }}'"></p>
      <p>
        <a href="#">Unsubscribe</a> |
        <a href="#">Manage preferences</a>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SocialLinksPreviewer from './SocialLinksPreviewer.vue'

const props = defineProps(['design'])

const footerBlockStyle = computed(() => ({
  backgroundColor: props.design?.footerStyle?.backgroundColor,
  color: props.design?.footerStyle?.textColor,
  fontFamily: props.design?.footerStyle?.fontFamily,
  fontSize: props.design?.footerStyle?.fontSize,
  fontWeight: props.design?.footerStyle?.fontWeight
}))

const linkColor = computed(() => props.design?.footerStyle?.textColor)
</script>
<style lang="scss" scoped>
.footer-block {
  .footer-text {
    padding: 12px 0;
    text-align: center;
    a {
      color: v-bind(linkColor);
    }
  }
}
</style>
