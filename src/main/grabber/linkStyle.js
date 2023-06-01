import * as utils from './utils.js'

export default async function (page) {
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
