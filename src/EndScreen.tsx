interface EndScreenProps {
  choice: 'leave' | 'look' | null
  onRestart: () => void
}

export function EndScreen({ choice, onRestart }: EndScreenProps) {
  const messages: Record<string, { title: string; desc: string }> = {
    leave: {
      title: 'You Left',
      desc: 'You chose to walk away. Some doors close forever.',
    },
    look: {
      title: 'You Looked',
      desc: 'Curiosity led you deeper. What did you find?',
    },
  }

  const msg = choice ? messages[choice] : { title: 'The End', desc: '' }

  return (
    <div className="end-screen">
      <div className="end-screen__content">
        <div className="end-screen__badge">END</div>
        <h2 className="end-screen__title">{msg.title}</h2>
        <p className="end-screen__desc">{msg.desc}</p>
        <button className="end-screen__restart" onClick={onRestart}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Play Again</span>
        </button>
      </div>
    </div>
  )
}
