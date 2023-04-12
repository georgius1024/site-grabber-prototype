<script setup lang="ts">
import { ref, reactive } from 'vue'
import DesignPreview from './components/DesignPreview.vue'

const grabber: unknown = window['grabber']

const url = ref(localStorage['url'] || 'https://pragmamemorials.com/')
const loading = ref(false)
const design = reactive({ data: localStorage['design'] && JSON.parse(localStorage['design']) })
const error = reactive({ message: null })

const click = (): void => {
  loading.value = true
  design.data = null
  error.message = null
  grabber(url.value)
    .then((data) => {
      design.data = data
      localStorage['design'] = JSON.stringify(data)
      localStorage['url'] = url.value
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

<template>
  <div v-if="loading" class="loader">
    <h1>Extracting site styles....</h1>
    <p>Please be patient: site scanning can take up to several minutes</p>
    <div id="load-progress-spinner"></div>
  </div>
  <form v-else class="form">
    <label>URL</label>
    <input v-model="url" placeholder="enter site's url" />
    <button type="submit" @click="click">Get site data</button>

    <br /><br />
    <div v-if="design.data">
      <DesignPreview :design="design.data" />
      <hr />
      <code>{{ design.data }}</code>
    </div>
    <code v-if="error.message">{{ error.message }}</code>
  </form>
</template>

<style lang="less">
@import './assets/css/styles.less';
.form {
  width: 800px;
  margin: auto 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  input {
    display: block;
    padding: 16px;
    margin: 8px 0;
  }
  button {
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
