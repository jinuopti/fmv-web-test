import { setup } from 'xstate'

export type GameEvent =
  | { type: 'START' }
  | { type: 'VIDEO_ENDED' }
  | { type: 'CHOOSE'; choice: 'leave' | 'look' }
  | { type: 'RESTART' }

export type VideoId = 'intro' | 'run' | 'leave' | 'look'

export interface GameContext {
  currentVideo: VideoId
  loop: boolean
  showChoices: boolean
  choiceMade: 'leave' | 'look' | null
}

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
}).createMachine({
  id: 'fmvGame',
  initial: 'title',
  context: {
    currentVideo: 'intro',
    loop: false,
    showChoices: false,
    choiceMade: null,
  },
  states: {
    title: {
      on: {
        START: {
          target: 'playingIntro',
          actions: ({ context }) => {
            context.currentVideo = 'intro'
            context.loop = false
            context.showChoices = false
            context.choiceMade = null
          },
        },
      },
    },
    playingIntro: {
      on: {
        VIDEO_ENDED: {
          target: 'choosingBranch',
          actions: ({ context }) => {
            context.currentVideo = 'run'
            context.loop = true
            context.showChoices = true
          },
        },
      },
    },
    choosingBranch: {
      on: {
        CHOOSE: {
          target: 'playingBranch',
          actions: ({ context, event }) => {
            context.currentVideo = event.choice
            context.loop = false
            context.showChoices = false
            context.choiceMade = event.choice
          },
        },
      },
    },
    playingBranch: {
      on: {
        VIDEO_ENDED: {
          target: 'ended',
        },
      },
    },
    ended: {
      on: {
        RESTART: {
          target: 'title',
          actions: ({ context }) => {
            context.currentVideo = 'intro'
            context.loop = false
            context.showChoices = false
            context.choiceMade = null
          },
        },
      },
    },
  },
})
