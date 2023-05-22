<template>
  <div v-if="loading" class="loader">
    <h1>Extracting site styles....</h1>
    <p>Please be patient: site scanning can take up to several minutes</p>
    <div id="load-progress-spinner"></div>
  </div>
  <div v-else class="form">
    <textarea v-model="urls" class="input textarea" rows="8" @change="storeUrls" />
    <button class="button" @click="scan">Scan</button>
  </div>
  <div v-if="response.length" class="preview">
    <div v-for="(item, index) in response" :key="index" class="splitted">
      <h2>{{ getHost(item?.url) }}</h2>
      <ButtonPreviewer :style="item?.footer" />
    </div>
  </div>
  <template v-if="error.message">
    <pre>{{ error }}</pre>
  </template>
  <template v-if="response">
    <pre>{{ response }}</pre>
  </template>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const footerGrabber = window['footerGrabber']
import ButtonPreviewer from '../components/ButtonPreviewer.vue'

const urls = ref(
  //localStorage['urls'] ||
  [
    'https://pass-it-on.co/collections/gifts-under-80/products/living-room?variant=44652232048916',
    'https://pragmamemorials.com/collections/pet-cremation-jewellery/products/diamante-pet-dog-paw-print-heart-urn-pendant-for-pet-cremation-ashes',
    'http://ridiculousteesdesign.myshopify.com/products/wolf-design-swim-trunks-aop',
    'http://hermosoae.com/products/basic-care-detox-face-mask-50ml?sp_id=86775261',
    'https://www.campsmart.net.au/8-ft-jayco-bag-awning-for-camper-trailer',
    'https://theprintbarapparel.com/collections/humor-wine-tumblers/products/girl-just-wanna-have-wine-wine-tumbler'
  ]
    .join('\n')
    .trim()
)
const loading = ref(false)
const error = reactive({ message: null })
const response = reactive([])
const storeUrls = (): void => {
  localStorage['urls'] = urls.value
}

const scan = async (): Promise<void> => {
  loading.value = true
  error.message = null
  while (response.length) response.pop()
  const promises = urls.value.split('\n').map((url) => footerGrabber(url.trim()))
  const responses = await Promise.all(promises)
    .catch((e) => {
      console.error(e)
      error.message = e.toString()
    })
    .finally(() => {
      loading.value = false
    })
  if (!responses) {
    return
  }
  responses.forEach((element) => {
    response.push(element)
  })
}

const getHost = (url): string => {
  return new URL(url).host
}
</script>
<style lang="scss" scoped>
.form {
  min-width: 800px;
  margin: auto 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  .input {
    display: block;
    padding: 16px;
    margin: 8px 0;
  }
  .textarea {
    font-family: 'Monospace';
  }
  .button {
    display: block;
    background-color: #ccc;
    border: 1px solid #aaa;
    color: #333;
    padding: 14px;
  }
  code {
    margin-top: 16px;
    display: block;
  }
}
.preview {
  text-align: center;
  padding: 16px;
}
.loader {
  cursor: wait;
  width: 800px;
  margin: auto 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#load-progress-spinner {
  border-radius: 100%;
  border-style: solid;
  border-color: #0093ff;
  border-top-color: #c7e7ff;
  border-width: 16px;
  animation: load-spinner-animation 4s linear infinite;
  width: 200px;
  height: 200px;
  margin: 32px;
}
@keyframes load-spinner-animation {
  to {
    transform: rotate(360deg);
  }
}
</style>
