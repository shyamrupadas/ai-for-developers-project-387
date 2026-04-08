import { createTheme } from '@mantine/core'

export const theme = createTheme({
  fontFamily: 'Manrope, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Manrope, system-ui, -apple-system, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  primaryColor: 'sunset',
  colors: {
    sunset: [
      '#fff4eb',
      '#ffe6d4',
      '#ffd2b1',
      '#ffbb87',
      '#ffa462',
      '#ff9446',
      '#ff8b3d',
      '#e8752c',
      '#cc6424',
      '#a3521f',
    ],
  },
  other: {
    surface: '#ffffff',
    surfaceMuted: '#f6f8fc',
  },
})
