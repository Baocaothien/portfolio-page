import { useState, useEffect } from 'react'

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onFinish, 400)
          return 100
        }
        return Math.min(p + Math.random() * 15 + 5, 100)
      })
    }, 80)
    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 40,
        }}
      >
        Loading
      </div>

      <div style={{ fontSize: 'clamp(50px, 10vw, 80px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        {Math.round(progress)}
        <span style={{ color: '#7C3AED' }}>%</span>
      </div>

      <div
        style={{
          width: 200,
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          marginTop: 40,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#7C3AED',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
