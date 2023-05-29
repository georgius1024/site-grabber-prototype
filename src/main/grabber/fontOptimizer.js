const webSafeFonts = [
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT'
]

const substitutes = {
  'Avenir Next': 'Avro',
  AppleGothic: 'Century Gothic',
  'Arial Bold': 'Arial Black',
  Baskerville: 'Times New Roman',
  'Baskerville Old Face': 'Garamond',
  'Bitstream Vera Sans Bold': 'Impact',
  'Bitstream Vera Sans Mono': 'Lucida Console',
  'Book Antiqua': 'Palatino',
  CenturyGothic: 'Century Gothic',
  Charcoal: 'Impact',
  Courier: 'Courier New',
  cursive: 'Pacifico',
  'Franklin Gothic Bold': 'Impact',
  Gadget: 'Arial Black',
  Haettenschweiler: 'Impact',
  'Helvetica Inserat': 'Impact',
  'Helvetica Neue': 'Helvetica',
  'Hoefler Text': 'Garamond',
  Karla: 'Lato',
  'Libre Baskerville': 'Garamond',
  'Lucida Grande': 'Trebuchet MS',
  'Lucida Sans': 'Trebuchet MS',
  'Lucida Sans Typewriter': 'Lucida Console',
  'Lucida Sans Unicode': 'Trebuchet MS',
  monaco: 'Lucida Console',
  Oswald: 'Century Gothic',
  'Palatino Linotype': 'Palatino',
  'Palatino LT STD': 'Palatino',
  Segoe: 'Tahoma',
  'Segoe UI': 'Tahoma',
  Times: 'Times New Roman',
  TimesNewRoman: 'Times New Roman'
}

const baseFontSize = 14

export function optimzeFontFace(cssFont, sans = true) {
  const parts = cssFont.split(',').map((e) => e.replaceAll('"', '').trim())
  const result = {}
  parts.forEach((font) => {
    const safe = webSafeFonts.includes(font)
    if (safe) {
      result[font] = true
    } else {
      const replacement = substitutes[font]
      if (replacement) {
        result[replacement] = true
      }
    }
  })
  if (!result['sans-serif'] && !result['serif']) {
    if (sans) {
      result['sans-serif'] = true
    } else {
      result['serif'] = true
    }
  }
  return Object.keys(result)
    .map((e) => (e.includes(' ') ? `"${e}"` : e))
    .join(', ')
}

function getScale(units) {
  switch (units) {
    case 'px':
    default:
      return 1
    case 'em':
    case 'rem':
      return baseFontSize
    case '%':
      return baseFontSize / 100
  }
}

export function fontSizeParser(cssSize) {
  const size = parseFloat(cssSize)

  const units =
    cssSize
      .toLowerCase()
      .match(/rem|em|px|%/gi)
      ?.at(0) || 'px'
  const scale = getScale(units)

  return `${Math.round(size * scale)}px`
}

export function optimizeFontSize(cssSize, regularFontSize, minDelta = 4) {
  const parsed = fontSizeParser(cssSize)
  const regularSizeInPixels = parseInt(fontSizeParser(regularFontSize))
  const parsedSizeInPixels = parseInt(parsed)
  if (parsedSizeInPixels >= regularSizeInPixels + minDelta) {
    return parsed
  }

  return `${regularSizeInPixels + minDelta}px`
}
