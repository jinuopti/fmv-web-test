import { useCallback, useEffect, useRef, useState } from 'react'

interface QtePrompt {
  x: number
  y: number
  delay: number
  window: number
}

const QTE_SEQUENCE: QtePrompt[] = [
  { x: 25, y: 40, delay: 1500, window: 2000 },
  { x: 60, y: 55, delay: 1000, window: 1800 },
  { x: 42, y: 35, delay: 800,  window: 1500 },
]

type PromptState = 'waiting' | 'active' | 'success' | 'fail'
type DotState = 'idle' | 'active' | 'done' | 'fail'

interface QteOverlayProps {
  onComplete: () => void
  onHit: (x: number, y: number) => void
  onFail: (x: number, y: number) => void
}

export function QteOverlay({ onComplete, onHit, onFail }: QteOverlayProps) {
  const [step, setStep] = useState(-1)
  const [promptState, setPromptState] = useState<PromptState>('waiting')
  const [progress, setProgress] = useState(1)
  const [successes, setSuccesses] = useState(0)
  const [dotStates, setDotStates] = useState<DotState[]>(QTE_SEQUENCE.map(() => 'idle'))
  const [allDone, setAllDone] = useState(false)
  const [round, setRound] = useState(0)
  const timerRef = useRef<number>(0)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef(0)

  useEffect(() => {
    setStep(-1)
    setSuccesses(0)
    setPromptState('waiting')
    setDotStates(QTE_SEQUENCE.map(() => 'idle'))
    setAllDone(false)

    const t = window.setTimeout(() => setStep(0), QTE_SEQUENCE[0].delay)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(timerRef.current)
      cancelAnimationFrame(frameRef.current)
    }
  }, [round])

  useEffect(() => {
    if (step < 0 || step >= QTE_SEQUENCE.length) return

    const prompt = QTE_SEQUENCE[step]
    setPromptState('active')
    setProgress(1)
    startTimeRef.current = performance.now()

    setDotStates(prev => prev.map((s, i) => i === step ? 'active' : s))

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current
      const p = Math.max(0, 1 - elapsed / prompt.window)
      setProgress(p)
      if (p > 0) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)

    timerRef.current = window.setTimeout(() => {
      cancelAnimationFrame(frameRef.current)
      handleMiss()
    }, prompt.window)

    return () => {
      window.clearTimeout(timerRef.current)
      cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const handleMiss = useCallback(() => {
    if (step < 0 || step >= QTE_SEQUENCE.length) return
    const prompt = QTE_SEQUENCE[step]
    setPromptState('fail')
    setDotStates(prev => prev.map((s, i) => i === step ? 'fail' : s))
    onFail(prompt.x, prompt.y)

    window.setTimeout(() => setRound(r => r + 1), 1500)
  }, [step, onFail])

  const handleTap = useCallback(() => {
    if (promptState !== 'active' || step < 0) return

    window.clearTimeout(timerRef.current)
    cancelAnimationFrame(frameRef.current)

    const prompt = QTE_SEQUENCE[step]
    const newSuccesses = successes + 1

    setPromptState('success')
    setSuccesses(newSuccesses)
    setDotStates(prev => prev.map((s, i) => i === step ? 'done' : s))
    onHit(prompt.x, prompt.y)

    if (newSuccesses >= QTE_SEQUENCE.length) {
      setAllDone(true)
      return
    }

    const nextPrompt = QTE_SEQUENCE[step + 1]
    window.setTimeout(() => setStep(step + 1), nextPrompt.delay)
  }, [promptState, step, successes, onHit])

  if (step < 0 && !allDone) return null

  const prompt = step >= 0 && step < QTE_SEQUENCE.length ? QTE_SEQUENCE[step] : null

  return (
    <div className="qte-overlay">
      {/* Score dots */}
      <div className="qte-score">
        {dotStates.map((ds, i) => (
          <span key={i} className={`qte-score__dot qte-score__dot--${ds}`} />
        ))}
      </div>

      {/* QTE button */}
      {prompt && promptState !== 'waiting' && !allDone && (
        <button
          className={`qte-btn qte-btn--${promptState}`}
          style={{ left: `${prompt.x}%`, top: `${prompt.y}%` }}
          onClick={handleTap}
          disabled={promptState !== 'active'}
        >
          {/* Outer shrinking ring */}
          <svg className="qte-btn__ring" viewBox="0 0 100 100">
            <circle
              className="qte-btn__ring-bg"
              cx="50" cy="50" r="46"
              fill="none"
              strokeWidth="3"
            />
            <circle
              className="qte-btn__ring-fg"
              cx="50" cy="50" r="46"
              fill="none"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress)}`}
              strokeLinecap="round"
              style={{ transition: 'none' }}
            />
          </svg>
          <span className="qte-btn__inner">
            {promptState === 'success' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : promptState === 'fail' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <span className="qte-btn__tap" />
            )}
          </span>
        </button>
      )}

      {/* Fail message */}
      {promptState === 'fail' && (
        <div className="qte-message qte-message--fail">실패!</div>
      )}

      {/* Success popup */}
      {allDone && (
        <div className="qte-success-popup">
          <div className="qte-success-popup__glow" />
          <div className="qte-success-popup__content">
            <div className="qte-success-popup__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="qte-success-popup__title">성공!</div>
            <div className="qte-success-popup__desc">모든 타이밍에 성공했습니다</div>
            <button className="qte-success-popup__btn" onClick={onComplete}>
              다음으로
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
