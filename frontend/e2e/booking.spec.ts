import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import dayjs from 'dayjs'
import 'dayjs/locale/ru.js'

type EventType = {
  id: string
  title: string
  durationMinutes: number
}

type Slot = {
  id: string
  startAt: string
  endAt: string
  durationMinutes: number
}

const apiBaseUrl = process.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4010'
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const scenarios = [
  {
    durationMinutes: 30,
    guestName: 'E2E Guest 30',
    emailPrefix: 'e2e-30',
    startHour: 9,
    startMinute: 17,
  },
  {
    durationMinutes: 60,
    guestName: 'E2E Guest 60',
    emailPrefix: 'e2e-60',
    startHour: 11,
    startMinute: 23,
  },
] as const

test.describe('booking flow', () => {
  for (const scenario of scenarios) {
    test(`books ${scenario.durationMinutes} minute event and shows it in admin`, async ({
      page,
      request,
    }) => {
      const title = `E2E ${scenario.durationMinutes} min ${runId}`
      const email = `${scenario.emailPrefix}-${runId}@example.com`
      const startAt = futureSlotStart(scenario.startHour, scenario.startMinute)

      const eventType = await createEventType(
        request,
        title,
        scenario.durationMinutes,
      )
      const slot = await createSlot(request, startAt, scenario.durationMinutes)
      const timeRange = formatTimeRange(slot.startAt, slot.endAt)

      await page.goto('/')
      await expect(
        page.getByRole('heading', { level: 1, name: 'Calendar' }),
      ).toBeVisible()

      await page
        .getByRole('main')
        .getByRole('link', { name: 'Записаться' })
        .click()
      await expect(page).toHaveURL(/\/book$/)
      await expect(
        page.getByRole('heading', { name: 'Выберите тип события' }),
      ).toBeVisible()

      await page.getByText(title, { exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/book/${eventType.id}$`))
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
      await expect(
        page.getByText(`${scenario.durationMinutes} мин`, { exact: true }),
      ).toBeVisible()

      await page.getByLabel('Ваше имя').fill(scenario.guestName)
      await page.getByLabel('Email').fill(email)

      const continueButton = page.getByRole('button', { name: 'Продолжить' })
      await expect(continueButton).toBeDisabled()

      await selectDate(page, startAt)
      await page.getByText(timeRange, { exact: true }).click()
      await expect(continueButton).toBeEnabled()

      await continueButton.click()
      await expect(
        page.getByText('Бронирование создано. Мы скоро свяжемся с вами.'),
      ).toBeVisible()

      await page.goto('/admin')
      await expect(
        page.getByRole('heading', { name: 'Предстоящие встречи' }),
      ).toBeVisible()

      const bookingRow = page
        .locator('tbody tr')
        .filter({ hasText: formatAdminDate(slot.startAt) })
        .filter({ hasText: timeRange })
        .filter({ hasText: title })
        .filter({ hasText: scenario.guestName })

      await expect(bookingRow).toBeVisible()
    })
  }
})

async function createEventType(
  request: APIRequestContext,
  title: string,
  durationMinutes: number,
) {
  const response = await request.post(`${apiBaseUrl}/admin/event-types`, {
    data: {
      title,
      description: `E2E event type ${durationMinutes}`,
      durationMinutes,
    },
  })

  await expect(response).toBeOK()
  return (await response.json()) as EventType
}

async function createSlot(
  request: APIRequestContext,
  startAt: Date,
  durationMinutes: number,
) {
  const response = await request.post(`${apiBaseUrl}/admin/slots`, {
    data: {
      startAt: startAt.toISOString(),
      durationMinutes,
    },
  })

  await expect(response).toBeOK()
  return (await response.json()) as Slot
}

async function selectDate(page: Page, date: Date) {
  const targetMonth = formatCalendarMonth(date)

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (
      await page
        .getByText(targetMonth, { exact: true })
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      break
    }

    await page
      .getByRole('button', { name: /next month|следующий месяц/i })
      .click()
  }

  await page
    .locator('button:not([data-outside])')
    .filter({ hasText: new RegExp(`^${date.getDate()}$`) })
    .first()
    .click()
}

function futureSlotStart(hour: number, minute: number) {
  const date = new Date()
  date.setDate(date.getDate() + 2)
  date.setHours(hour, minute, 0, 0)
  return date
}

function formatTimeRange(startAt: string, endAt: string) {
  return `${formatTime(startAt)} - ${formatTime(endAt)}`
}

function formatTime(value: string) {
  const date = new Date(value)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatCalendarMonth(value: Date) {
  return dayjs(value).locale('ru').format('MMMM YYYY')
}

function formatAdminDate(value: string) {
  return dayjs(value).locale('ru').format('D MMMM YYYY')
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}
