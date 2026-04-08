import {
  Button,
  Card,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { publicApi, type ApiError } from '../api/client'
import { formatShortDate, formatTimeRange } from '../utils/datetime'

function BookingPage() {
  const { eventTypeId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const eventTypeQuery = useQuery({
    queryKey: ['eventType', eventTypeId],
    queryFn: () => publicApi.getEventType(eventTypeId ?? ''),
    enabled: Boolean(eventTypeId),
  })

  const range = useMemo(() => {
    if (!selectedDate) return { from: undefined, to: undefined }
    const from = dayjs(selectedDate).startOf('day').toISOString()
    const to = dayjs(selectedDate).endOf('day').toISOString()
    return { from, to }
  }, [selectedDate])

  const slotsQuery = useQuery({
    queryKey: ['slots', eventTypeId, range.from, range.to],
    queryFn: () =>
      publicApi.listAvailableSlots(eventTypeId ?? '', range.from, range.to),
    enabled: Boolean(eventTypeId && range.from && range.to),
  })

  const createBookingMutation = useMutation({
    mutationFn: publicApi.createBooking,
    onSuccess: () => {
      notifications.show({
        title: 'Готово',
        message: 'Бронирование создано. Мы скоро свяжемся с вами.',
      })
      queryClient.invalidateQueries({ queryKey: ['slots', eventTypeId] })
      setSelectedSlotId(null)
      setGuestName('')
      setGuestEmail('')
    },
    onError: (error: ApiError) => {
      const isConflict = error.code === 'booking_conflict'
      notifications.show({
        title: isConflict ? 'Слот уже занят' : 'Ошибка бронирования',
        message:
          error.message ||
          'Проверьте данные и попробуйте снова через несколько секунд.',
        color: 'red',
      })
    },
  })

  useEffect(() => {
    if (!eventTypeId) {
      navigate('/book')
    }
  }, [eventTypeId, navigate])


  const sortedSlots = useMemo(() => {
    const slots = slotsQuery.data ?? []
    return [...slots].sort((a, b) => a.startAt.localeCompare(b.startAt))
  }, [slotsQuery.data])

  const selectedSlot = sortedSlots.find((slot) => slot.id === selectedSlotId)

  if (!eventTypeId) return null

  return (
    <Container size="lg">
      <Title order={2} mb="xl">
        {eventTypeQuery.data?.title ?? 'Загрузка...'}
      </Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        <Card withBorder radius="lg" padding="lg" className="page-card">
          {eventTypeQuery.isLoading ? (
            <Loader />
          ) : (
            <Stack gap="sm">
              <Group>
                <Text fw={600}>{eventTypeQuery.data?.title}</Text>
                <Text size="xs" c="dimmed">
                  {eventTypeQuery.data?.durationMinutes} мин
                </Text>
              </Group>
              <Text c="dimmed" size="sm">
                {eventTypeQuery.data?.description || 'Описание встречи.'}
              </Text>
              <Paper p="sm" radius="md" className="soft-card">
                <Text size="xs" c="dimmed">
                  Выбранная дата
                </Text>
                <Text fw={600}>{formatShortDate(selectedDate)}</Text>
              </Paper>
              <Paper p="sm" radius="md" className="soft-card">
                <Text size="xs" c="dimmed">
                  Выбранное время
                </Text>
                <Text fw={600}>
                  {formatTimeRange(selectedSlot?.startAt, selectedSlot?.endAt)}
                </Text>
              </Paper>
              <TextInput
                label="Ваше имя"
                placeholder="Например, Анна"
                value={guestName}
                onChange={(event) => setGuestName(event.currentTarget.value)}
              />
              <TextInput
                label="Email"
                placeholder="name@example.com"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.currentTarget.value)}
                type="email"
              />
            </Stack>
          )}
        </Card>

        <Card withBorder radius="lg" padding="lg" className="page-card">
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={4}>Календарь</Title>
              <Text size="sm" c="dimmed">
                {dayjs(selectedDate ?? new Date()).format('MMMM YYYY')}
              </Text>
            </Group>
            <DatePicker
              value={selectedDate}
              onChange={(value) => {
                setSelectedDate(value ? dayjs(value).toDate() : null)
                setSelectedSlotId(null)
              }}
            />
          </Stack>
        </Card>

        <Card withBorder radius="lg" padding="lg" className="page-card">
          <Stack gap="md">
            <Title order={4}>Статус слотов</Title>
            {slotsQuery.isLoading ? (
              <Loader size="sm" />
            ) : null}
            {!slotsQuery.isLoading && sortedSlots.length === 0 ? (
              <Text c="dimmed">Нет доступных слотов на выбранную дату.</Text>
            ) : null}
            <Stack gap="sm">
              {sortedSlots.map((slot) => (
                <Paper
                  key={slot.id}
                  p="sm"
                  radius="md"
                  withBorder
                  className={`slot-row${selectedSlotId === slot.id ? ' active' : ''}`}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  <Group justify="space-between" align="center">
                    <Text fw={600}>
                      {formatTimeRange(slot.startAt, slot.endAt)}
                    </Text>
                    <span className="status-pill success">Свободно</span>
                  </Group>
                </Paper>
              ))}
            </Stack>
            <Group justify="space-between" mt="sm">
              <Button variant="light" onClick={() => navigate('/book')}>
                Назад
              </Button>
              <Button
                disabled={!selectedSlotId || createBookingMutation.isPending}
                loading={createBookingMutation.isPending}
                onClick={() => {
                  if (!selectedSlotId) return
                  createBookingMutation.mutate({
                    eventTypeId,
                    slotId: selectedSlotId,
                    guest: {
                      name: guestName || undefined,
                      email: guestEmail || undefined,
                    },
                  })
                }}
              >
                Продолжить
              </Button>
            </Group>
          </Stack>
        </Card>
      </div>
    </Container>
  )
}

export default BookingPage
