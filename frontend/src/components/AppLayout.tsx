import { Container, Group, Text } from '@mantine/core'
import { IconCalendar } from '@tabler/icons-react'
import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Container size="lg" className="header-inner">
          <NavLink to="/" className="logo-link">
            <Group gap={8}>
              <IconCalendar size={20} color="#ff8b3d" stroke={2.2} />
              <Text fw={700}>Calendar</Text>
            </Group>
          </NavLink>
          <Group gap={10}>
            <NavLink
              to="/book"
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
            >
              Записаться
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
            >
              Админка
            </NavLink>
          </Group>
        </Container>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
