interface HotspotProps {
  x: number
  y: number
  onClick: () => void
}

export function Hotspot({ x, y, onClick }: HotspotProps) {
  return (
    <button
      className="hotspot"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      aria-label="Investigate"
    >
      <span className="hotspot__ring hotspot__ring--outer" />
      <span className="hotspot__ring hotspot__ring--inner" />
      <span className="hotspot__core" />
    </button>
  )
}
