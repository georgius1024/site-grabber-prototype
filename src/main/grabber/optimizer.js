import tinycolor from 'tinycolor2'
import { optimzeFontFace, fontSizeParser, optimizeFontSize } from './fontOptimizer'
function mostReadable(hex, palette) {
  return tinycolor.mostReadable(hex, palette).toHexString()
}

const unreadable = (color, backgroundColor) => {
  return tinycolor.readability(color, backgroundColor) < 2
}

const AAlevel = { level: 'AA', size: 'small' }

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
    palette = {}
  } = design

  const primaryTextColor = bodyStyle.textColor || '#333333'
  const primaryBackgroundColor = tinycolor.isReadable(
    primaryTextColor,
    bodyStyle.backgroundColor,
    AAlevel
  )
    ? bodyStyle.backgroundColor
    : '#ffffff'

  const primaryFontFamily = optimzeFontFace(bodyStyle.fontFamily || 'Roboto', false)
  const primaryFontSize = fontSizeParser(bodyStyle.fontSize || '16px')
  const primaryFontWeight = bodyStyle.fontWeight || '400'

  const { colors = [], backgrounds = [] } = palette
  const brightColors = [...colors, ...backgrounds]
    .map((hex) => tinycolor(hex))
    .map((color) => ({
      color: color.toHexString(),
      hsl: color.toHsl()
    }))
    .sort((c1, c2) => c2.hsl.s - c1.hsl.s)
    .map((e) => e.color)
  const themeColor = brightColors.at(0) || '#0093FF'
  const accentColor = tinycolor.mix(primaryBackgroundColor, themeColor, 25).toHexString()

  if (colors.length < 5) {
    const ext = tinycolor(themeColor).monochromatic()
    ext.forEach((color) => colors.push(color.toHexString()))
  }

  if (backgrounds.length < 5) {
    const ext = tinycolor(themeColor).splitcomplement()
    ext.forEach((color) => backgrounds.push(color.toHexString()))
  }

  // Normalize body styles
  bodyStyle.textColor = primaryTextColor
  bodyStyle.backgroundColor = primaryBackgroundColor
  bodyStyle.fontFamily = optimzeFontFace(bodyStyle.fontFamily || primaryFontFamily, false)
  bodyStyle.fontSize = fontSizeParser(bodyStyle.fontSize || primaryFontSize)
  bodyStyle.fontWeight = bodyStyle.fontWeight || primaryFontWeight
  if (!tinycolor.isReadable(bodyStyle.textColor, bodyStyle.backgroundColor, AAlevel)) {
    bodyStyle.textColor = mostReadable(bodyStyle.backgroundColor, colors)
  }

  // Page background style
  const pageBackground = {
    backgroundColor: tinycolor(bodyStyle.backgroundColor).isDark()
      ? tinycolor(bodyStyle.backgroundColor).lighten(20).toHexString()
      : tinycolor(bodyStyle.backgroundColor).darken(20).toHexString()
  }

  // Normalize text style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = optimzeFontFace(textStyle.fontFamily || bodyStyle.fontFamily)
  textStyle.fontSize = fontSizeParser(textStyle.fontSize || bodyStyle.fontSize)
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(textStyle.textColor, textStyle.backgroundColor, AAlevel)) {
    textStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize paragraphs style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = optimzeFontFace(textStyle.fontFamily || bodyStyle.fontFamily, false)
  textStyle.fontSize = fontSizeParser(textStyle.fontSize || bodyStyle.fontSize)
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(textStyle.textColor, textStyle.backgroundColor, AAlevel)) {
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
  if (!tinycolor.isReadable(headingStyle.textColor, textStyle.backgroundColor, AAlevel)) {
    headingStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize header style
  headerStyle.backgroundColor = headerStyle.backgroundColor || themeColor
  headerStyle.textColor = headerStyle.textColor || mostReadable(headerStyle.backgroundColor, colors)
  if (!tinycolor.isReadable(headerStyle.textColor, headerStyle.backgroundColor, AAlevel)) {
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
  if (unreadable(headerStyle.textColor, headerStyle.backgroundColor)) {
    headerStyle.textColor = mostReadable(headerStyle.backgroundColor, colors)
  }

  // Normalize footer style
  footerStyle.textColor = footerStyle.textColor || bodyStyle.textColor
  footerStyle.backgroundColor = footerStyle.backgroundColor || bodyStyle.backgroundColor
  footerStyle.fontFamily = optimzeFontFace(footerStyle.fontFamily || bodyStyle.fontFamily, false)
  footerStyle.fontSize = fontSizeParser(footerStyle.fontSize || bodyStyle.fontSize)
  footerStyle.fontWeight = footerStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(footerStyle.textColor, footerStyle.backgroundColor, AAlevel)) {
    footerStyle.textColor = mostReadable(footerStyle.backgroundColor, colors)
  }

  // Normalize social links
  if (!socialLinks.style) {
    socialLinks.style = {}
  }
  socialLinks.style.backgroundColor = footerStyle.backgroundColor

  socialLinks.style.scheme = tinycolor(socialLinks.style.backgroundColor).isDark()
    ? 'white'
    : 'color'

  // Divider line
  const dividerLine = {
    backgroundColor: tinycolor(mostReadable(primaryBackgroundColor, colors))
      .lighten(20)
      .toHexString()
  }

  // Link style
  linkStyle.textColor =
    linkStyle.textColor ||
    tinycolor(mostReadable(primaryBackgroundColor, colors)).lighten(20).toHexString()
  if (unreadable(linkStyle.textColor, bodyStyle.backgroundColor, AAlevel)) {
    linkStyle.textColor = tinycolor(mostReadable(primaryBackgroundColor, colors))
      .darken(20)
      .toHexString()
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
  if (unreadable(buttonStyle.textColor, buttonStyle.backgroundColor)) {
    buttonStyle.textColor = mostReadable(buttonStyle.backgroundColor, colors)
  }

  if (buttonStyle.borderWidth !== '0') {
    // Optimize button with border
    const lowContrastBorder = unreadable(buttonStyle.borderColor, bodyStyle.backgroundColor)
    const lowContrastBackground = unreadable(buttonStyle.backgroundColor, bodyStyle.backgroundColor)
    if (lowContrastBorder && lowContrastBackground) {
      buttonStyle.borderColor = buttonStyle.textColor // TODO GRADUALLY
    }
  } else {
    // Optimize button without border
    const lowContrastBackground = unreadable(buttonStyle.backgroundColor, bodyStyle.backgroundColor)
    if (lowContrastBackground) {
      buttonStyle.borderWidth = '1px'
      buttonStyle.borderColor = buttonStyle.textColor // TODO GRADUALLY
    }
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
    palette: { colors, backgrounds, themeColor, accentColor }
  }
}
