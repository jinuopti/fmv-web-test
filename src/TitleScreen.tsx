interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-screen__content">
        <div className="title-screen__badge">FMV 체험</div>
        <h1 className="title-screen__title">
          <span className="title-screen__title-line">WILD WILD</span>
        </h1>
        <p className="title-screen__subtitle">
          모든 선택이 중요합니다. 당신의 결정이 이야기를 바꿉니다.
        </p>
        <button className="title-screen__play" onClick={onStart}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <polygon points="6,3 20,12 6,21" />
          </svg>
          <span>시작하기</span>
        </button>
      </div>
      <div className="title-screen__vignette" />
    </div>
  )
}
