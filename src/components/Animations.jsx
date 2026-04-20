import { useState, useEffect, useRef } from 'react'

/* ── Text reveal khi scroll vào viewport ── */
export function RevealText({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'hidden', display: 'block' }}>
      <span
        style={{
          display: 'block',
          transform: visible ? 'translateY(0)' : 'translateY(105%)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.9s ease ${delay}s`,
        }}
      >
        {children}
      </span>
    </Tag>
  )
}

/* ── Parallax wrapper ── */
export function Parallax({ children, speed = 0.5, style = {} }) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const center = rect.top + rect.height / 2 - window.innerHeight / 2
        setOffset(center * speed * -0.15)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} style={{ ...style, transform: `translateY(${offset}px)`, willChange: 'transform' }}>
      {children}
    </div>
  )
}

/* ── Magnetic button ── */
export function MagneticButton({ children, onClick, style = {} }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    setPos({ x, y })
  }

  return (
    <button
      ref={ref}
      data-hover="true"
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'transparent',
        color: '#fff',
        padding: '14px 36px',
        borderRadius: 999,
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ── Marquee chạy ngang ── */
export function Marquee({ items, speed = 30 }) {
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '30px 0' }}>
      <div style={{ display: 'inline-block', animation: `marquee ${speed}s linear infinite` }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
              marginRight: 60,
              userSelect: 'none',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
