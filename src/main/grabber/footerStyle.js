import * as utils from './utils'

export default async function findFooter(page) {
  const footerById = page.locator('[id*="footer"]').all()
  const footerByClass = page.locator('[class*="footer"]').all()
  const footerByTag = page.locator('footer').all()

  const locators = (await Promise.all([footerById, footerByClass, footerByTag])).flat()

  const candidates = await Promise.all(
    locators.map(async (locator) => {
      try {
        const box = await locator.boundingBox()
        const space = box ? box.width * box.height : 0
        const visible = await locator.isVisible()
        return { space, locator, visible }
      } catch (error) {
        console.error(error)
        return
      }
    })
  )
  const footers = candidates.filter((e) => e && e.visible && e.space)

  const sorted = footers.sort((a, b) => b.space - a.space)
  const biggest = sorted.filter((e) => e.logo).at(0) || sorted.at(0)
  if (biggest) {
    const { backgroundColor, textColor } = await utils.getColors(biggest.locator)

    const { fontFamily, fontSize, fontWeight } = await biggest.locator.evaluate((element) =>
      window.getComputedStyle(element)
    )
    return { backgroundColor, fontFamily, fontSize, fontWeight, textColor } //: utils.css2color(color) }
  }
}
