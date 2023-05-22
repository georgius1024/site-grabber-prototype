import browserPage from './browserPage'
import * as utils from './utils'

async function findParagraphs(page) {
  const procuctHeaderElements = await utils.selectAnyFrom(
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
  if (procuctHeaderElements.length) {
    const { fontFamily, fontSize, fontWeight, color } = await procuctHeaderElements
      .at(0)
      .evaluate((element) => window.getComputedStyle(element))
    return { fontFamily, fontSize, fontWeight, textColor: utils.css2color(color) }
  }
}

export default async function paragraphsGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const paragraphs = await findParagraphs(page)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    paragraphs
  }
}
