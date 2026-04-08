import dayjs from 'dayjs'

export const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Дата не выбрана'
  return dayjs(value).format('D MMMM YYYY')
}

export const formatShortDate = (value?: string | Date | null) => {
  if (!value) return 'Дата не выбрана'
  return dayjs(value).format('dd, D MMMM')
}

export const formatTime = (value?: string | Date | null) => {
  if (!value) return '--:--'
  return dayjs(value).format('HH:mm')
}

export const formatTimeRange = (
  start?: string | Date | null,
  end?: string | Date | null,
) => {
  if (!start || !end) return 'Время не выбрано'
  return `${formatTime(start)} - ${formatTime(end)}`
}
