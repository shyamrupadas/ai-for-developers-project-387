import { Badge, Button, Container, List, Paper, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight, IconCheck } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <Container size="lg">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
        }}
      >
        <Stack gap="md">
          <Badge
            variant="light"
            color="sunset"
            size="lg"
            radius="xl"
            style={{ alignSelf: 'flex-start' }}
          >
            Быстрая запись на звонок
          </Badge>
          <Title order={1} style={{ fontSize: '48px', lineHeight: 1.1 }}>
            Calendar
          </Title>
          <Text c="dimmed" style={{ maxWidth: 420 }}>
            Забронируйте встречу за минуту: выберите тип события и удобное время.
          </Text>
          <Button
            component={Link}
            to="/book"
            size="md"
            radius="md"
            rightSection={<IconArrowRight size={18} />}
            style={{ alignSelf: 'flex-start' }}
          >
            Записаться
          </Button>
        </Stack>

        <Paper p="xl" className="page-card">
          <Stack gap="md">
            <Title order={3}>Возможности</Title>
            <List
              spacing="sm"
              icon={<IconCheck size={16} color="#ff8b3d" />}
            >
              <List.Item>Выбор типа события и удобного времени для встречи.</List.Item>
              <List.Item>
                Быстрое бронирование с подтверждением и дополнительными заметками.
              </List.Item>
              <List.Item>
                Управление типами встреч и просмотр предстоящих записей в админке.
              </List.Item>
            </List>
          </Stack>
        </Paper>
      </div>
    </Container>
  )
}

export default HomePage
