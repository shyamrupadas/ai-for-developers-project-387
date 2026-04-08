import {
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '../api/client'

function EventTypeCatalogPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: publicApi.listEventTypes,
  })
  const eventTypes = data ?? []

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Card withBorder radius="lg" padding="xl" className="page-card">
          <Group align="center" gap="md">
            <Avatar radius="xl" size="lg" color="sunset">
              T
            </Avatar>
            <div>
              <Text fw={600}>Tota</Text>
              <Text c="dimmed" size="sm">
                Host
              </Text>
            </div>
          </Group>
          <Title order={2} mt="md">
            Выберите тип события
          </Title>
          <Text c="dimmed">
            Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.
          </Text>
        </Card>

        {isLoading ? (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Skeleton height={120} radius="lg" />
            <Skeleton height={120} radius="lg" />
          </SimpleGrid>
        ) : null}

        {isError ? (
          <Card withBorder radius="lg" padding="xl" className="soft-card">
            <Text fw={600}>Не удалось загрузить типы событий</Text>
            <Text c="dimmed">Проверьте доступность API и повторите попытку.</Text>
          </Card>
        ) : null}

        {!isLoading && !isError ? (
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {eventTypes.map((item) => (
              <Card
                key={item.id}
                withBorder
                radius="lg"
                padding="lg"
                className="soft-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/book/${item.id}`)}
              >
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={600}>{item.title}</Text>
                    <Text c="dimmed" size="sm">
                      {item.description || 'Описание скоро появится.'}
                    </Text>
                  </div>
                  <Badge variant="light" color="sunset">
                    {item.durationMinutes} мин
                  </Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        ) : null}
      </Stack>
    </Container>
  )
}

export default EventTypeCatalogPage
