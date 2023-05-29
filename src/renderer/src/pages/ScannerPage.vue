<template>
  <div v-if="loading" class="loader">
    <h1>Extracting site styles....</h1>
    <p>Please be patient: site scanning can take up to several minutes</p>
    <div id="load-progress-spinner"></div>
  </div>
  <div v-else class="form">
    <input v-model="url" class="input" @change="updateLast" />
    <button class="button" @click="scan">Scan</button>
  </div>
  <DesignPreview v-if="loaded" :design="style" />
  <template v-if="error.message">
    <pre>{{ error }}</pre>
  </template>
  <template v-if="loaded">
    <h1>Optimized</h1>
    <pre>{{ style }}</pre>
    <h1>Raw</h1>
    <pre>{{ rawStyle }}</pre>
  </template>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const grabber = window['grabber']
const optimizer = window['optimizer']
import DesignPreview from '../components/DesignPreview.vue'
const url = ref(
  //'https://www.gummyhair.com.br/products/2-gummy-hair-1-gummy-night-omie?variant=41421997080708'
  //'https://theprintbarapparel.com/collections/humor-wine-tumblers/products/girl-just-wanna-have-wine-wine-tumbler'
  ///'https://www.campsmart.net.au/8-ft-jayco-bag-awning-for-camper-trailer'
  //'https://ridiculousteesdesign.myshopify.com/products/wolf-design-swim-trunks-aop'
  'https://pass-it-on.co/collections/gifts-under-80/products/living-room?variant=44652232048916'
)

if (localStorage['url']) {
  url.value = String(localStorage['url']).trim()
}
const loading = ref(false)
const loaded = ref(false)
const error = reactive({ message: null })
const rawStyle = reactive({})
const style = reactive({})
const updateLast = (): void => {
  localStorage['url'] = url.value
}
const scan = async (): Promise<void> => {
  loading.value = true
  error.message = null
  loaded.value = false
  grabber(url.value)
  //grabber(url.value, ['buttonStyle', 'palette'])
    .then((response) => {
      for (const key in response) {
        rawStyle[key] = response[key]
      }
      const optimized = optimizer(response)
      for (const key in optimized) {
        style[key] = optimized[key]
      }

      loaded.value = true
    })
    .catch((e) => {
      console.error(e)
      error.message = e.toString()
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<style lang="scss" scoped>
.form {
  width: 100%;
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
  width: 100%;
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
