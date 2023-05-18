import browserPage from './browserPage'
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
  const logoSRCImages = page.locator('img[src*="logo"]').all()
  const logoClassImages = page.locator('img[class*="logo"]').all()
  const logoIdImages = page.locator('img[id*="logo"]').all()

  const logoClassNestedImages = page.locator('[class*="logo"] img').all()
  const logoIdNestedImages = page.locator('[id*="logo"] img').all()
  const homeLinkNestedImages = page.locator('[href="/"] img').all()
  const storeLinkNestedImages = page.locator(`[href="${baseUrl}"] img`).all()

  const candidates = (
    await Promise.all([
      logoSRCImages,
      logoClassImages,
      logoIdImages,
      logoClassNestedImages,
      logoIdNestedImages,
      homeLinkNestedImages,
      storeLinkNestedImages
    ])
  ).flat()

  const src = await Promise.all(candidates.map((element) => getImageSrc(element)))
  const urls = src
    .filter(Boolean)
    .map((path) => (path.slice(0, 2) === '//' ? `https:${path}` : path))
    .map((path) => path.split('?').at(0))
    .filter((path) => path.match(/(gif|jpg|jpeg|png)$/))
    .filter((path) => !path.match(/[{}]/))
    .map((url) => utils.fullyQualifiedUrl(url, baseUrl))
  if (!urls.length) {
    return null
  }
  const usage = urls.reduce((map, key) => {
    const counter = key in map ? map[key] : 0
    return { ...map, [key]: counter + 1 }
  }, {})
  const mostlyUsed = Object.entries(usage)
    .sort((a, b) => b - a)
    .at(0)
  return mostlyUsed[0]
}

export default async function logoGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const logo = await findLogo(page, url)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    logo
  }
}
