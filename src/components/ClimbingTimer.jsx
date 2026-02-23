import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { formatTime } from '../utils/formatTime'

const BUTTONS = [
  { id: 'startStop', label: 'Start', color: 'success' },
  { id: 'addMinute', label: '+1 min', color: 'primary' },
  { id: 'addGrace', label: '+1 sec grace', color: 'warning' },
  { id: 'reset', label: 'Reset', color: 'error' },
  { id: 'master', label: 'Master', color: 'inherit' },
]

const ClimbingTimer = forwardRef(function ClimbingTimer(
  { routeLabel = 'Route', connectedToMaster = false, onConnectToggle },
  ref
) {
  const [initialMinutes, setInitialMinutes] = useState(4)
  const [graceSeconds, setGraceSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [displaySeconds, setDisplaySeconds] = useState(4 * 60)
  const [inGrace, setInGrace] = useState(false)
  const startTimeRef = useRef(0)
  const pausedElapsedRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const mainDuration = initialMinutes * 60
    const cycleLength = mainDuration + graceSeconds || 1
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const positionInCycle = elapsed % cycleLength
      if (positionInCycle < mainDuration) {
        // Main phase: countdown main time (e.g. 4:00 -> 0:00)
        setDisplaySeconds(Math.max(0, mainDuration - positionInCycle))
        setInGrace(false)
      } else {
        // Grace phase: countdown grace time (e.g. 0:10 -> 0:00), then loop back to main
        setDisplaySeconds(Math.max(0, cycleLength - positionInCycle))
        setInGrace(true)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [running, initialMinutes, graceSeconds])

  const handleStartStop = () => {
    if (running) {
      pausedElapsedRef.current = (Date.now() - startTimeRef.current) / 1000
      setRunning(false)
      return
    }
    startTimeRef.current =
      pausedElapsedRef.current > 0
        ? Date.now() - pausedElapsedRef.current * 1000
        : Date.now()
    setRunning(true)
  }

  const handleAddMinute = () => {
    if (running) return
    setInitialMinutes((m) => {
      const newM = m + 1
      if (pausedElapsedRef.current === 0) setDisplaySeconds(newM * 60)
      return newM
    })
  }

  const handleAddGrace = () => {
    if (running) return
    setGraceSeconds((s) => s + 1)
  }

  const handleReset = () => {
    setRunning(false)
    setInitialMinutes(0)
    setGraceSeconds(0)
    setDisplaySeconds(0)
    setInGrace(false)
    pausedElapsedRef.current = 0
  }

  useImperativeHandle(ref, () => ({
    start: () => {
      if (!running) handleStartStop()
    },
    stop: () => {
      if (running) handleStartStop()
    },
    reset: () => handleReset(),
    addMinute: () => handleAddMinute(),
    addGrace: () => handleAddGrace(),
  }), [running])

  const handleMasterToggle = () => onConnectToggle?.()

  const handlers = {
    startStop: handleStartStop,
    addMinute: handleAddMinute,
    addGrace: handleAddGrace,
    reset: handleReset,
    master: handleMasterToggle,
  }

  const displayValue = displaySeconds

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 280,
        backgroundColor: 'background.paper',
        border: '2px solid',
        borderColor: inGrace ? 'warning.main' : 'divider',
        borderRadius: 3,
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ mb: 1 }}>
        {routeLabel}
      </Typography>
      <Box
        className="digital-timer"
        sx={{
          fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
          fontSize: { xs: '3rem', sm: '4rem' },
          fontWeight: 700,
          letterSpacing: 4,
          color: inGrace ? 'warning.main' : 'text.primary',
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          mb: 0.5,
          lineHeight: 1.2,
        }}
      >
        {formatTime(displayValue)}
      </Box>
      {!running && graceSeconds > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Grace: {graceSeconds}s
        </Typography>
      )}
      {inGrace && (
        <Typography color="warning.main" variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Grace
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
        {BUTTONS.map(({ id, label, color }) => (
          <Button
            key={id}
            variant={id === 'startStop' ? 'contained' : 'outlined'}
            color={id === 'master' && connectedToMaster ? 'success' : color}
            onClick={handlers[id]}
            disabled={
              connectedToMaster && id !== 'master'
                ? true
                : id === 'addMinute' || id === 'addGrace'
                  ? running
                  : false
            }
            size="medium"
          >
            {id === 'startStop' ? (running ? 'Stop' : 'Start') : id === 'master' ? (connectedToMaster ? 'Disconnect' : 'Connect') : label}
          </Button>
        ))}
      </Box>
    </Paper>
  )
})

export default ClimbingTimer
