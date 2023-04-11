import { chromium, devices } from 'playwright'
import pixels from 'image-pixels'
import { extractColors } from 'extract-colors'

const css2color = (css) => {
  if (css.includes('rgba')) {
    return rgba2hex(css)
  }
  return rgb2hex(css)
}
const rgb2hex = (rgb) =>
  `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')}`
const rgba2hex = (rgba) => {
  const matches = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d*)\)$/).slice(1)
  matches[3] *= 255
  return `#${matches.map((n) => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
}

async function getColors(locator) {
  try {
    const buffer = await locator.screenshot({ timeout: 30000 })

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

async function getTextStyles(locator) {
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

function topmost(table, attr) {
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

async function findLogo(page) {
  const logoClassImages = page.locator('img[class*="logo"]').all()

  const logoIdImages = page.locator('img[id*="logo"]').all()
  const logoClassNestedImages = page.locator('[class*="logo"] img').all()
  const logoIdNestedImages = page.locator('[id*="logo"] img').all()
  const homeLinkNestedImages = page.locator('[href="/"] img').all()
  const allImages = page.locator('img').all()

  const candidates = (
    await Promise.all([
      logoClassImages,
      logoIdImages,
      logoClassNestedImages,
      logoIdNestedImages,
      homeLinkNestedImages,
      allImages
    ])
  ).flat()

  const src = await Promise.all(candidates.map((l) => l.getAttribute('src')))

  const urls = src
    .filter(Boolean)
    .map((path) => (path.slice(0, 2) === '//' ? `https:${path}` : path))
    .map((path) => path.split('?').at(0))
    .filter((path) => path.match(/(gif|jpg|jpeg|png)$/))

  return { logo: urls[0] }
}

async function checkLocatorPresence(locatorPromise) {
  const locator = await locatorPromise
  const visible = await locator.isVisible({ strict: false })
  if (visible) {
    return locator
  }
}

async function exploreHTMLHeader(page) {
  const title = await page.title()
  const metas = await page.locator('meta', { strict: false }).all()
  const contents =
    (
      await Promise.all(
        metas.map(async (locator) => {
          try {
            const content = await locator.evaluate((element) => element.content)
            const name = await locator.evaluate((element) => element.getAttribute('name'))
            const property = await locator.evaluate((element) => element.getAttribute('property'))
            if (
              (name && name.includes('description')) ||
              (property && property.includes('description'))
            ) {
              return content
            }
          } catch {
            return
          }
        })
      )
    ).filter(Boolean) || []
  const description = contents
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .at(0)

  return { title, description }
}

async function exploreHeader(page) {
  const shopifyHeader = page.locator('#shopify-section-header')
  const bannerHeader = page.getByRole('banner')
  const generalHeader = page.locator('header')

  const promises = [shopifyHeader, bannerHeader, generalHeader].map(checkLocatorPresence)
  const headers = (await Promise.all(promises)).filter(Boolean)
  const header = headers.at(0)
  if (header) {
    const colors = await getColors(header)
    return { colors }
  }
}

async function exploreHeaderLinks(page, max = 5) {
  const ariaNavigationLinks = page.locator('[role="navigation"] a').all()
  const classNavigationLinks = page.locator('[class*="navigation"] a').all()
  const generalNavigationLinks = page.locator('header a').all()
  const anyLinks = page.locator('a').all()

  const candidates = (
    await Promise.all([ariaNavigationLinks, classNavigationLinks, generalNavigationLinks, anyLinks])
  ).flat()

  const allLinks = await Promise.all(
    candidates.map(async (locator) => {
      const text = (await locator.innerText()).trim()
      const href = await locator.getAttribute('href')
      const visible = await locator.isVisible()
      return { locator, text, href, visible }
    })
  )

  const headerLinks = allLinks.filter((l) => l.text && l.href && l.visible)
  const linksMap = new Map(headerLinks.map(({ href, text }) => [text, { href, text }]))
  const links = [...linksMap.values()].slice(0, max)
  const response = {
    links
  }

  if (headerLinks.length) {
    const locator = headerLinks[0].locator
    const colors = await getColors(locator)
    response.backgroundColor = colors?.backgroundColor
    response.textColor = colors?.textColor

    const style = await locator.evaluate((element) => window.getComputedStyle(element))
    response.fontFamily = style.fontFamily
    response.fontSize = style.fontSize
    response.fontWeight = style.fontWeight
  }

  return response
}

function getSocialLink(url) {
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

async function exploreSocialLinks(page, max = 5) {
  const candidates = await page.locator('a').all()

  const allLinks = await Promise.all(
    candidates.map(async (locator) => {
      const href = await locator.getAttribute('href')
      const visible = await locator.isVisible()
      return { href, visible, locator }
    })
  )
  const socialLinks = allLinks
    .filter((e) => e.visible && e.href)
    .filter((e) => e.href.slice(0, 8) === 'https://')
    .map((e) => {
      const social = getSocialLink(e.href)
      if (social) {
        return { ...e, provider: social.provider, url: social.url }
      }
    })
    .filter(Boolean)
    .map((link) => [link.provider, link])
  const linksMap = new Map(socialLinks)

  const firstLink = Array.from(linksMap.values()).at(0)
  if (firstLink) {
    const colors = firstLink ? await getColors(firstLink.locator) : undefined
    const links = [...linksMap.values()]
      .slice(0, max)
      .map(({ provider, url }) => ({ provider, url }))

    return { links, backgroundColor: colors?.backgroundColor }
  }
}

async function scanHeaders(page) {
  const headerLocators = (
    await Promise.all([
      page.locator('h1').all(),
      page.locator('h2').all(),
      page.locator('h3').all()
    ])
  )
    .flat()
    .slice(0, 100)
  const allHeaders = (
    await Promise.all(
      headerLocators.map(async (locator) => {
        try {
          return {
            locator,
            visible: await locator.isVisible(),
            text: (await locator.innerText()).trim()
          }
        } catch {
          return
        }
      })
    )
  )
    .filter(Boolean)
    .slice(0, 100)
  const visibleHeaders = allHeaders
    .filter((h) => h.text && h.visible)
    .sort((a, b) => b.text.length - a.text.length)
  const topVisibleHeaders = visibleHeaders.slice(0, 5)
  if (topVisibleHeaders.length) {
    const headersData = await Promise.all(
      topVisibleHeaders.map(async (header) => {
        const style = await header.locator.evaluate((element) => window.getComputedStyle(element))
        const fontFamily = style.fontFamily
        const fontSize = style.fontSize
        const fontWeight = style.fontWeight
        const textColor = css2color(style.color)

        return {
          size: header.text.length,
          textColor,
          fontFamily,
          fontSize,
          fontWeight
        }
      })
    )
    return {
      textColor: topmost(headersData, 'textColor'),
      fontFamily: topmost(headersData, 'fontFamily'),
      fontSize: topmost(headersData, 'fontSize'),
      fontWeight: topmost(headersData, 'fontWeight')
    }
  }
}

async function scanParagraphs(page) {
  const textLocators = await page.locator('p').all()

  const allParagraphs = (
    await Promise.all(
      textLocators.map(async (locator) => {
        try {
          return {
            locator,
            visible: await locator.isVisible(),
            text: (await locator.innerText()).trim()
          }
        } catch {
          return
        }
      })
    )
  )
    .filter(Boolean)
    .slice(0, 100)

  const visibleParagraphs = allParagraphs
    .filter((h) => h.text && h.visible)
    .sort((a, b) => b.text.length - a.text.length)
  const topVisibleParagraphs = visibleParagraphs.slice(0, 5)

  if (topVisibleParagraphs.length) {
    const textData = await Promise.all(
      topVisibleParagraphs.map(async (paragraph) => {
        const style = await paragraph.locator.evaluate((element) =>
          window.getComputedStyle(element)
        )
        const fontFamily = style.fontFamily
        const fontSize = style.fontSize
        const fontWeight = style.fontWeight
        const textColor = css2color(style.color)

        return {
          size: paragraph.text.length,
          textColor,
          fontFamily,
          fontSize,
          fontWeight
        }
      })
    )
    const topmostParagraph = topVisibleParagraphs.at(0)
    const textBackgroundColor = topmostParagraph
      ? (await getColors(topmostParagraph.locator))?.backgroundColor
      : undefined
    return {
      pageBackgroundColor: textBackgroundColor,
      textColor: topmost(textData, 'textColor'),
      fontFamily: topmost(textData, 'fontFamily'),
      fontSize: topmost(textData, 'fontSize'),
      fontWeight: topmost(textData, 'fontWeight')
    }
  }
}

async function scanLinks(page) {
  const locators = await page.locator('a').all()

  const allLinks = await Promise.all(
    locators.map(async (locator) => {
      return {
        locator,
        visible: await locator.isVisible(),
        text: (await locator.innerText())?.trim(),
        href: (await locator.getAttribute('href'))?.trim()
      }
    })
  )
  const valuableLinks = allLinks
    .filter((h) => h.text && h.visible && h.href)
    .sort((a, b) => b.text.length - a.text.length)
  const topValuableLinks = valuableLinks.slice(0, 15)

  if (topValuableLinks.length) {
    const textData = await Promise.all(
      topValuableLinks.map(async (link) => {
        const style = await link.locator.evaluate((element) => window.getComputedStyle(element))
        const color = css2color(style.color)

        return {
          size: link.text.length,
          color
        }
      })
    )
    return {
      linkColor: topmost(textData, 'color')
    }
  }
}

async function exploreFooter(page) {
  const shopifyFooter1 = page.locator('#shopify-section-footer').all()
  const shopifyFooter2 = page.locator('.section-footer').all()
  const generalFooter = page.locator('.footer').all()
  const generalSiteFooter = page.locator('.site-footer').all()
  const tagFooter = page.locator('footer').all()
  const locators = (
    await Promise.all([shopifyFooter1, shopifyFooter2, generalFooter, generalSiteFooter, tagFooter])
  )
    .flat()
    .filter(Boolean)
  const footer = locators.at(0)
  if (footer) {
    const colors = await getColors(footer)
    const styles = await getTextStyles(footer)
    return { ...colors, ...styles }
  }
}

async function exploreButtons(page) {
  const buttonTags = page.locator('button').all()
  const buttonClass1 = page.locator('.button').all()
  const buttonClass2 = page.locator('.btn').all()
  const buttonSubmit = page.locator('input[type="submit"]').all()

  const locators = (await Promise.all([buttonTags, buttonClass1, buttonClass2, buttonSubmit]))
    .flat()
    .slice(0, 100)

  const buttons = (
    await Promise.all(
      locators.map(async (locator) => {
        try {
          const box = await locator.boundingBox()
          const space = box ? box.width * box.height : 0
          return { space, locator }
        } catch {
          return
        }
      })
    )
  ).filter(Boolean)

  if (!buttons.length) {
    return
  }
  const biggest = buttons.sort((a, b) => b.space - a.space).at(0)['locator']
  const buttonText = (await biggest.textContent()).trim()
  const colors = await getColors(biggest)

  const style = await biggest.evaluate((element) => window.getComputedStyle(element))
  const fontFamily = style.fontFamily
  const fontSize = style.fontSize
  const fontWeight = style.fontWeight
  const textColor = css2color(style.color)
  const borderVisible = style.borderStyle !== 'none'
  const borderRadius = style.borderRadius
  const borderWidth = borderVisible ? style.borderWidth : '0'
  const borderColor = css2color(style.borderColor)

  return {
    buttonText,
    ...colors,
    fontFamily,
    fontSize,
    fontWeight,
    textColor,
    borderRadius,
    borderWidth,
    borderColor
  }
}

async function scanTextElements(page) {
  const textLocators = (await page.locator('body :not(:empty)').all()).slice(0, 500)

  const visible = (
    await Promise.all(
      textLocators.map(async (locator) => {
        try {
          return {
            locator,
            text: await locator.innerText(),
            visible: await locator.isVisible()
          }
        } catch {
          return
        }
      })
    )
  )
    .filter((e) => e && e.visible && e.text)
    .map((e) => e.locator)
    .slice(0, 100)

  const textColorData = await Promise.all(
    visible.map(async (locator) => {
      const style = await locator.evaluate((element) => window.getComputedStyle(element))

      const color = css2color(style.color)
      const backgroundColor = css2color(style.backgroundColor)

      return {
        color,
        backgroundColor
      }
    })
  )

  const colors = Array.from(new Set(textColorData.map((e) => e.color)))
  const backgrounds = Array.from(new Set(textColorData.map((e) => e.backgroundColor)))
  return {
    colors,
    backgrounds
  }
}

async function grabber(url) {
  const start = new Date().valueOf()
  const browser = await chromium.launch()
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    javaScriptEnabled: false
  })

  context.setDefaultTimeout(60000)
  const page = await context.newPage()

  await page.goto(url, { timeout: 60000 })

  const [
    metaData,
    headerData,
    logoData,
    headerText,
    plainText,
    linksData,
    footerData,
    socialLinks,
    headerLinks,
    buttonsData,
    colorsData
  ] = await Promise.all([
    exploreHTMLHeader(page),
    exploreHeader(page),
    findLogo(page),
    scanHeaders(page),
    scanParagraphs(page),
    scanLinks(page),
    exploreFooter(page),
    exploreSocialLinks(page),
    exploreHeaderLinks(page),
    exploreButtons(page),
    scanTextElements(page)
  ])
  await context.close()
  await browser.close()

  const duration = new Date().valueOf() - start
  return {
    url,
    duration,
    metaData,
    headerData,
    logoData,
    headerText,
    plainText,
    linksData,
    footerData,
    socialLinks,
    headerLinks,
    buttonsData,
    colorsData
  }
}

export default grabber
