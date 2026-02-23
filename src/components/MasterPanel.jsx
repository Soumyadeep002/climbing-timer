import { Box, Typography, Button, Paper } from '@mui/material'

export default function MasterPanel({ connectedA, connectedB, timerARef, timerBRef }) {
  const hasConnected = connectedA || connectedB

  const handleStart = () => {
    if (connectedA) timerARef.current?.start()
    if (connectedB) timerBRef.current?.start()
  }

  const handleStop = () => {
    if (connectedA) timerARef.current?.stop()
    if (connectedB) timerBRef.current?.stop()
  }

  const handleReset = () => {
    if (connectedA) timerARef.current?.reset()
    if (connectedB) timerBRef.current?.reset()
  }

  const handleAddMinute = () => {
    if (connectedA) timerARef.current?.addMinute?.()
    if (connectedB) timerBRef.current?.addMinute?.()
  }

  const handleAddGrace = () => {
    if (connectedA) timerARef.current?.addGrace?.()
    if (connectedB) timerBRef.current?.addGrace?.()
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        minWidth: 320,
        backgroundColor: 'background.default',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 1.5 }}>
        Master panel
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        {hasConnected
          ? `Controlling: ${[connectedA && 'Route A', connectedB && 'Route B'].filter(Boolean).join(', ')}`
          : 'Connect a timer with the 4th button to control it here.'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={handleStart} disabled={!hasConnected} size="small">
          Start
        </Button>
        <Button variant="outlined" color="warning" onClick={handleStop} disabled={!hasConnected} size="small">
          Stop
        </Button>
        <Button variant="outlined" color="error" onClick={handleReset} disabled={!hasConnected} size="small">
          Reset
        </Button>
        <Button variant="outlined" color="primary" onClick={handleAddMinute} disabled={!hasConnected} size="small">
          +1 min
        </Button>
        <Button variant="outlined" color="warning" onClick={handleAddGrace} disabled={!hasConnected} size="small">
          +1 sec grace
        </Button>
      </Box>
    </Paper>
  )
}
