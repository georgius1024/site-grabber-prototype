import * as utils from './utils.js'

export default async function (page) {
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
