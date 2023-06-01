import { optimzeFontFace, fontSizeParser, optimizeFontSize } from './fontOptimizer'
import {
  mostReadable,
  unreadable,
  responsible,
  adjustColor,
  lighten,
  darken,
  isDarkColor,
  createPalettes
} from './colorOptimizer'

export default function optimizer(design) {
  const {
    url,
    duration,
    bodyStyle = {},
    buttonStyle = {},
    footerStyle = {},
    headerStyle = {},
    headerLinks = {},
    headingStyle = {},
    linkStyle = {},
    logo = null,
    socialLinks = {},
    textStyle = {},
    palette = {},
    meta
  } = design

  const primaryTextColor = bodyStyle.textColor || '#333333'
  const primaryBackgroundColor = responsible(primaryTextColor, bodyStyle.backgroundColor)
    ? bodyStyle.backgroundColor
    : '#ffffff'

  const primaryFontFamily = optimzeFontFace(bodyStyle.fontFamily || 'Roboto', false)
  const primaryFontSize = fontSizeParser(bodyStyle.fontSize || '16px')
  const primaryFontWeight = bodyStyle.fontWeight || '400'

  const { colors = [], backgrounds = [] } = palette

  const optimizedPalette = createPalettes(primaryBackgroundColor, [...colors, ...backgrounds])

  const themeColor = optimizedPalette.themeColor
  const accentColor = optimizedPalette.accentColor

  if (colors.length < 5) {
    optimizedPalette.foregrounds.forEach((color) => colors.push(color))
  }

  if (backgrounds.length < 5) {
    optimizedPalette.backgrounds.forEach((color) => backgrounds.push(color))
  }

  // Normalize body styles
  bodyStyle.textColor = primaryTextColor
  bodyStyle.backgroundColor = primaryBackgroundColor
  bodyStyle.fontFamily = optimzeFontFace(bodyStyle.fontFamily || primaryFontFamily, false)
  bodyStyle.fontSize = fontSizeParser(bodyStyle.fontSize || primaryFontSize)
  bodyStyle.fontWeight = bodyStyle.fontWeight || primaryFontWeight
  if (!responsible(bodyStyle.textColor, bodyStyle.backgroundColor)) {
    bodyStyle.textColor = mostReadable(bodyStyle.backgroundColor, colors)
  }

  // Page background style
  const pageBackground = {
    backgroundColor: isDarkColor(bodyStyle.backgroundColor)
      ? lighten(bodyStyle.backgroundColor, 20)
      : darken(bodyStyle.backgroundColor, 20)
  }

  // Normalize text style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = optimzeFontFace(textStyle.fontFamily || bodyStyle.fontFamily)
  textStyle.fontSize = fontSizeParser(textStyle.fontSize || bodyStyle.fontSize)
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!responsible(textStyle.textColor, textStyle.backgroundColor)) {
    textStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize paragraphs style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = optimzeFontFace(textStyle.fontFamily || bodyStyle.fontFamily, false)
  textStyle.fontSize = fontSizeParser(textStyle.fontSize || bodyStyle.fontSize)
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!responsible(textStyle.textColor, textStyle.backgroundColor)) {
    textStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize headings style
  headingStyle.textColor = headingStyle.textColor || bodyStyle.textColor
  headingStyle.fontFamily = optimzeFontFace(headingStyle.fontFamily || 'Poppins', true)
  headingStyle.fontSize = optimizeFontSize(
    headingStyle.fontSize || bodyStyle.fontSize,
    textStyle.fontSize
  )
  headingStyle.fontWeight = headingStyle.fontWeight || bodyStyle.fontWeight
  if (!responsible(headingStyle.textColor, textStyle.backgroundColor)) {
    headingStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize header style
  headerStyle.backgroundColor = headerStyle.backgroundColor || themeColor
  headerStyle.textColor = headerStyle.textColor || mostReadable(headerStyle.backgroundColor, colors)
  if (!responsible(headerStyle.textColor, headerStyle.backgroundColor)) {
    headerStyle.textColor = mostReadable(headerStyle.backgroundColor, colors)
  }

  // Normalize header links
  if (!headerLinks.style) {
    headerLinks.style = {}
  }

  headerLinks.style.textColor = headerLinks.style.textColor || headerStyle.textColor
  headerLinks.style.backgroundColor =
    headerLinks.style.backgroundColor || headerStyle.backgroundColor
  headerLinks.style.fontFamily = optimzeFontFace(
    headerLinks.style.fontFamily || headingStyle.fontFamily,
    true
  )
  headerLinks.style.fontSize = fontSizeParser(headerLinks.style.fontSize || bodyStyle.fontSize)
  headerLinks.style.fontWeight = headerLinks.style.fontWeight || bodyStyle.fontWeight
  if (!responsible(headerLinks.style.textColor, headerLinks.style.backgroundColor)) {
    headerLinks.style.textColor = mostReadable(headerLinks.style.backgroundColor, colors)
  }

  // Normalize footer style
  footerStyle.textColor = footerStyle.textColor || bodyStyle.textColor
  footerStyle.backgroundColor = footerStyle.backgroundColor || bodyStyle.backgroundColor
  footerStyle.fontFamily = optimzeFontFace(footerStyle.fontFamily || bodyStyle.fontFamily, false)
  footerStyle.fontSize = fontSizeParser(footerStyle.fontSize || bodyStyle.fontSize)
  footerStyle.fontWeight = footerStyle.fontWeight || bodyStyle.fontWeight
  if (unreadable(footerStyle.textColor, footerStyle.backgroundColor, 3.5)) {
    footerStyle.textColor = adjustColor(
      footerStyle.textColor,
      footerStyle.backgroundColor,
      colors,
      3.5
    )
  }

  // Normalize social links
  if (!socialLinks.style) {
    socialLinks.style = {}
  }
  socialLinks.style.backgroundColor = footerStyle.backgroundColor

  socialLinks.style.scheme = isDarkColor(socialLinks.style.backgroundColor) ? 'white' : 'color'

  // Divider line
  const dividerLine = {
    backgroundColor: lighten(primaryTextColor, 20)
  }

  // Link style
  linkStyle.textColor = lighten(primaryTextColor)
  if (unreadable(linkStyle.textColor, bodyStyle.backgroundColor)) {
    linkStyle.textColor = darken(mostReadable(primaryBackgroundColor, colors))
  }

  // Normalize button style
  buttonStyle.textColor = buttonStyle.textColor || headerStyle.textColor
  buttonStyle.backgroundColor = buttonStyle.backgroundColor || accentColor
  buttonStyle.fontFamily = optimzeFontFace(buttonStyle.fontFamily || headingStyle.fontFamily, true)
  buttonStyle.fontSize = fontSizeParser(buttonStyle.fontSize || bodyStyle.fontSize)
  buttonStyle.fontWeight = buttonStyle.fontWeight || bodyStyle.fontWeight
  buttonStyle.borderRadius = buttonStyle.borderRadius || '5px'
  buttonStyle.borderWidth = buttonStyle.borderWidth || '0'
  buttonStyle.text = buttonStyle.text || 'Add to cart'

  if (buttonStyle.borderWidth !== '0') {
    // Optimize button with border
    const lowContrastBorder = unreadable(buttonStyle.borderColor, bodyStyle.backgroundColor)
    const lowContrastBackground = unreadable(buttonStyle.backgroundColor, bodyStyle.backgroundColor)
    if (lowContrastBorder && lowContrastBackground) {
      buttonStyle.borderColor = adjustColor(
        buttonStyle.borderColor,
        buttonStyle.backgroundColor,
        colors
      )
    }
  } else {
    // Optimize button without border
    buttonStyle.borderWidth = '1px'
    buttonStyle.borderColor = adjustColor(
      buttonStyle.backgroundColor,
      bodyStyle.backgroundColor,
      colors
    )
  }
  if (unreadable(buttonStyle.textColor, buttonStyle.backgroundColor)) {
    buttonStyle.textColor = adjustColor(buttonStyle.textColor, buttonStyle.backgroundColor, colors)
  }

  return {
    url,
    duration,
    bodyStyle,
    buttonStyle,
    footerStyle,
    headerStyle,
    headerLinks,
    headingStyle,
    dividerLine,
    linkStyle,
    logo,
    socialLinks,
    textStyle,
    pageBackground,
    palette: { colors, backgrounds, themeColor, accentColor },
    meta
  }
}
