import tinycolor from 'tinycolor2'

function mostReadable(hex, palette) {
  return tinycolor.mostReadable(hex, palette).toHexString()
}

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
    {}
  )
    ? bodyStyle.backgroundColor
    : '#ffffff'

  const primaryFontFamily = bodyStyle.fontFamily || 'serif'
  const primaryFontSize = bodyStyle.fontSize || '16px'
  const primaryFontWeight = bodyStyle.fontWeight || '400'

  const { colors = [], backgrounds = [] } = palette

  const brightColors = [...colors, ...backgrounds]
    .map((hex) => tinycolor(hex))
    .map((color) => ({
      color: color.toHexString(),
      hsl: color.toHsl()
    }))
    .sort((c1, c2) => c2.hsl.s - c1.hsl.s)
  const themeColor = brightColors.at(0) || '#0093FF'

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
  bodyStyle.fontFamily = bodyStyle.fontFamily || primaryFontFamily
  bodyStyle.fontSize = bodyStyle.fontSize || primaryFontSize
  bodyStyle.fontWeight = bodyStyle.fontWeight || primaryFontWeight
  if (!tinycolor.isReadable(bodyStyle.textColor, bodyStyle.backgroundColor, {})) {
    bodyStyle.textColor = mostReadable(bodyStyle.backgroundColor, colors)
  }

  // Page background style
  const pageBackground = {
    backgroundColor: tinycolor(themeColor).isDark()
      ? tinycolor(themeColor).lighten(20).toHexString()
      : tinycolor(themeColor).darken(20).toHexString()
  }

  // Normalize text style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = textStyle.fontFamily || bodyStyle.fontFamily
  textStyle.fontSize = textStyle.fontSize || bodyStyle.fontSize
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(textStyle.textColor, textStyle.backgroundColor, {})) {
    textStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize paragraphs style
  textStyle.textColor = textStyle.textColor || bodyStyle.textColor
  textStyle.backgroundColor = textStyle.backgroundColor || bodyStyle.backgroundColor
  textStyle.fontFamily = textStyle.fontFamily || bodyStyle.fontFamily
  textStyle.fontSize = textStyle.fontSize || bodyStyle.fontSize
  textStyle.fontWeight = textStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(textStyle.textColor, textStyle.backgroundColor, {})) {
    textStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize headings style
  headingStyle.textColor = headingStyle.textColor || bodyStyle.textColor
  headingStyle.fontFamily = headingStyle.fontFamily || 'sans-serif'
  headingStyle.fontSize = headingStyle.fontSize || bodyStyle.fontSize
  headingStyle.fontWeight = headingStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(headingStyle.textColor, textStyle.backgroundColor, {})) {
    headingStyle.textColor = mostReadable(textStyle.backgroundColor, colors)
  }

  // Normalize header style
  headerStyle.backgroundColor =
    headerStyle.backgroundColor || mostReadable(primaryBackgroundColor, backgrounds)
  headerStyle.textColor = headerStyle.textColor || mostReadable(headerStyle.backgroundColor, colors)
  if (!tinycolor.isReadable(headerStyle.textColor, headerStyle.backgroundColor, {})) {
    headerStyle.textColor = mostReadable(headerStyle.backgroundColor, colors)
  }

  // Normalize header links
  if (!headerLinks.style) {
    headerLinks.style = {}
  }

  headerLinks.style.textColor = headerLinks.style.textColor || headingStyle.textColor
  headerLinks.style.backgroundColor =
    headerLinks.style.backgroundColor || headingStyle.backgroundColor
  headerLinks.style.fontFamily = headerLinks.style.fontFamily || bodyStyle.fontFamily
  headerLinks.style.fontSize = headerLinks.style.fontSize || bodyStyle.fontSize
  headerLinks.style.fontWeight = headerLinks.style.fontWeight || bodyStyle.fontWeight

  // Normalize footer style
  footerStyle.textColor = footerStyle.textColor || bodyStyle.textColor
  footerStyle.backgroundColor = footerStyle.backgroundColor || bodyStyle.backgroundColor
  footerStyle.fontFamily = footerStyle.fontFamily || bodyStyle.fontFamily
  footerStyle.fontSize = footerStyle.fontSize || bodyStyle.fontSize
  footerStyle.fontWeight = footerStyle.fontWeight || bodyStyle.fontWeight
  if (!tinycolor.isReadable(footerStyle.textColor, footerStyle.backgroundColor, {})) {
    footerStyle.textColor = mostReadable(footerStyle.backgroundColor, colors)
  }

  // Normalize social links
  if (!socialLinks.style) {
    socialLinks.style = {}
  }
  socialLinks.style.backgroundColor =
    socialLinks.style.backgroundColor || footerStyle.backgroundColor

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
  if (!tinycolor.isReadable(linkStyle.textColor, bodyStyle.backgroundColor, {})) {
    linkStyle.textColor = tinycolor(mostReadable(primaryBackgroundColor, colors))
      .darken(20)
      .toHexString()
  }

  // Normalize button style
  buttonStyle.textColor = buttonStyle.textColor || headerStyle.textColor
  buttonStyle.backgroundColor = buttonStyle.backgroundColor || headerStyle.backgroundColor
  buttonStyle.fontFamily = buttonStyle.fontFamily || headingStyle.fontFamily
  buttonStyle.fontSize = buttonStyle.fontSize || bodyStyle.fontSize
  buttonStyle.fontWeight = buttonStyle.fontWeight || bodyStyle.fontWeight
  buttonStyle.borderRadius = buttonStyle.borderRadius || '5px'
  buttonStyle.borderWidth = buttonStyle.borderWidth || '0'
  buttonStyle.text = buttonStyle.text || 'Add to cart'
  if (!tinycolor.isReadable(buttonStyle.textColor, buttonStyle.backgroundColor, {})) {
    buttonStyle.textColor = mostReadable(buttonStyle.backgroundColor, colors)
  }

  const lowContrast =
    tinycolor.readability(buttonStyle.backgroundColor, bodyStyle.backgroundColor) < 2

  if (lowContrast) {
    buttonStyle.borderWidth = parseInt(buttonStyle.borderWidth) ? buttonStyle.borderWidth : '3px'
    buttonStyle.borderColor = buttonStyle.textColor
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
    palette: { colors, backgrounds }
  }
}
