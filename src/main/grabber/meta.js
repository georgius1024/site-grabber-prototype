export default async function meta(page) {
  const title = (await page.title()).trim()
  const metas = await page.locator('meta', { strict: false }).all()
  const contents =
    (
      await Promise.all(
        metas.map(async (locator) => {
          try {
            const content = (await locator.evaluate((element) => element.content)).trim()
            const name = await locator.evaluate((element) => element.getAttribute('name'))
            const property = await locator.evaluate((element) => element.getAttribute('property'))
            if (
              (name && name.includes('description')) ||
              (property && property.includes('description'))
            ) {
              return content
            }
          } catch {
            return
          }
        })
      )
    ).filter(Boolean) || []
  const description = contents
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .at(0)

  return { title, description }
}
