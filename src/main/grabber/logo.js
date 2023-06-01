import * as utils from './utils.js'

async function getImageSrc(element) {
  const dataSrc = await element.getAttribute('data-src')
  if (dataSrc) {
    return dataSrc
  }

  const src = await element.getAttribute('src')
  if (src) {
    return src
  }

  const srcset = await element.getAttribute('srcset')
  if (srcset) {
    const src = srcset.split(',').at(0).trim().split(' ').at(0).trim()
    return src
  }
}

export default async function (page) {
  const baseUrl = page.url()
  const logoSRCImages = page.locator('img[src*="logo"]').all()
  const logoClassImages = page.locator('img[class*="logo"]').all()
  const logoIdImages = page.locator('img[id*="logo"]').all()

  const logoClassNestedImages = page.locator('[class*="logo"] img').all()
  const logoIdNestedImages = page.locator('[id*="logo"] img').all()
  const homeLinkNestedImages = page.locator('[href="/"] img').all()
  const storeLinkNestedImages = page.locator(`[href*="${baseUrl}"] img`).all()

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
  const sortedCandidates = await utils.getOrderedByBoxSpaceElements(candidates)
  const src = await Promise.all(sortedCandidates.map((element) => getImageSrc(element)))
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
    if (key.includes('logo')) {
      return { ...map, [key]: counter + 10 }
    }
    return { ...map, [key]: counter + 1 }
  }, {})
  const mostlyUsed = Object.entries(usage)
    .sort((a, b) => b - a)
    .at(0)
  return mostlyUsed[0]
}
