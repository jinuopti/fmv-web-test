import { useCallback, useEffect, useState, useRef } from 'react'
import { useMachine } from '@xstate/react'
import { gameMachine } from './gameMachine'
import { VideoPlayer } from './VideoPlayer'
import { ChoiceOverlay } from './ChoiceOverlay'
import { TitleScreen } from './TitleScreen'
import { EndScreen } from './EndScreen'
import { DevOverlay } from './DevOverlay'
import { QteOverlay } from './QteOverlay'
import { usePixiBurst } from './PixiOverlay'

const isDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('dev')

function App() {
  const [snapshot, send] = useMachine(gameMachine)
  const { context } = snapshot
  const state = snapshot.value as string
  const cinemaRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [devActive, setDevActive] = useState(false)
  const { burst, burstFail, PixiCanvas } = usePixiBurst()

  const isPlaying = state === 'playingIntro' || state === 'choosingBranch' || state === 'playingBranch'
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const enterFullscreenLandscape = useCallback(async () => {
    if (!cinemaRef.current) return
    try {
      await cinemaRef.current.requestFullscreen()
      await screen.orientation.lock('landscape').catch(() => {})
    } catch { /* fullscreen not supported or denied */ }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!cinemaRef.current) return
    if (!document.fullscreenElement) {
      enterFullscreenLandscape()
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [enterFullscreenLandscape])

  useEffect(() => {
    const onChange = () => {
      const fs = !!document.fullscreenElement
      setIsFullscreen(fs)
      if (!fs) {
        screen.orientation.unlock?.()
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  return (
    <div className="app">
      <div className="cinema" ref={cinemaRef}>
        <div className="cinema__screen">
          {/* Video layer */}
          {isPlaying && (
            <VideoPlayer
              videoId={context.currentVideo}
              loop={context.loop}
              onEnded={() => send({ type: 'VIDEO_ENDED' })}
              playing={isPlaying}
            />
          )}

          {/* QTE on intro */}
          {state === 'playingIntro' && (
            <QteOverlay
              onComplete={() => send({ type: 'QTE_SUCCESS' })}
              onHit={(x, y) => burst(x, y)}
              onFail={(x, y) => burstFail(x, y)}
            />
          )}

          {/* Choice overlay */}
          {context.showChoices && state === 'choosingBranch' && (
            <ChoiceOverlay
              onChoose={(choice) => send({ type: 'CHOOSE', choice })}
            />
          )}

          {/* Title screen */}
          {state === 'title' && (
            <TitleScreen onStart={() => {
              send({ type: 'START' })
              if (isMobile) enterFullscreenLandscape()
            }} />
          )}

          {/* End screen */}
          {state === 'ended' && (
            <EndScreen
              choice={context.choiceMade}
              onRestart={() => send({ type: 'RESTART' })}
            />
          )}

          {/* Fullscreen toggle */}
          {isPlaying && (
            <button
              className={`fullscreen-btn ${isFullscreen ? 'fullscreen-btn--exit' : ''}`}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 8 14 8 18" />
                  <polyline points="20 10 16 10 16 6" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
          )}

          {/* PixiJS particle layer */}
          <PixiCanvas />

          {/* Dev coordinate overlay */}
          {isDev && isPlaying && devActive && <DevOverlay />}

          {/* Cinema frame overlay */}
          <div className="cinema__frame" />
        </div>
      </div>

      {/* Dev control bar — outside cinema, always clickable */}
      {isDev && (
        <div className="dev-bar">
          <span className="dev-bar__badge">DEV</span>
          <span className="dev-bar__sep" />
          <span className="dev-bar__state">{state}</span>
          <span className="dev-bar__video">{context.currentVideo}.mp4</span>
          <span className="dev-bar__sep" />
          <button
            className="dev-bar__btn"
            onClick={() => send({ type: 'DEV_BACK' })}
            disabled={state === 'title'}
          >
            Back
          </button>
          <button
            className={`dev-bar__btn ${devActive ? 'dev-bar__btn--active' : ''}`}
            onClick={() => setDevActive(v => !v)}
          >
            {devActive ? 'Coords ON' : 'Coords OFF'}
          </button>
          <button className="dev-bar__btn" onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit FS' : 'Fullscreen'}
          </button>
        </div>
      )}
    </div>
  )
}

export default App
