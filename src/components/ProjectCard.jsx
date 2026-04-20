import { useState, useEffect, useRef } from 'react'

export default function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-hover="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '48px clamp(24px, 6vw, 60px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
        background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
      }}
    >
      {/* Accent line bên trái */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: hovered ? 3 : 0,
          background: project.color,
          transition: 'width 0.4s ease',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: project.color,
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              {project.category}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
              0{project.id}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              transform: hovered ? 'translateX(12px)' : 'translateX(0)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6,
              marginTop: 10,
              maxWidth: 500,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignSelf: 'center' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '6px 14px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow khi hover */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(24px, 6vw, 60px)',
          top: '50%',
          transform: `translateY(-50%) translateX(${hovered ? 0 : -10}px)`,
          opacity: hovered ? 1 : 0,
          transition: 'all 0.4s ease',
          fontSize: 24,
          color: project.color,
        }}
      >
        →
      </div>
    </div>
  )
}
