import * as utils from './utils'

export default async function (page) {
  const textElements = await utils.selectAnyFrom([page.locator('body :not(:empty)')], 'text', 500)

  const textColorData = await Promise.all(
    textElements.map(async (locator) => {
      const style = await locator.evaluate((element) => window.getComputedStyle(element))

      const color = utils.css2color(style.color)
      const backgroundColor = utils.css2color(style.backgroundColor)

      return {
        color,
        backgroundColor
      }
    })
  )

  const colors = Array.from(new Set(textColorData.map((e) => e.color)))
  const backgrounds = Array.from(new Set(textColorData.map((e) => e.backgroundColor)))
  return {
    colors,
    backgrounds
  }
}
