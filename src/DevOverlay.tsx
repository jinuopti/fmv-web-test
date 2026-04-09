import { useCallback, useEffect, useRef, useState } from 'react'

interface Pin {
  id: number
  x: number
  y: number
}

export function DevOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [pins, setPins] = useState<Pin[]>([])
  const [copied, setCopied] = useState(false)
  const nextId = useRef(1)

  const toPercent = useCallback((e: React.MouseEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10,
      y: Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10,
    }
  }, [])

  const handleMove = useCallback((e: React.MouseEvent) => {
    setPos(toPercent(e))
  }, [toPercent])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const p = toPercent(e)
    const pin: Pin = { id: nextId.current++, ...p }
    setPins(prev => [...prev, pin])

    const text = `{ "x": ${p.x}, "y": ${p.y} }`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
    console.log(`[DevOverlay] pin #${pin.id}`, text)
  }, [toPercent])

  const handleClearAll = useCallback(() => {
    setPins([])
  }, [])

  const handleExport = useCallback(() => {
    const data = pins.map(({ x, y }, i) => ({ id: `hotspot_${i + 1}`, x, y }))
    const json = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(json)
    console.log('[DevOverlay] exported:', json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }, [pins])

  // Undo last pin with Ctrl+Z
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        setPins(prev => prev.slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={overlayRef}
      className="dev-overlay"
      onMouseMove={handleMove}
      onClick={handleClick}
    >
      {/* Crosshair */}
      <div className="dev-crosshair-h" style={{ top: `${pos.y}%` }} />
      <div className="dev-crosshair-v" style={{ left: `${pos.x}%` }} />

      {/* Cursor coordinate */}
      <div
        className="dev-cursor-label"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        {pos.x}%, {pos.y}%
      </div>

      {/* Pins */}
      {pins.map(pin => (
        <div
          key={pin.id}
          className="dev-pin"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <span className="dev-pin__dot" />
          <span className="dev-pin__label">{pin.x}, {pin.y}</span>
        </div>
      ))}

      {/* Toolbar */}
      <div className="dev-toolbar">
        <span className="dev-toolbar__badge">DEV</span>
        <span className="dev-toolbar__coord">{pos.x}% , {pos.y}%</span>
        {pins.length > 0 && (
          <>
            <span className="dev-toolbar__sep" />
            <span className="dev-toolbar__pins">{pins.length} pins</span>
            <button className="dev-toolbar__btn" onClick={(e) => { e.stopPropagation(); handleExport() }}>
              Export JSON
            </button>
            <button className="dev-toolbar__btn dev-toolbar__btn--danger" onClick={(e) => { e.stopPropagation(); handleClearAll() }}>
              Clear
            </button>
          </>
        )}
        {copied && <span className="dev-toolbar__copied">Copied!</span>}
      </div>
    </div>
  )
}
