import browserPage from './browserPage'
import * as utils from './utils'

async function findHeadings(page) {
  const procuctHeaderElements = await utils.selectAnyFrom(
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
  if (procuctHeaderElements.length) {
    const { fontFamily, fontSize, fontWeight, color } = await procuctHeaderElements
      .at(0)
      .evaluate((element) => window.getComputedStyle(element))
    return { fontFamily, fontSize, fontWeight, textColor: color }
  }
}

export default async function headersGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const headings = await findHeadings(page)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    headings
  }
}
