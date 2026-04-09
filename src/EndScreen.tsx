interface EndScreenProps {
  choice: 'leave' | 'look' | null
  onRestart: () => void
}

export function EndScreen({ choice, onRestart }: EndScreenProps) {
  const messages: Record<string, { title: string; desc: string }> = {
    leave: {
      title: '떠났습니다',
      desc: '당신은 떠나기로 했습니다. 어떤 문은 영원히 닫힙니다.',
    },
    look: {
      title: '살펴보았습니다',
      desc: '호기심이 당신을 더 깊이 이끌었습니다. 무엇을 발견했나요?',
    },
  }

  const msg = choice ? messages[choice] : { title: '끝', desc: '' }

  return (
    <div className="end-screen">
      <div className="end-screen__content">
        <div className="end-screen__badge">종료</div>
        <h2 className="end-screen__title">{msg.title}</h2>
        <p className="end-screen__desc">{msg.desc}</p>
        <button className="end-screen__restart" onClick={onRestart}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>다시 플레이</span>
        </button>
      </div>
    </div>
  )
}
