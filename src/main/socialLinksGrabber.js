import browserPage from './browserPage'
import * as utils from './utils'
import tinycolor from 'tinycolor2'

const excludedLinkRules = [/share/gi, /create/gi]

async function findSocialLinks(page, max = 5) {
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
    .filter((e) => e.href.slice(0, 8) === 'https://')
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
    const colors = await utils.getColors(firstLink.locator)
    const box = await firstLink.locator.boundingBox()

    const size = box.height > 24 ? 'large' : 'small'
    const backgroundColor = tinycolor(colors?.backgroundColor)
    const isDark = backgroundColor.isDark()
    const style = isDark ? 'white' : 'color'

    return { links, style: { size, style, backgroundColor: colors?.backgroundColor } }
  }
}

export default async function socialLinksGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const socialLinks = await findSocialLinks(page)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    socialLinks
  }
}
