import * as utils from './utils'

export default async function (page) {
  const body = await page.locator('body')
  const style = await utils.getTextStylesAndBackground(body)

  return style
}
