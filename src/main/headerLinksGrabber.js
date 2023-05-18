import browserPage from './browserPage'
import * as utils from './utils'
const headerLinksBannedRules = [/cart/gi]
async function findHeaderLinks(page, limit = 5) {
  const linkElements = await utils.selectAnyFrom([
    page.locator('[role="navigation"] a'),
    page.locator('[class*="navigation"] a'),
    page.locator('[class*="menu"] a'),
    page.locator('[class*="header"] a')
  ])
  const headerLinks = (
    await Promise.all(
      linkElements.map(async (locator) => {
        const text = (await locator.innerText()).trim()
        const href = await locator.getAttribute('href')
        const visible = await locator.isVisible()
        const banned = headerLinksBannedRules.find((rule) => text.match(rule))
        return { locator, text, href, visible, banned }
      })
    )
  )
    .filter(Boolean)
    .filter((e) => e.href && e.visible && e.text && !e.banned)
    .slice(0, limit)
  if (headerLinks.length) {
    const locator = headerLinks.at(0).locator
    const { backgroundColor, textColor } = await utils.getColors(locator)

    const { fontFamily, fontSize, fontWeight } = await locator.evaluate((element) =>
      window.getComputedStyle(element)
    )

    const links = headerLinks.map(({ text, href }) => ({ text, href }))

    return {
      links,
      style: { backgroundColor, textColor, fontFamily, fontSize, fontWeight }
    }
  }
}

export default async function headerLinksGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const headerLinks = await findHeaderLinks(page)

  await page.freeResources()
  console.log(headerLinks)
  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    headerLinks
  }
}
