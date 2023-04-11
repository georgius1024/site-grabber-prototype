<template>
  <div class="preview-outer">
    <div class="preview-inner" :style="textBlockStyle">
      <div class="header-block" :style="headerBlockStyle">
        <img
          v-if="props.design.logoData"
          :src="props.design.logoData.logo"
          height="64"
          align="center"
        />
        <div v-else>{{ design.url }}</div>
      </div>
      <ul class="header-links" :style="headerLinksStyle">
        <li v-for="link in headerLinks" :key="link.href">
          <a :href="link.href">{{ link.text }}</a>
        </li>
      </ul>

      <div class="text-block" :style="textBlockStyle">
        <div class="header" :style="headerTextStyle">
          {{ design.metaData.title }}
        </div>
        <div class="paragraph">
          {{ design.metaData.description }}
        </div>
      </div>
      <div class="text-block" :style="textBlockStyle">
        <div class="header" :style="headerTextStyle">This is a sample header</div>
        <div class="paragraph">
          <p>This is a sample paragraph text</p>
          <p>Please see link style <a href="#">here</a></p>
        </div>
      </div>

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
        <div class="header" :style="headerTextStyle">Backgrount colors found</div>
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Icons from './icons'

const props = defineProps(['design'])

const headerBlockStyle = computed(() => ({
  backgroundColor: props.design?.headerData?.colors?.backgroundColor,
  color: props.design?.headerData?.colors?.textColor
}))
const headerLinks = computed(() => props.design?.headerLinks?.links || [])
const headerLinksStyle = computed(() => ({
  backgroundColor: props.design?.headerLinks?.backgroundColor,
  color: props.design?.headerLinks?.textColor,
  fontFamily: props.design?.headerLinks?.fontFamily,
  fontSize: props.design?.headerLinks?.fontSize,
  fontWeight: props.design?.headerLinks?.fontWeight
}))
const textBlockStyle = computed(() => ({
  backgroundColor: props.design?.plainText?.backgroundColor,
  color: props.design?.plainText?.textColor,
  fontFamily: props.design?.plainText?.fontFamily,
  fontSize: props.design?.plainText?.fontSize,
  fontWeight: props.design?.plainText?.fontWeight
}))
const headerTextStyle = computed(() => ({
  color: props.design?.headerText?.textColor,
  fontFamily: props.design?.headerText?.fontFamily,
  fontSize: props.design?.headerText?.fontSize,
  fontWeight: props.design?.headerText?.fontWeight
}))
const linkColor = computed(() => props.design?.linksData?.linkColor)

const socialLinks = computed(() => props.design?.socialLinks?.links || [])
const socialLinksStyle = computed(() => ({
  backgroundColor: props.design?.socialLinks?.backgroundColor
}))

const imageSrc = (provider): any => {
  return Icons[provider]
}

const buttonStyle = computed(() => ({
  backgroundColor: props.design?.buttonsData?.backgroundColor,
  color: props.design?.buttonsData?.textColor,
  fontFamily: props.design?.buttonsData?.fontFamily,
  fontSize: props.design?.buttonsData?.fontSize,
  fontWeight: props.design?.buttonsData?.fontWeight,
  borderRadius: props.design?.buttonsData?.borderRadius,
  borderWidth: props.design?.buttonsData?.borderWidth,
  borderColor: props.design?.buttonsData?.borderColor
}))

const footerBlockStyle = computed(() => ({
  backgroundColor: props.design?.footerData?.backgroundColor,
  color: props.design?.footerData?.textColor,
  fontFamily: props.design?.footerData?.fontFamily,
  fontSize: props.design?.footerData?.fontSize,
  fontWeight: props.design?.footerData?.fontWeight
}))

const textColors = computed(() => props.design?.colorsData?.colors || [])
const backgroundColors = computed(() => props.design?.colorsData?.backgrounds || [])
</script>
<style lang="scss">
.preview-outer {
  border: 2px solid #ccc;
  background-color: #333;
  padding: 2px;
  margin-bottom: 14px;
  .preview-inner {
    border: 2px solid #ccc;
    background-color: #fff;
    min-width: 700px;
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
