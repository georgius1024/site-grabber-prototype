import browserPage from './browserPage'
import * as utils from './utils'

async function findBodyStyles(page) {
  const body = await page.locator('body')
  const style = await utils.getTextStylesAndBackground(body)

  return style
}

export default async function bodyStylesGrabber(url) {
  const startedAt = new Date().valueOf()
  const page = await browserPage(url)

  const body = await findBodyStyles(page)

  await page.freeResources()

  const duration = new Date().valueOf() - startedAt
  return {
    url,
    duration,
    body
  }
}
