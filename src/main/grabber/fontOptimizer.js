const webSafeFonts = [
  'Arial',
  'Arial Black',
  'Arvo',
  'Brush Script MT',
  'Century Gothic',
  'Courier New',
  'Futura',
  'Garamond',
  'Geneva',
  'Georgia',
  'Helvetica',
  'Impact',
  'Lucida Console',
  'Palatino',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana'
]

const googleFonts = [
  'Cardo',
  'Gravitas One',
  'Heebo',
  'Josefin Sans',
  'Lato',
  'Lora',
  'Merriweather',
  'Merriweather Sans',
  'Montserrat',
  'Noticia Text',
  'Open Sans',
  'Pacifico',
  'Petit Formal Script',
  'Playfair Display',
  'Poiret One',
  'Poppins',
  'Quicksand',
  'Raleway',
  'Roboto',
  'Ruda',
  'Source Sans Pro',
  'Ubuntu',
  'Varela'
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
  const safeFonts = [...webSafeFonts, ...googleFonts].map((e) => e.toLowerCase())
  parts.forEach((font) => {
    const safe = safeFonts.includes(font.toLowerCase())
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
  const resultFont = Object.keys(result)
    .map((e) => (e.includes(' ') ? `"${e}"` : e))
    .join(', ')

  if (resultFont === 'serif') {
    return 'Georgia, serif'
  } else if (resultFont === 'sans-serif') {
    return 'Arial, sans-serif'
  }
  return resultFont
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
