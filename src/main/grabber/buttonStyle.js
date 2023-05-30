import * as utils from './utils'

const includedButtonRules = [/buy/gi, /cart/gi, /atc/gi, /start/gi, /shop/gi, /add/gi, /order/gi]

const excludedButtonRules = [
  /search/gi,
  /share/gi,
  /popup/gi,
  /close/gi,
  /sidebar/gi,
  /drawer/gi,
  /float/gi,
  /trigger/gi
]

export default async function (page) {
  const formButtonsTags = page.locator('form[action*="cart"] button').all()
  const buttonSubmit = page.locator('form[action*="cart"] input[type="submit"]').all()
  const buttonTags = page.locator('main button').all()
  const buttonClass1 = page.locator('main .button').all()
  const buttonClass2 = page.locator('main .btn').all()
  const buttonSubmit2 = page.locator('main input[type="submit"]').all()
  const buttonClass3 = page.locator('.button').all()
  const buttonClass4 = page.locator('.btn').all()
  const buttonSubmit3 = page.locator('input[type="submit"]').all()

  const locators = (
    await Promise.all([
      formButtonsTags,
      buttonSubmit,
      buttonTags,
      buttonClass1,
      buttonClass2,
      buttonSubmit2,
      buttonClass3,
      buttonClass4,
      buttonSubmit3
    ])
  )
    .flat()
    .slice(0, 300)

  const buttons = (
    await Promise.all(
      locators.map(async (locator) => {
        try {
          const box = await locator.boundingBox()
          const space = box ? box.width * box.height : 0
          const visible = await locator.isVisible()
          const text = (await locator.innerText()).trim() || (await locator.inputValue()).trim()
          const className = (await locator.getAttribute('class')).trim()
          const typeName = (await locator.getAttribute('type')).trim()

          const matchWord = includedButtonRules.find((rule) => text.match(rule))
          const matchClass = includedButtonRules.find((rule) => className.match(rule))
          const matchType = typeName.toLowerCase() === 'submit'
          const included = matchWord || matchClass || matchType
          const excluded = excludedButtonRules.find((rule) => text.match(rule))
          return { space, locator, visible, text, included, excluded }
        } catch {
          return
        }
      })
    )
  ).filter((e) => e && e.visible && e.space && e.text && e.included && !e.excluded)

  if (!buttons.length) {
    return
  }
  const biggest = buttons.sort((a, b) => b.space - a.space).at(0)
  const locator = biggest.locator
  const text = biggest.text
  const { backgroundColor } = await utils.getColors(locator)
  const style = await locator.evaluate((element) => window.getComputedStyle(element))
  const fontFamily = style.fontFamily
  const fontSize = style.fontSize
  const fontWeight = style.fontWeight
  const borderVisible = style.borderStyle !== 'none'
  const borderRadius = style.borderRadius
  const borderWidth = borderVisible ? style.borderWidth : '0'
  const borderColor = utils.css2color(style.borderColor)
  const textColor = utils.css2color(style.color)

  return {
    text,
    backgroundColor,
    textColor,
    fontFamily,
    fontSize,
    fontWeight,
    borderRadius,
    borderWidth,
    borderColor
  }
}
