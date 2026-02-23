import { useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import ClimbingTimer from './components/ClimbingTimer'
import MasterPanel from './components/MasterPanel'
import './App.css'

export default function App() {
  const [connectedA, setConnectedA] = useState(false)
  const [connectedB, setConnectedB] = useState(false)
  const timerARef = useRef(null)
  const timerBRef = useRef(null)

  return (
    <Box
      className="app-root"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Typography variant="h5" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
        Sports Climbing — Competition Timer
      </Typography>
      <MasterPanel
        connectedA={connectedA}
        connectedB={connectedB}
        timerARef={timerARef}
        timerBRef={timerBRef}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ClimbingTimer
          ref={timerARef}
          routeLabel="Route A"
          connectedToMaster={connectedA}
          onConnectToggle={() => setConnectedA((a) => !a)}
        />
        <ClimbingTimer
          ref={timerBRef}
          routeLabel="Route B"
          connectedToMaster={connectedB}
          onConnectToggle={() => setConnectedB((b) => !b)}
        />
      </Box>
    </Box>
  )
}
