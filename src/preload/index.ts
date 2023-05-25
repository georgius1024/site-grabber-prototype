import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import grabber from '../main/grabber'
import optimizer from '../main/grabber/optimizer'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('grabber', grabber)
    contextBridge.exposeInMainWorld('optimizer', optimizer)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  window['grabber'] = grabber
  window['optimizer'] = optimizer
}
