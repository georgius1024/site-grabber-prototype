import * as utils from './utils'

export default async function (page) {
  const headerById = page.locator('[id*="header"]').all()
  const headerByClass = page.locator('[class*="header"]').all()
  const toolbars = page.locator('[class*="toolbar"]').all()
  const headerByTag = page.locator('header').all()

  const locators = (await Promise.all([headerById, headerByClass, toolbars, headerByTag])).flat()

  const candidates = await Promise.all(
    locators.map(async (locator) => {
      try {
        const box = await locator.boundingBox()
        const space = box ? box.width * box.height : 0
        const visible = await locator.isVisible()
        const html = (await locator.innerHTML()).trim()
        const logo = Boolean(html.match(/logo/gi))
        return { space, locator, visible, logo }
      } catch (error) {
        console.error(error)
        return
      }
    })
  )
  const headers = candidates.filter((e) => e && e.visible && e.space)

  const sorted = headers.sort((a, b) => b.space - a.space)
  const biggest = sorted.filter((e) => e.logo).at(0) || sorted.at(0)
  if (biggest) {
    const { backgroundColor } = await utils.getColors(biggest.locator)
    return { backgroundColor }
  }
}
