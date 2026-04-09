interface ChoiceOverlayProps {
  onChoose: (choice: 'leave' | 'look') => void
}

export function ChoiceOverlay({ onChoose }: ChoiceOverlayProps) {
  return (
    <div className="choice-overlay">
      <div className="choice-container">
        <div className="choice-prompt">어떻게 하시겠습니까?</div>
        <div className="choice-buttons">
          <button
            className="choice-btn choice-btn--leave"
            onClick={() => onChoose('leave')}
          >
            <span className="choice-btn__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="choice-btn__label">떠나기</span>
            <span className="choice-btn__desc">이곳을 벗어나다</span>
          </button>
          <button
            className="choice-btn choice-btn--look"
            onClick={() => onChoose('look')}
          >
            <span className="choice-btn__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <span className="choice-btn__label">살펴보기</span>
            <span className="choice-btn__desc">주변을 조사하다</span>
          </button>
        </div>
      </div>
    </div>
  )
}
