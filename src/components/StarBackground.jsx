import { useEffect, useRef } from 'react'

/* Tạo tia sét phân nhánh đệ quy */
function buildLightning(x1, y1, x2, y2, depth, segments = []) {
  if (depth === 0) {
    segments.push([x1, y1, x2, y2])
    return segments
  }
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * 0.35
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 20
  buildLightning(x1, y1, mx, my, depth - 1, segments)
  buildLightning(mx, my, x2, y2, depth - 1, segments)
  // Nhánh phụ
  if (depth === 2 && Math.random() < 0.5) {
    const bx = mx + (Math.random() - 0.5) * 120
    const by = my + Math.random() * 100
    buildLightning(mx, my, bx, by, depth - 2, segments)
  }
  return segments
}

export default function StarBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Raindrops ── */
    const DROPS = 320
    const drops = Array.from({ length: DROPS }, () => ({
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      len:    Math.random() * 18 + 8,
      speed:  Math.random() * 9 + 7,
      alpha:  Math.random() * 0.35 + 0.1,
      width:  Math.random() * 0.8 + 0.3,
    }))

    /* ── Lightning state ── */
    let lightning = null   // { segs, flash, alpha }
    let flashAlpha = 0

    const spawnLightning = () => {
      const startX = Math.random() * canvas.width
      const endX   = startX + (Math.random() - 0.5) * 200
      const segs   = buildLightning(startX, 0, endX, canvas.height * (0.4 + Math.random() * 0.4), 4)
      lightning = { segs, alpha: 1 }
      flashAlpha = 0.18
    }

    // Sét xuất hiện ngẫu nhiên
    let nextBolt = 2000 + Math.random() * 3000
    let lastTime = performance.now()

    const draw = (now) => {
      const dt = now - lastTime
      lastTime = now
      nextBolt -= dt
      if (nextBolt <= 0) {
        spawnLightning()
        nextBolt = 1800 + Math.random() * 4000
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* Flash toàn màn hình */
      if (flashAlpha > 0) {
        ctx.fillStyle = `rgba(160,180,255,${flashAlpha})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        flashAlpha = Math.max(0, flashAlpha - 0.025)
      }

      /* Vẽ mưa */
      const angle = 0.22  // độ nghiêng (radian)
      const dx = Math.sin(angle)
      const dy = Math.cos(angle)

      for (const d of drops) {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - dx * d.len, d.y - dy * d.len)
        ctx.strokeStyle = `rgba(180,210,255,${d.alpha})`
        ctx.lineWidth   = d.width
        ctx.stroke()

        d.x += dx * d.speed
        d.y += dy * d.speed

        if (d.y > canvas.height + 20) {
          d.y = -d.len
          d.x = Math.random() * canvas.width
        }
        if (d.x > canvas.width + 20) {
          d.x = -10
          d.y = Math.random() * canvas.height
        }
      }

      /* Vẽ sét */
      if (lightning && lightning.alpha > 0) {
        const { segs, alpha } = lightning
        for (const [x1, y1, x2, y2] of segs) {
          // Lớp glow ngoài
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(147,100,255,${alpha * 0.3})`
          ctx.lineWidth   = 6
          ctx.shadowColor = '#9364ff'
          ctx.shadowBlur  = 24
          ctx.stroke()

          // Lớp lõi trắng
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(220,210,255,${alpha})`
          ctx.lineWidth   = 1.5
          ctx.shadowColor = '#fff'
          ctx.shadowBlur  = 8
          ctx.stroke()
        }
        ctx.shadowBlur = 0
        lightning.alpha -= 0.045
        if (lightning.alpha <= 0) lightning = null
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    />
  )
}
