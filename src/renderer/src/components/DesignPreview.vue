<template>
  <div class="page-body" :style="pageBodyStyle">
    <div class="message-body" :style="messageBodyStyle">
      <HeaderPreviewer :design="props.design" />
      <TextBlockPreview :design="props.design" />
      <ButtonBlockPreview :design="props.design" />
      <DividerLinePreview :design="props.design" />
      <ProductBlockPreview :design="props.design" />
      <DividerLinePreview :design="props.design" />
      <PalettePreviewer :palette="props.design?.palette?.colors" text="Text colors"/>
      <PalettePreviewer :palette="props.design?.palette?.backgrounds" text="Background colors"/>
      <DividerLinePreview :design="props.design" />
      <FooterPreviewer :design="props.design" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import HeaderPreviewer from './HeaderPreviewer.vue'
import TextBlockPreview from './TextBlockPreview.vue'
import DividerLinePreview from './DividerLinePreview.vue'
import ButtonBlockPreview from './ButtonBlockPreview.vue'
import ProductBlockPreview from './ProductBlockPreview.vue'
import PalettePreviewer from './PalettePreviewer.vue'
import FooterPreviewer from './FooterPreviewer.vue'

const props = defineProps(['design'])

const pageBodyStyle = computed(() => ({
  backgroundColor: props.design?.pageBackground?.backgroundColor,
  color: props.design?.bodyStyle?.textColor,
  fontFamily: props.design?.bodyStyle?.fontFamily,
  fontSize: props.design?.bodyStyle?.fontSize,
  fontWeight: props.design?.bodyStyle?.fontWeight
}))

const messageBodyStyle = computed(() => ({
  backgroundColor: props.design?.bodyStyle?.backgroundColor,
  color: props.design?.textStyle?.textColor,
  fontFamily: props.design?.textStyle?.fontFamily,
  fontSize: props.design?.textStyle?.fontSize,
  fontWeight: props.design?.textStyle?.fontWeight
}))
</script>
<style lang="scss">
.page-body {
  display: flex;
  justify-content: center;
  min-width: 840px;
  margin: 32px 0;
}
.message-body {
  min-width: 700px;
  max-width: 700px;
}

.preview-outer {
  border: 2px solid #ccc;
  background-color: #333;
  padding: 2px;
  margin-bottom: 14px;
  .preview-inner {
    border: 2px solid #ccc;
    background-color: #fff;
    min-width: 700px;
    max-width: 700px;
    .header-block {
      text-align: center;
      font-size: 32px;
      padding: 32px;
    }
    .text-block {
      padding: 12px;
      a {
        color: v-bind(linkColor);
      }
    }
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
    .button-block {
      text-align: center;
      padding: 16px;
      .button {
        border-style: solid;
        padding: 12px;
        cursor: pointer;
        margin: 0 32px;
      }
    }
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
    ul.color-swatches {
      li {
        margin: 12px;
        display: flex;
        align-items: center;
        .color-swatch {
          width: 32px;
          height: 32px;
          border: 1px dotted #333;
        }
        .color-label {
          margin-left: 8px;
        }
      }
    }

    .footer-block {
      text-align: center;
      padding: 12px;
      a {
        font-weight: 700;
        color: inherit;
      }
    }
  }
}
</style>


      <!-- 
      <div class="button-block">
        <div class="button" :style="buttonStyle">See more</div>
      </div>

      <div class="text-block" :style="textBlockStyle">
        <div class="header" :style="headerTextStyle">Text colors found</div>
        <div class="paragraph">
          <ul class="color-swatches">
            <li v-for="color in textColors" :key="color">
              <div class="color-swatch" :style="{ backgroundColor: color }" />
              <div class="color-label">{{ color }}</div>
            </li>
          </ul>
        </div>
      </div>

      <div class="text-block" :style="textBlockStyle">
        <div class="header" :style="headerTextStyle">Background colors found</div>
        <div class="paragraph">
          <ul class="color-swatches">
            <li v-for="color in backgroundColors" :key="color">
              <div class="color-swatch" :style="{ backgroundColor: color }" />
              <div class="color-label">{{ color }}</div>
            </li>
          </ul>
        </div>
      </div>

      <ul class="social-links" :style="socialLinksStyle">
        <li v-for="link in socialLinks" :key="link.url">
          <a :href="link.url">
            <img :src="imageSrc(link.provider)" height="32" />
          </a>
        </li>
      </ul>

      <div class="footer-block" :style="footerBlockStyle">
        <p v-text="'Send from {{ companyName }}'"></p>
        <p v-text="'{{ companyAdress }}'"></p>
        <p>
          <a href="#">Unsubscribe</a> |
          <a href="#">Manage preferences</a>
        </p>
      </div> -->
