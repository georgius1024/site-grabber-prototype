import browserPage from './browserPage'
import * as utils from './utils'

async function findHeader(page) {
  const headerByTag = page.locator('header').all()
  const headerById = page.locator('[id*="header"]').all()
  const headerByClass = page.locator('[class*="header"]').all()
  const toolbars = page.locator('[class*="toolbar"]').all()

  const locators = (await Promise.all([headerByTag, headerById, headerByClass, toolbars])).flat()

  const headers = (
    await Promise.all(
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
  ).filter((e) => e && e.visible && e.space && e.logo)

  if (!headers.length) {
    return
  }
  const biggest = headers.sort((a, b) => b.space - a.space).at(0)
  if (biggest) {
    const { backgroundColor } = await utils.getColors(biggest.locator)
    return { backgroundColor }
  }
}

export default async function headerGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const header = await findHeader(page)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    header
  }
}
