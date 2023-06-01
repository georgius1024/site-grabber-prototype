import * as utils from './utils.js'

export default async function (page) {
  const textElements = await utils.selectAnyFrom(
    [
      page.locator('[class*="product"] [class*="description"]'),
      page.locator('[class*="product"] p'),
      page.locator('[class*="product"] span'),
      page.locator('[class*="product"] div'),
      page.locator('[class*="page-container"] [class*="description"]'),
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
