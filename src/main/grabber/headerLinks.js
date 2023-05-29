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
  console.log(locator)
  const { fontFamily, fontSize, fontWeight } = await locator.evaluate((element) =>
    window.getComputedStyle(element)
  )

  const links = elements.map(({ text, href }) => ({ text, href }))

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
  console.log(headerLinks1)
  if (headerLinks1.length > 2) {
    return await buildHeaderLinkFromElements(headerLinks1)
  }
  // PASS 2
  const links2 = await utils.selectAnyFrom([
    page.locator('[class*="menu"] a'),
    page.locator('[class*="header"] a')
  ])
  const headerLinks2 = await filterLinks(links2, limit)
  console.log(headerLinks2)
  if (headerLinks2.length > 2) {
    return await buildHeaderLinkFromElements(headerLinks2)
  }
}
