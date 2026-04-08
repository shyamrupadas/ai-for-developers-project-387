import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import AdminBookingsPage from './pages/AdminBookingsPage'
import AdminEventTypesPage from './pages/AdminEventTypesPage'
import AdminSlotsPage from './pages/AdminSlotsPage'
import BookingPage from './pages/BookingPage'
import EventTypeCatalogPage from './pages/EventTypeCatalogPage'
import HomePage from './pages/HomePage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/book', element: <EventTypeCatalogPage /> },
      { path: '/book/:eventTypeId', element: <BookingPage /> },
      { path: '/admin', element: <AdminBookingsPage /> },
      { path: '/admin/event-types', element: <AdminEventTypesPage /> },
      { path: '/admin/slots', element: <AdminSlotsPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
