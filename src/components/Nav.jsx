import { useState, useEffect } from 'react'

export default function Nav({ activeSection, sections = ['home', 'about', 'work', 'experience', 'contact'] }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '14px clamp(16px, 4vw, 40px)' : '22px clamp(16px, 4vw, 40px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.4s ease',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        background: scrolled ? 'rgba(10,10,10,0.7)' : 'transparent',
      }}
    >
      {/* Logo */}
      <a
        href="#home"
        data-hover="true"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: -0.5,
        }}
      >
        DANIEL<span style={{ color: '#7C3AED' }}>.</span>
      </a>

      {/* Desktop links */}
      <div
        style={{
          display: 'flex',
          gap: 32,
        }}
        className="nav-links"
      >
        {sections.map((s) => (
          <a
            key={s}
            href={`#${s}`}
            data-hover="true"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: activeSection === s ? '#7C3AED' : 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: 2,
              transition: 'color 0.3s',
            }}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          flexDirection: 'column',
          gap: 5,
          padding: 8,
        }}
      >
        <span style={{ width: 24, height: 2, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
        <span style={{ width: 24, height: 2, background: '#fff', display: 'block', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 24, height: 2, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.95)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            zIndex: 99,
          }}
        >
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: activeSection === s ? '#7C3AED' : '#fff',
                textTransform: 'uppercase',
                letterSpacing: 4,
              }}
            >
              {s}
            </a>
          ))}
        </div>
      )}

      {/* Responsive CSS injection */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
