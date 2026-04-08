import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { DateInput, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { adminApi, type ApiError } from '../api/client'

type FormValues = {
  date: Date | null
  time: string
  durationMinutes: number
}

function AdminSlotsPage() {
  const form = useForm<FormValues>({
    initialValues: {
      date: new Date(),
      time: '09:00',
      durationMinutes: 30,
    },
  })

  const createMutation = useMutation({
    mutationFn: adminApi.createSlot,
    onSuccess: () => {
      notifications.show({
        title: 'Слот создан',
        message: 'Слот добавлен в расписание владельца.',
      })
    },
    onError: (error: ApiError) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      })
    },
  })

  return (
    <Container size="lg">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Слоты владельца</Title>
        <Badge variant="light" color="sunset">
          Админка
        </Badge>
      </Group>

      <Card withBorder radius="lg" padding="lg" className="page-card">
        <Title order={4} mb="sm">
          Добавить слот
        </Title>
        <Text c="dimmed" size="sm" mb="md">
          Доступность владельца: 09:00 – 18:00 по времени приложения.
        </Text>
        <form
          onSubmit={form.onSubmit((values) => {
            if (!values.date) return
            const [hours, minutes] = values.time.split(':').map(Number)
            const startAt = dayjs(values.date)
              .hour(hours || 0)
              .minute(minutes || 0)
              .second(0)
              .millisecond(0)
              .toISOString()

            createMutation.mutate({
              startAt,
              durationMinutes: values.durationMinutes,
            })
          })}
        >
          <Stack>
            <DateInput
              label="Дата"
              placeholder="Выберите дату"
              value={form.values.date}
              onChange={(value) =>
                form.setFieldValue('date', value ? dayjs(value).toDate() : null)
              }
              required
            />
            <TimeInput
              label="Время начала"
              value={form.values.time}
              onChange={(event) =>
                form.setFieldValue('time', event.currentTarget.value)
              }
              required
            />
            <NumberInput
              label="Длительность, минут"
              min={10}
              max={180}
              step={5}
              required
              {...form.getInputProps('durationMinutes')}
            />
            <Button type="submit" loading={createMutation.isPending}>
              Создать слот
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  )
}

export default AdminSlotsPage
