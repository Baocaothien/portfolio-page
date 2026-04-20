import { useEffect, useRef } from 'react'

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

    // Tạo sao
    const COUNT = 180
    const stars = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.4 + 0.3,
      alpha:   Math.random(),
      speed:   Math.random() * 0.008 + 0.003,   // tốc độ nhấp nháy
      phase:   Math.random() * Math.PI * 2,      // lệch pha
      // 15% sao có màu tím/cyan nhẹ
      color:   Math.random() < 0.08 ? '#a78bfa'
             : Math.random() < 0.15 ? '#06b6d4'
             : '#ffffff',
    }))

    // Shooting stars
    const shoots = []
    const spawnShoot = () => {
      shoots.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height * 0.5,
        len:   Math.random() * 100 + 60,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      })
    }
    // Spawn định kỳ ngẫu nhiên
    const shootInterval = setInterval(() => {
      if (Math.random() < 0.6) spawnShoot()
    }, 2200)

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 1

      // Vẽ sao thường
      for (const s of stars) {
        const a = (Math.sin(t * s.speed + s.phase) + 1) / 2
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = a * 0.85 + 0.05
        ctx.fill()
      }

      // Vẽ shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]
        ctx.globalAlpha = sh.alpha
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth   = 1.2
        ctx.beginPath()
        ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        )
        ctx.stroke()

        // Gradient head
        const grad = ctx.createLinearGradient(
          sh.x, sh.y,
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        )
        grad.addColorStop(0, `rgba(255,255,255,${sh.alpha})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = grad
        ctx.stroke()

        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        sh.alpha -= 0.018

        if (sh.alpha <= 0) shoots.splice(i, 1)
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(shootInterval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
