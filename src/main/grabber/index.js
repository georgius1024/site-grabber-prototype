import browserPage from './browserPage.js'
import bodyStyle from './bodyStyle.js'
import buttonStyle from './buttonStyle.js'
import footerStyle from './footerStyle.js'
import headerStyle from './headerStyle.js'
import headerLinks from './headerLinks.js'
import headingStyle from './headingStyle.js'
import linkStyle from './linkStyle.js'
import logo from './logo.js'
import meta from './meta.js'
import socialLinks from './socialLinks.js'
import textStyle from './textStyle.js'
import palette from './palette.js'

export default async function grabber(url, options = null) {
  try {
    const startedAt = new Date().valueOf()
    const page = await browserPage(url)
    const methods = {
      bodyStyle,
      buttonStyle,
      footerStyle,
      headerStyle,
      headerLinks,
      headingStyle,
      linkStyle,
      logo,
      meta,
      socialLinks,
      textStyle,
      palette
    }

    if (!options) {
      options = Object.keys(methods)
    }
    const result = {}
    for (const key in options) {
      const methodName = options[key]
      const method = methods[methodName]
      if (method) {
        result[methodName] = await method(page)
      }
    }
    await page.freeResources()
    const duration = new Date().valueOf() - startedAt
    return {
      url,
      duration,
      ...result
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
