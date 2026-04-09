import { useMachine } from '@xstate/react'
import { gameMachine } from './gameMachine'
import { VideoPlayer } from './VideoPlayer'
import { ChoiceOverlay } from './ChoiceOverlay'
import { TitleScreen } from './TitleScreen'
import { EndScreen } from './EndScreen'

function App() {
  const [snapshot, send] = useMachine(gameMachine)
  const { context } = snapshot
  const state = snapshot.value as string

  const isPlaying = state === 'playingIntro' || state === 'choosingBranch' || state === 'playingBranch'

  return (
    <div className="app">
      <div className="cinema">
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

          {/* Choice overlay */}
          {context.showChoices && state === 'choosingBranch' && (
            <ChoiceOverlay
              onChoose={(choice) => send({ type: 'CHOOSE', choice })}
            />
          )}

          {/* Title screen */}
          {state === 'title' && (
            <TitleScreen onStart={() => send({ type: 'START' })} />
          )}

          {/* End screen */}
          {state === 'ended' && (
            <EndScreen
              choice={context.choiceMade}
              onRestart={() => send({ type: 'RESTART' })}
            />
          )}

          {/* Cinema frame overlay */}
          <div className="cinema__frame" />
        </div>
      </div>

      {/* State debug indicator */}
      <div className="debug-bar">
        <span className="debug-bar__state">{state}</span>
        <span className="debug-bar__video">{context.currentVideo}.mp4</span>
      </div>
    </div>
  )
}

export default App
