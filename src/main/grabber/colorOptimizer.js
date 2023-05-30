import tinycolor from 'tinycolor2'

export function mostReadable(hex, palette) {
  return tinycolor.mostReadable(hex, palette).toHexString()
}

const AAlevel = { level: 'AA', size: 'large' }
const minimalContrast = 2.4

export function responsible(color, backgroundColor) {
  return tinycolor.isReadable(color, backgroundColor, AAlevel)
}

export const unreadable = (color, backgroundColor, contrast = minimalContrast) => {
  return tinycolor.readability(color, backgroundColor) < contrast
}

export const readable = (color, backgroundColor, contrast = minimalContrast) => {
  return tinycolor.readability(color, backgroundColor) >= contrast
}

export function adjustColor(foreColor, backColor, palette) {
  if (readable(foreColor, backColor)) {
    return foreColor
  }
  let f = tinycolor(foreColor)
  const b = tinycolor(backColor)
  const enlight = b.isDark()
  for (let i = 0; i < 1; i < 50) {
    if (enlight) {
      f = f.brighten(5)
    } else {
      f = f.darken(5)
    }
    if (readable(f, b)) {
      return f.toHexString()
    }
  }
  return tinycolor.mostReadable(b, palette).toHexString()
}

export function lighten(color, scale = 10) {
  return tinycolor(color).brighten(scale).toHexString()
}

export function darken(color, scale = 10) {
  return tinycolor(color).darken(scale).toHexString()
}

export function isDarkColor(color) {
  return tinycolor(color).isDark()
}

export function createPalettes(primary, colors) {
  const brightColors = colors
    .map((hex) => tinycolor(hex))
    .map((color) => ({
      color: color.toHexString(),
      hsl: color.toHsl()
    }))
    .sort((c1, c2) => c2.hsl.s - c1.hsl.s)
    .map((e) => e.color)
  const themeColor = brightColors.at(0) || '#0093FF'
  const accentColor = tinycolor.mix(primary, themeColor, 25).toHexString()

  const foregrounds = tinycolor(themeColor)
    .monochromatic()
    .map((e) => e.toHexString())

  const backgrounds = tinycolor(themeColor)
    .splitcomplement()
    .map((e) => e.toHexString())

  return {
    themeColor,
    accentColor,
    foregrounds,
    backgrounds
  }
}
