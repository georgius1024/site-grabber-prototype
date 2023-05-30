import * as utils from './utils'

const headerLinksBannedRules = [
  /cart/gi,
  /login/gi,
  /signin/gi,
  /profile/gi,
  /search/gi,
  /log in/gi,
  /account/gi,
  /wishlist/gi
]
async function buildHeaderLinkFromElements(elements) {
  const locator = elements.at(0).locator
  const { backgroundColor, textColor } = await utils.getColors(locator)
  const { fontFamily, fontSize, fontWeight } = await locator.evaluate((element) =>
    window.getComputedStyle(element)
  )
  const linksFilter = new Map()
  elements.forEach(({ text, href }) => linksFilter.set(text.toLowerCase(), { text, href }))
  const links = [...linksFilter.values()]

  return {
    links,
    style: { backgroundColor, textColor, fontFamily, fontSize, fontWeight }
  }
}
async function filterLinks(links, limit = 5) {
  return (
    await Promise.all(
      links.map(async (locator) => {
        const text = (await locator.innerText()).trim()
        const href = await locator.getAttribute('href')
        const className = (await locator.getAttribute('class')) || ''
        const visible = await locator.isVisible()
        const banned =
          headerLinksBannedRules.find((rule) => text.match(rule)) ||
          className.toLowerCase().includes('bread')
        return { locator, text, href, className, visible, banned }
      })
    )
  )
    .filter(Boolean)
    .filter((e) => e.href && e.visible && e.text && !e.banned)
    .slice(0, limit)
}
export default async function (page, limit = 5) {
  // PASS 1
  const links1 = await utils.selectAnyFrom([
    page.locator('[id*="navigation"] a'),
    page.locator('[id*="menu"] a'),
    page.locator('[role="navigation"] a'),
    page.locator('[class*="navigation"] a')
  ])
  const headerLinks1 = await filterLinks(links1, limit)
  if (headerLinks1.length > 2) {
    return await buildHeaderLinkFromElements(headerLinks1)
  }
  // PASS 2
  const links2 = await utils.selectAnyFrom([
    page.locator('[id*="header"] [class*="menu"] a'),
    page.locator('[class*="header"] [class*="menu"] a'),
    page.locator('header [class*="menu"] a')
  ])
  const headerLinks2 = await filterLinks(links2, limit)
  if (headerLinks2.length > 2) {
    return await buildHeaderLinkFromElements(headerLinks2)
  }
  // PASS 3
  const links3 = await utils.selectAnyFrom([
    page.locator('[class*="menu"] a'),
    page.locator('[class*="header"] a')
  ])
  const headerLinks3 = await filterLinks(links3, limit)
  if (headerLinks3.length > 2) {
    return await buildHeaderLinkFromElements(headerLinks3)
  }
}
