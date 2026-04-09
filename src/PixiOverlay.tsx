import { useEffect, useRef, useCallback } from 'react'
import { Application, Graphics, Container, Ticker } from 'pixi.js'

interface Particle {
  gfx: Graphics
  vx: number
  vy: number
  life: number
  maxLife: number
  scale: number
}

export function usePixiBurst() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const readyRef = useRef(false)
  const containerRef = useRef<Container | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let destroyed = false
    const app = new Application()
    appRef.current = app

    const init = async () => {
      try {
        await app.init({
          backgroundAlpha: 0,
          resizeTo: wrapper,
          antialias: true,
        })
      } catch {
        return
      }

      if (destroyed) {
        app.destroy(true)
        return
      }

      wrapper.appendChild(app.canvas)

      const pc = new Container()
      app.stage.addChild(pc)
      containerRef.current = pc

      app.ticker.add(() => {
        const toRemove: number[] = []
        particlesRef.current.forEach((p, i) => {
          p.life -= Ticker.shared.deltaMS / 1000
          if (p.life <= 0) {
            toRemove.push(i)
            return
          }
          const progress = 1 - p.life / p.maxLife
          p.gfx.x += p.vx * Ticker.shared.deltaMS / 16
          p.gfx.y += p.vy * Ticker.shared.deltaMS / 16
          p.vy += 0.15
          p.gfx.alpha = 1 - progress * progress
          p.gfx.scale.set(p.scale * (1 - progress * 0.5))
        })

        for (let i = toRemove.length - 1; i >= 0; i--) {
          const idx = toRemove[i]
          pc.removeChild(particlesRef.current[idx].gfx)
          particlesRef.current[idx].gfx.destroy()
          particlesRef.current.splice(idx, 1)
        }
      })

      readyRef.current = true
    }

    init()

    return () => {
      destroyed = true
      readyRef.current = false
      containerRef.current = null
      particlesRef.current = []
      try { app.destroy(true, { children: true }) } catch { /* noop */ }
      appRef.current = null
    }
  }, [])

  const burst = useCallback((xPercent: number, yPercent: number) => {
    const app = appRef.current
    const pc = containerRef.current
    if (!app || !pc || !readyRef.current) return

    const cx = (xPercent / 100) * app.screen.width
    const cy = (yPercent / 100) * app.screen.height

    const colors = [0xe94560, 0xff6b81, 0xffd700, 0x00d4ff, 0xffffff]
    const count = 40

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 2 + Math.random() * 5
      const size = 2 + Math.random() * 4
      const life = 0.6 + Math.random() * 0.8

      const gfx = new Graphics()
      const color = colors[Math.floor(Math.random() * colors.length)]
      gfx.circle(0, 0, size).fill({ color })
      gfx.x = cx
      gfx.y = cy

      pc.addChild(gfx)
      particlesRef.current.push({
        gfx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        scale: 1,
      })
    }

    // Ring burst
    const ring = new Graphics()
    ring.circle(0, 0, 10).stroke({ color: 0xe94560, width: 2, alpha: 0.8 })
    ring.x = cx
    ring.y = cy
    pc.addChild(ring)

    const ringLife = { t: 0 }
    const ringTicker = () => {
      ringLife.t += Ticker.shared.deltaMS / 1000
      const progress = ringLife.t / 0.5
      if (progress >= 1) {
        pc.removeChild(ring)
        ring.destroy()
        app.ticker.remove(ringTicker)
        return
      }
      ring.scale.set(1 + progress * 4)
      ring.alpha = 1 - progress
    }
    app.ticker.add(ringTicker)
  }, [])

  const burstFail = useCallback((xPercent: number, yPercent: number) => {
    const app = appRef.current
    const pc = containerRef.current
    if (!app || !pc || !readyRef.current) return

    const cx = (xPercent / 100) * app.screen.width
    const cy = (yPercent / 100) * app.screen.height

    // Red/dark shards falling down
    const colors = [0xff2244, 0x991133, 0x660022, 0x442222]
    const count = 20

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8
      const speed = 1 + Math.random() * 3
      const size = 2 + Math.random() * 3
      const life = 0.4 + Math.random() * 0.5

      const gfx = new Graphics()
      const color = colors[Math.floor(Math.random() * colors.length)]
      gfx.rect(-size / 2, -size / 2, size, size).fill({ color })
      gfx.rotation = Math.random() * Math.PI
      gfx.x = cx
      gfx.y = cy

      pc.addChild(gfx)
      particlesRef.current.push({
        gfx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 2,
        life,
        maxLife: life,
        scale: 1,
      })
    }

    // Red X flash
    const xMark = new Graphics()
    const s = 16
    xMark.moveTo(-s, -s).lineTo(s, s).stroke({ color: 0xff2244, width: 4, alpha: 1 })
    xMark.moveTo(s, -s).lineTo(-s, s).stroke({ color: 0xff2244, width: 4, alpha: 1 })
    xMark.x = cx
    xMark.y = cy
    pc.addChild(xMark)

    const xLife = { t: 0 }
    const xTicker = () => {
      xLife.t += Ticker.shared.deltaMS / 1000
      const progress = xLife.t / 0.6
      if (progress >= 1) {
        pc.removeChild(xMark)
        xMark.destroy()
        app.ticker.remove(xTicker)
        return
      }
      xMark.alpha = 1 - progress
      xMark.scale.set(1 + progress * 0.5)
    }
    app.ticker.add(xTicker)
  }, [])

  const PixiCanvas = useCallback(() => (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    />
  ), [])

  return { burst, burstFail, PixiCanvas }
}
