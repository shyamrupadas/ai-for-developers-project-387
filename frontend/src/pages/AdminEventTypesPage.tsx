import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, publicApi, type ApiError } from '../api/client'

type FormValues = {
  title: string
  description: string
  durationMinutes: number
}

function AdminEventTypesPage() {
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      description: '',
      durationMinutes: 30,
    },
  })

  const { data } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: publicApi.listEventTypes,
  })
  const eventTypes = data ?? []

  const createMutation = useMutation({
    mutationFn: adminApi.createEventType,
    onSuccess: () => {
      notifications.show({
        title: 'Готово',
        message: 'Тип события создан.',
      })
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] })
      form.reset()
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
        <Title order={2}>Типы событий</Title>
        <Badge variant="light" color="sunset">
          Админка
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card withBorder radius="lg" padding="lg" className="page-card">
          <Title order={4} mb="sm">
            Новый тип события
          </Title>
          <form
            onSubmit={form.onSubmit((values) => {
              createMutation.mutate({
                title: values.title,
                description: values.description || undefined,
                durationMinutes: values.durationMinutes,
              })
            })}
          >
            <Stack>
              <TextInput
                label="Название"
                placeholder="Встреча 30 минут"
                required
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Описание"
                placeholder="Короткий тип события для бронирования."
                minRows={3}
                {...form.getInputProps('description')}
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
                Создать
              </Button>
            </Stack>
          </form>
        </Card>

        <Card withBorder radius="lg" padding="lg" className="page-card">
          <Title order={4} mb="sm">
            Текущие типы
          </Title>
          <Stack gap="sm">
            {eventTypes.map((item) => (
              <Card key={item.id} withBorder radius="md" padding="sm">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={600}>{item.title}</Text>
                    <Text size="sm" c="dimmed">
                      {item.description || 'Описание не задано.'}
                    </Text>
                  </div>
                  <Badge variant="light" color="sunset">
                    {item.durationMinutes} мин
                  </Badge>
                </Group>
              </Card>
            ))}
            {eventTypes.length === 0 ? (
              <Text c="dimmed">Типы событий пока не созданы.</Text>
            ) : null}
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  )
}

export default AdminEventTypesPage
