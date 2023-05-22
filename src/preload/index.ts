import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import logoGrabber from '../main/logoGrabber'
import headerLinksGrabber from '../main/headerLinksGrabber'
import buttonGrabber from '../main/buttonGrabber'
import socialLinksGrabber from '../main/socialLinksGrabber'
import bodyStylesGrabber from '../main/bodyStylesGrabber'
import headerGrabber from '../main/headerGrabber'
import footerGrabber from '../main/footerGrabber'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('logoGrabber', logoGrabber)
    contextBridge.exposeInMainWorld('headerLinksGrabber', headerLinksGrabber)
    contextBridge.exposeInMainWorld('buttonGrabber', buttonGrabber)
    contextBridge.exposeInMainWorld('socialLinksGrabber', socialLinksGrabber)
    contextBridge.exposeInMainWorld('bodyStylesGrabber', bodyStylesGrabber)
    contextBridge.exposeInMainWorld('headerGrabber', headerGrabber)
    contextBridge.exposeInMainWorld('footerGrabber', footerGrabber)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  window['logoGrabber'] = logoGrabber
  window['headerLinksGrabber'] = headerLinksGrabber
  window['buttonGrabber'] = buttonGrabber
  window['socialLinksGrabber'] = socialLinksGrabber
  window['bodyStylesGrabber'] = bodyStylesGrabber
  window['headerGrabber'] = headerGrabber
  window['footerGrabber'] = footerGrabber
}
