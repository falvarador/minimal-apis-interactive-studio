import { expect, test } from '@playwright/test'

test('loads the course, navigates modules, and stays within the viewport', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'ASP.NET Core 10 Minimal APIs', exact: true })).toBeVisible()
  await expect(page).toHaveTitle('ASP.NET Core 10 Minimal APIs — Interactive Studio')
  expect(await page.locator('html').getAttribute('lang')).toBe('en')
  await expect(page.getByRole('button', { name: 'Previous Lesson' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Previous Module' })).toBeDisabled()
  const consoleErrors: string[] = []
  const simulatorRequests: string[] = []
  page.on('pageerror', error => consoleErrors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('request', request => {
    if (/localhost:7290|localhost:5034/.test(request.url())) simulatorRequests.push(request.url())
  })

  for (const width of [375, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (let module = 1; module <= 7; module += 1) {
      const number = String(module).padStart(2, '0')
      await page.getByRole('button', { name: new RegExp(`${number}\\. `) }).click()
      await expect(page.getByText(`MODULE ${number}`)).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
        `horizontal overflow at ${width}px in module ${number}`,
      ).toBe(true)
      const unlabeledControls = await page.locator('input, select, textarea').evaluateAll(elements =>
        elements.filter(element => {
          const control = element as HTMLInputElement
          return !control.getAttribute('aria-label') && !control.labels?.length
        }).map(element => element.outerHTML),
      )
      expect(unlabeledControls, `unlabeled controls at ${width}px in module ${number}`).toEqual([])
    }

    const layout = await page.evaluate(() => {
      const header = document.querySelector('header')!
      const main = document.querySelector('main')!
      const sidebar = document.querySelector('aside')!
      return {
        stickyHeader: getComputedStyle(header).position === 'sticky',
        darkSurface: getComputedStyle(document.body).backgroundColor === 'rgb(2, 6, 23)',
        contentWidth: main.parentElement!.getBoundingClientRect().width,
        mainColumns: getComputedStyle(main).gridColumnEnd,
        sidebarColumns: getComputedStyle(sidebar).gridColumnEnd,
        nextDisabled: pageButtonsDisabled(),
      }

      function pageButtonsDisabled() {
        return document.querySelector<HTMLButtonElement>('main button[disabled]') !== null
      }
    })
    expect(layout.stickyHeader).toBe(true)
    expect(layout.darkSurface).toBe(true)
    expect(layout.contentWidth).toBeLessThanOrEqual(1280)
    if (width >= 1024) {
      expect(layout.mainColumns).toBe('span 9')
      expect(layout.sidebarColumns).toBe('span 3')
    } else {
      expect(layout.mainColumns).toBe('auto')
      expect(layout.sidebarColumns).toBe('auto')
    }
    expect(layout.nextDisabled).toBe(true)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(
      await page.locator('main [class*="_module_"]').first().evaluate(element => getComputedStyle(element).animationName),
    ).toBe('none')
  }

  const inactiveEndpoint = page.getByRole('button', { name: /Get all dishes.*GET/ })
  expect(await inactiveEndpoint.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  expect(await inactiveEndpoint.evaluate(element => getComputedStyle(element).borderWidth)).toBe('0px')

  await page.getByRole('button', { name: /04\. CRUD Lab/ }).click()
  const getTab = page.getByRole('button', { name: 'GET /dishes', exact: true })
  const postTab = page.getByRole('button', { name: 'POST /dishes', exact: true })
  expect(await getTab.getAttribute('data-selected')).toBe('true')
  await expect(getTab).toHaveCSS('color', 'rgb(255, 255, 255)')
  await postTab.click()
  expect(await getTab.getAttribute('data-selected')).toBe('false')
  await expect(getTab).toHaveCSS('color', 'rgb(52, 211, 153)')
  await expect(postTab).toHaveCSS('color', 'rgb(255, 255, 255)')

  await page.getByRole('button', { name: /03\. Responses/ }).click()
  const notFoundBadge = page.getByText('HTTP/1.1 404 Not Found', { exact: true })
  await expect(notFoundBadge).toHaveCSS('color', 'rgb(252, 211, 77)')
  await page.getByRole('button', { name: /GET \/testerror/ }).click()
  const serverErrorBadge = page.getByText('HTTP/1.1 500 Internal Server Error', { exact: true })
  await expect(serverErrorBadge).toHaveCSS('color', 'rgb(253, 164, 175)')

  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.keyboard.press('Tab')
  const keyboardFocus = page.locator(':focus-visible')
  await expect(keyboardFocus).toHaveAttribute('aria-current', 'page')
  expect(await keyboardFocus.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid')
  expect(await keyboardFocus.evaluate(element => getComputedStyle(element).outlineWidth)).toBe('2px')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page.getByText('MODULE 02')).toBeVisible()
  await expect(page.getByRole('button', { name: /02\. DI, Routing/ })).toHaveAttribute('aria-current', 'page')

  await page.getByRole('button', { name: /01\. Foundations & HTTP Pipeline/ }).click()
  const pipelineButton = page.getByRole('button', { name: 'Send Request Through Pipeline' })
  await pipelineButton.click()
  await expect(page.getByRole('button', { name: 'Tracing Request...' })).toBeDisabled()
  await page.waitForTimeout(850 * 4 + 100)
  await expect(page.getByRole('button', { name: 'Tracing Request...' })).toBeDisabled()
  await page.waitForTimeout(850)
  await expect(page.getByRole('button', { name: 'Send Request Through Pipeline' })).toBeEnabled()

  expect(consoleErrors).toEqual([])
  expect(simulatorRequests).toEqual([])
})
