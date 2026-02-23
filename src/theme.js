import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#646cff',
    },
    secondary: {
      main: '#535bf2',
    },
    background: {
      default: '#242424',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
})

export default theme
