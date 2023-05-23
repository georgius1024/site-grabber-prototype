import * as utils from './utils'

const excludedLinkRules = [/share/gi, /create/gi]

export default async function (page, max = 8) {
  const socialClass = page.locator('[class*="social"] a').all()
  const socialIds = page.locator('[id*="social"] a').all()
  const listNestedLinks = page.locator('ul li a').all()

  const candidates = (await Promise.all([socialClass, socialIds, listNestedLinks]))
    .flat()
    .slice(0, 300)

  const allLinks = await Promise.all(
    candidates.map(async (locator) => {
      const href = await locator.getAttribute('href')
      const visible = await locator.isVisible()
      const excluded = excludedLinkRules.find((rule) => href.match(rule))
      return { href, visible, locator, excluded }
    })
  )
  const socialLinks = allLinks
    .filter((e) => e.visible && e.href && !e.excluded)
    .filter((e) => e.href.slice(0, 4) === 'http')
    .map((e) => {
      const social = utils.getSocialLink(e.href)
      if (social) {
        return { ...e, provider: social.provider, url: social.url }
      }
    })
    .filter(Boolean)
    .map((link) => [link.provider, link])
  const linksMap = new Map(socialLinks)

  const firstLink = Array.from(linksMap.values()).at(0)
  if (firstLink) {
    const links = [...linksMap.values()]
      .slice(0, max)
      .map(({ provider, url }) => ({ provider, url }))
    await firstLink.locator.evaluate((element) => (element.style.opacity = 0))
    const colors = await utils.getColors(firstLink.locator)

    return { links, style: { backgroundColor: colors?.backgroundColor } }
  }
}
