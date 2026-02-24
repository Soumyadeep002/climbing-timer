/**
 * Buzzer-style sound effects for the climbing timer using Web Audio API.
 * No external files needed; works after user interaction (e.g. Start/Stop).
 */

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

/**
 * Buzzer sound: square wave + fast gain pulsing (tremolo) for that classic buzzer feel.
 * @param buzzHz - how fast the buzzer pulses (e.g. 8–15 Hz)
 * @param pulseDepth - 0–1, how much the volume dips (higher = more pronounced buzz)
 */
function buzzer({
  frequency = 440,
  durationMs = 500,
  volume = 0.5,
  attackMs = 20,
  releaseMs = 120,
  buzzHz = 12,
  pulseDepth = 0.6,
} = {}) {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const durationSec = durationMs / 1000
    const attackSec = attackMs / 1000
    const releaseSec = releaseMs / 1000

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const buzzGain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(frequency, now)
    osc.connect(gain)
    gain.connect(buzzGain)
    buzzGain.connect(ctx.destination)

    // Main envelope
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + attackSec)
    gain.gain.setValueAtTime(volume, now + Math.max(attackSec, durationSec - releaseSec))
    gain.gain.linearRampToValueAtTime(0.01, now + durationSec)

    // Buzzer pulse: LFO adds to buzzGain.gain so it oscillates (center ± depth/2)
    const center = 1 - pulseDepth / 2
    const amp = pulseDepth / 2
    buzzGain.gain.setValueAtTime(center, now)
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(buzzHz, now)
    lfoGain.gain.setValueAtTime(amp, now)
    lfo.connect(lfoGain)
    lfoGain.connect(buzzGain.gain)

    osc.start(now)
    lfo.start(now)
    osc.stop(now + durationSec)
    lfo.stop(now + durationSec)
  } catch (_) {
    // Ignore if audio not allowed (e.g. before user gesture)
  }
}

/** When the main timer is started — buzzer "go" */
export function playMainStart() {
  buzzer({
    frequency: 520,
    durationMs: 700,
    volume: 0.5,
    attackMs: 30,
    releaseMs: 180,
    buzzHz: 10,
    pulseDepth: 0.55,
  })
}

/** When the main timer switches to grace phase — urgent double buzzer */
export function playGraceStart() {
  buzzer({
    frequency: 780,
    durationMs: 500,
    volume: 0.48,
    attackMs: 15,
    releaseMs: 150,
    buzzHz: 14,
    pulseDepth: 0.6,
  })
  setTimeout(() => {
    buzzer({
      frequency: 980,
      durationMs: 500,
      volume: 0.46,
      attackMs: 15,
      releaseMs: 160,
      buzzHz: 14,
      pulseDepth: 0.6,
    })
  }, 280)
}

/** When the timer is stopped — low buzzer "end" */
export function playTimerStop() {
  buzzer({
    frequency: 260,
    durationMs: 550,
    volume: 0.5,
    attackMs: 25,
    releaseMs: 200,
    buzzHz: 8,
    pulseDepth: 0.5,
  })
}

/** When the main timer enters the last 25% of time — warning buzzer */
export function playLastQuarterWarning() {
  buzzer({
    frequency: 640,
    durationMs: 450,
    volume: 0.48,
    attackMs: 20,
    releaseMs: 120,
    buzzHz: 12,
    pulseDepth: 0.58,
  })
}

/** When the main timer starts again after grace (loop back to main) */
export function playMainLoopStart() {
  buzzer({
    frequency: 440,
    durationMs: 500,
    volume: 0.48,
    attackMs: 25,
    releaseMs: 150,
    buzzHz: 11,
    pulseDepth: 0.52,
  })
}
