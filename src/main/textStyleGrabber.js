import browserPage from './browserPage'
import * as utils from './utils'

async function findHeadings(page) {
  const headerElements = await utils.selectAnyFrom(
    [
      page.locator('[class*="product"] h1'),
      page.locator('[class*="product"] h2'),
      page.locator('[class*="product"] h3'),
      page.locator('[class*="page-container"] h1'),
      page.locator('[class*="page-container"] h2'),
      page.locator('[class*="page-container"] h3'),
      page.locator('h1'),
      page.locator('h2'),
      page.locator('h3')
    ],
    'text'
  )
  if (headerElements.length) {
    const { fontFamily, fontSize, fontWeight, color } = await headerElements
      .at(0)
      .evaluate((element) => window.getComputedStyle(element))
    return { fontFamily, fontSize, fontWeight, textColor: utils.css2color(color) }
  }
}

async function findParagraphs(page) {
  const textElements = await utils.selectAnyFrom(
    [
      page.locator('[class*="product"] p'),
      page.locator('[class*="product"] span'),
      page.locator('[class*="product"] div'),
      page.locator('[class*="page-container"] p'),
      page.locator('[class*="page-container"] span'),
      page.locator('[class*="page-container"] div'),
      page.locator('p')
    ],
    'text'
  )
  if (textElements.length) {
    const { fontFamily, fontSize, fontWeight, color } = await textElements
      .at(0)
      .evaluate((element) => window.getComputedStyle(element))
    return { fontFamily, fontSize, fontWeight, textColor: utils.css2color(color) }
  }
}

async function findLinks(page) {
  const linkElements = await utils.selectAnyFrom(
    [
      page.locator('[class*="product"] a'),
      page.locator('[class*="page-container"] a'),
      page.locator('main p')
    ],
    'text'
  )
  if (linkElements.length) {
    const { color } = await linkElements
      .at(0)
      .evaluate((element) => window.getComputedStyle(element))
    return { textColor: utils.css2color(color) }
  }
}

export default async function headersGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const headings = await findHeadings(page)
  const paragraphs = await findParagraphs(page)
  const links = await findLinks(page)
  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    headings,
    paragraphs,
    links
  }
}
