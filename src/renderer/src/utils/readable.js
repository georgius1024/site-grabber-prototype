import tinycolor from 'tinycolor2'

export default function readable(hex) {
  const color = tinycolor(hex)
  if (color.isDark()) {
    return '#ffffff'
  }
  return '#333333'
}
