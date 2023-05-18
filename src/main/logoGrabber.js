import { chromium, devices } from 'playwright'
import * as utils from './utils'

async function getImageSrc(element) {
  const src = await element.getAttribute('src')
  if (src) {
    return src
  }
  const srcset = await element.getAttribute('srcset')
  if (srcset) {
    const src = srcset.split(',').at(0).trim().split(' ').at(0).trim()
    return src
  }
  const dataSrc = await element.getAttribute('data-src')
  if (dataSrc) {
    return dataSrc
  }
}
async function findLogo(page, baseUrl) {
  const logoClassImages = page.locator('img[class*="logo"]').all()

  const logoIdImages = page.locator('img[id*="logo"]').all()
  const logoClassNestedImages = page.locator('[class*="logo"] img').all()
  const logoIdNestedImages = page.locator('[id*="logo"] img').all()
  const homeLinkNestedImages = page.locator('[href="/"] img').all()
  //const allImages = page.locator('img').all()

  const candidates = (
    await Promise.all([
      logoClassImages,
      logoIdImages,
      logoClassNestedImages,
      logoIdNestedImages,
      homeLinkNestedImages
      //allImages
    ])
  ).flat()

  const src = await Promise.all(candidates.map((element) => getImageSrc(element)))
  const urls = src
    .filter(Boolean)
    .map((path) => (path.slice(0, 2) === '//' ? `https:${path}` : path))
    .map((path) => path.split('?').at(0))
    .filter((path) => path.match(/(gif|jpg|jpeg|png)$/))
    .filter((path) => !path.match(/[{}]/))

  const url = urls.at(0)
  return url ? utils.fullyQualifiedUrl(url, baseUrl) : null 
}

export default async function logoGrabber(url) {
  const start = new Date().valueOf()
  const browser = await chromium.launch()
  const context = await browser.newContext({
    ...devices['Desktop Chrome']
    //javaScriptEnabled: false
  })

  context.setDefaultTimeout(120000)
  const page = await context.newPage()

  await page.goto(url, { timeout: 60000 })

  const logoData = await findLogo(page, url)

  await context.close()
  await browser.close()

  const duration = new Date().valueOf() - start
  return {
    url,
    duration,
    logoData
  }
}
