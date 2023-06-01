browserPage
import browserPage from './browserPage'
import bodyStyle from './bodyStyle'
import buttonStyle from './buttonStyle'
import footerStyle from './footerStyle'
import headerStyle from './headerStyle'
import headerLinks from './headerLinks'
import headingStyle from './headingStyle'
import linkStyle from './linkStyle'
import logo from './logo'
import meta from './meta'
import socialLinks from './socialLinks'
import textStyle from './textStyle'
import palette from './palette'

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
