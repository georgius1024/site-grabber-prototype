import { chromium, devices } from 'playwright'

export default async function browserPage(url) {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    ...devices['Desktop Chrome']
    //javaScriptEnabled: false
  })

  context.setDefaultTimeout(120000)
  const page = await context.newPage()
  page.startedAt = new Date().valueOf()
  page.freeResources = () => context.close().then(() => browser.close())
  await page.goto(url, { timeout: 60000 })
  return page
}
