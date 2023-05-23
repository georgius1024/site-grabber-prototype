import pixels from 'image-pixels'
import tinycolor from 'tinycolor2'

import { extractColors } from 'extract-colors'
export const css2color = (css) => {
  return tinycolor(css).toHexString()
}

export async function getColors(locator) {
  try {
    const buffer = await locator.screenshot({ path: 'screenshot.png' })

    const pixelsData = await pixels(buffer)
    const palette = await extractColors(pixelsData, { distance: 0.2 })
    const sortedPalette = palette.sort((a, b) => b.area - a.area)
    const backgroundColor = sortedPalette.at(0)?.hex
    const textColor = sortedPalette.at(1)?.hex
    return {
      backgroundColor,
      textColor
    }
  } catch {
    return
  }
}

export async function getTextStyles(locator) {
  const style = await locator.evaluate((element) => window.getComputedStyle(element))
  const fontFamily = style.fontFamily
  const fontSize = style.fontSize
  const fontWeight = style.fontWeight
  const textColor = css2color(style.color)
  return {
    fontFamily,
    fontSize,
    fontWeight,
    textColor
  }
}

export async function getTextStylesAndBackground(locator) {
  const style = await locator.evaluate((element) => window.getComputedStyle(element))
  const fontFamily = style.fontFamily
  const fontSize = style.fontSize
  const fontWeight = style.fontWeight
  const textColor = css2color(style.color)
  const backgroundColor = css2color(style.backgroundColor)
  const backgroundImage = style.backgroundImage
  return {
    fontFamily,
    fontSize,
    fontWeight,
    textColor,
    backgroundColor,
    backgroundImage
  }
}

export async function getVisibleElements(elements) {
  const measured = await Promise.all(
    elements.map(async (locator) => {
      const visible = await locator.isVisible()
      return { locator, visible }
    })
  )

  return measured.filter((e) => e?.visible).map((e) => e.locator)
}

export async function getOrderedByTextLengthElements(elements) {
  const measuredElements = await Promise.all(
    elements.map(async (locator) => {
      const length = (await locator.innerText()).trim().length
      return { locator, length }
    })
  )
  return measuredElements
    .filter((e) => e?.length)
    .sort((a, b) => b.length - a.length)
    .map((e) => e.locator)
}

export async function getOrderedByBoxSpaceElements(elements) {
  const measuredElements = await Promise.all(
    elements.map(async (locator) => {
      const box = await locator.boundingBox()
      const space = box ? box.width * box.height : 0
      return { locator, space }
    })
  )
  return measuredElements
    .filter((e) => e?.length)
    .sort((a, b) => b.length - a.length)
    .map((e) => e.locator)
}

export async function selectAllFrom(locators, order, limit = 100) {
  const elements = (await locators.map(async (l) => await l.all())).flat()

  const visibles = await getVisibleElements(elements)
  switch (order) {
    case 'text':
      return (await getOrderedByTextLengthElements(visibles)).slice(0, limit)
    case 'space':
      return (await getOrderedByBoxSpaceElements(visibles)).slice(0, limit)
    case 'none':
    default:
      return visibles.slice(0, limit)
  }
}

export async function selectAnyFrom(locators, order, limit = 100) {
  const groups = (await Promise.all(locators.map((l) => l.all()))).filter(Boolean)
  const sorted = (
    await Promise.all(
      groups.map(async (elements) => {
        const visibles = await getVisibleElements(elements)
        switch (order) {
          case 'text':
            return await getOrderedByTextLengthElements(visibles)
          case 'space':
            return await getOrderedByBoxSpaceElements(visibles)
          case 'none':
          default:
            return visibles
        }
      })
    )
  ).filter((e) => e?.length)

  return sorted.at(0).slice(0, limit)
}

export function topmost(table, attr) {
  const map = {}
  table.forEach((h) => {
    const key = h[attr]
    map[key] = map[key] ? map[key] + h.size : h.size
  })
  const top = Object.entries(map)
    .sort((a, b) => b.size - a.size)
    .at(0)
  return top.at(0)
}

export function fullyQualifiedUrl(url, base) {
  const baseUrl = new URL(base).origin
  return new URL(url, baseUrl).href
}

export function getSocialLink(url) {
  const providers = {
    Facebook: 'facebook.com/',
    Amazon: 'amazon.com/stores/',
    Apple: 'itunes.apple.com/',
    Instagram: 'instagram.com/',
    Kickstarter: 'kickstarter.com/projects/',
    Mail: 'mailto:',
    Pinterest: 'pinterest.com',
    Slack: 'slack.com',
    Snapchat: 'snapchat.com/add/',
    Telegram: 't.me/',
    Tumblr: 'tumblr.com',
    Twitter: 'twitter.com/',
    Vimeo: 'vimeo.com/',
    Wechat: 'wechat.com/',
    WhatsApp: 'wa.me/',
    Youtube: 'youtube.com/',
    LinkedIn: 'linkedin.com/'
  }

  for (const provider in providers) {
    if (url.includes(providers[provider])) {
      return {
        provider,
        url
      }
    }
  }
}
