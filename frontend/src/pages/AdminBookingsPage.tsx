import {
  Badge,
  Card,
  Container,
  Group,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api/client'
import { formatDate, formatTimeRange } from '../utils/datetime'

function AdminBookingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => adminApi.listBookings(),
  })
  const bookings = data ?? []

  return (
    <Container size="lg">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Предстоящие встречи</Title>
        <Badge variant="light" color="sunset">
          Админка
        </Badge>
      </Group>

      <Card withBorder radius="lg" padding="lg" className="page-card">
        {isLoading ? <Text>Загрузка списка...</Text> : null}
        {isError ? (
          <Text c="dimmed">Не удалось получить список бронирований.</Text>
        ) : null}
        {!isLoading && !isError ? (
          <Table.ScrollContainer minWidth={520}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Дата</Table.Th>
                  <Table.Th>Время</Table.Th>
                  <Table.Th>Тип события</Table.Th>
                  <Table.Th>Гость</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {bookings.map((booking) => (
                  <Table.Tr key={booking.id}>
                    <Table.Td>{formatDate(booking.startAt)}</Table.Td>
                    <Table.Td>
                      {formatTimeRange(booking.startAt, booking.endAt)}
                    </Table.Td>
                    <Table.Td>{booking.eventType.title}</Table.Td>
                    <Table.Td>
                      {booking.guest?.name || booking.guest?.email || 'Гость'}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
        {!isLoading && !isError && bookings.length === 0 ? (
          <Text c="dimmed">Пока нет бронирований.</Text>
        ) : null}
      </Card>
    </Container>
  )
}

export default AdminBookingsPage
