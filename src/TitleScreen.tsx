interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="title-screen">
      <div className="title-screen__content">
        <div className="title-screen__badge">FMV EXPERIENCE</div>
        <h1 className="title-screen__title">
          <span className="title-screen__title-line">The</span>
          <span className="title-screen__title-line title-screen__title-line--accent">Decision</span>
        </h1>
        <p className="title-screen__subtitle">
          Every choice matters. Every path leads somewhere different.
        </p>
        <button className="title-screen__play" onClick={onStart}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <polygon points="6,3 20,12 6,21" />
          </svg>
          <span>Play</span>
        </button>
      </div>
      <div className="title-screen__vignette" />
    </div>
  )
}
