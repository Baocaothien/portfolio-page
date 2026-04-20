import { useState, useEffect, useCallback, useRef } from 'react'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import LoadingScreen from './components/LoadingScreen'
import { RevealText, Parallax, MagneticButton, Marquee } from './components/Animations'
import Scene3D from './components/Scene3D'
import StarBackground from './components/StarBackground'

/* ── Data ── */
const SECTIONS = ['home', 'about', 'work', 'experience', 'contact']

const PROJECTS = [
  {
    id: 1,
    title: 'Ticket Tracker',
    category: 'IT Tool',
    description: 'Internal helpdesk ticket management system with dashboard, priority queue, and real-time email notifications.',
    tags: ['React', 'Node.js', 'SQL', 'REST API'],
    color: '#7C3AED',
    accent: 'rgba(124,58,237,0.12)',
    size: 'large',
    year: '2025',
  },
  {
    id: 2,
    title: 'IT Knowledge Base',
    category: 'Full-Stack',
    description: 'Searchable documentation portal for IT support procedures and troubleshooting guides.',
    tags: ['React', 'Python', 'SQL', 'Search'],
    color: '#059669',
    accent: 'rgba(5,150,105,0.12)',
    size: 'small',
    year: '2024',
  },
  {
    id: 3,
    title: 'Asset Monitor',
    category: 'Dashboard',
    description: 'Real-time device and software asset tracking dashboard for IT inventory management.',
    tags: ['JavaScript', 'REST API', 'HTML/CSS', 'Node.js'],
    color: '#f59e0b',
    accent: 'rgba(245,158,11,0.12)',
    size: 'small',
    year: '2024',
  },
]

const EXPERIENCES = [
  {
    id: 1,
    role: 'IT Service Desk',
    company: 'Current Company',
    period: '2023 — Present',
    type: 'Full-time',
    highlights: [
      'Resolved 50+ tickets/week with 95% SLA compliance',
      'Built internal tools with React & Python to automate workflows',
      'Documented 100+ troubleshooting guides in IT Knowledge Base',
      'Managed hardware/software asset inventory for 200+ devices',
    ],
    color: '#7C3AED',
  },
  {
    id: 2,
    role: 'Vibe Coder',
    company: 'Self-taught / Side Projects',
    period: '2025 — Present',
    type: 'Recent',
    highlights: [
      'Built full-stack web apps using React, Node.js, Python',
      'Leveraged AI tools to ship faster and smarter',
      'Designed and deployed portfolio site with 3D interactions',
      'Contributed to open-source IT tooling projects',
    ],
    color: '#06b6d4',
  },
]

const SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js',
  'SQL', 'Git', 'HTML/CSS', 'REST APIs',
  'Troubleshooting', 'Technical Support',
]

/* ── Bento Project Card ── */
function BentoCard({ project, large = false }) {
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
        padding: large ? '40px' : '32px',
        borderRadius: 20,
        border: `1px solid ${hovered ? project.color + '55' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? project.accent : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        opacity: visible ? 1 : 0,
        gridRow: large ? 'span 2' : 'span 1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: large ? 340 : 160,
        overflow: 'hidden',
      }}
    >
      {/* Glow top-right */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 180, height: 180,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${project.color}22 0%, transparent 70%)`,
        transform: 'translate(40%, -40%)',
        transition: 'opacity 0.5s',
        opacity: hovered ? 1 : 0,
        pointerEvents: 'none',
      }} />

      <div>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: project.color,
            textTransform: 'uppercase', letterSpacing: 3,
            padding: '5px 12px',
            borderRadius: 999,
            border: `1px solid ${project.color}44`,
            background: `${project.color}11`,
          }}>
            {project.category}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: large ? 'clamp(26px, 3.5vw, 38px)' : 'clamp(20px, 2.5vw, 26px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.2,
          marginBottom: 14,
          transform: hovered ? 'translateX(6px)' : 'translateX(0)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {project.title}
        </h3>

        {large && (
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
            maxWidth: 380, marginBottom: 24,
          }}>
            {project.description}
          </p>
        )}
      </div>

      <div>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: large ? 24 : 0 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '4px 10px', borderRadius: 999,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {large && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.4s ease',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: project.color, letterSpacing: 1 }}>
              View Project
            </span>
            <span style={{ color: project.color, fontSize: 16 }}>→</span>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, background: project.color,
        width: hovered ? '100%' : '0%',
        transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
        borderRadius: '0 0 20px 20px',
      }} />
    </div>
  )
}

/* ── Experience Timeline Item ── */
function ExperienceItem({ exp, index, isLast }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="timeline-item"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
      }}
    >
      {/* Left: period */}
      <div className="timeline-period" style={{ textAlign: 'right', paddingTop: 4 }}>
        <span style={{
          fontFamily: 'monospace', fontSize: 12,
          color: 'rgba(255,255,255,0.3)', letterSpacing: 1,
          display: 'block', lineHeight: 1.6,
        }}>
          {exp.period}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: exp.color,
          textTransform: 'uppercase', letterSpacing: 2,
          padding: '3px 8px', borderRadius: 999,
          border: `1px solid ${exp.color}44`,
          background: `${exp.color}11`,
          display: 'inline-block', marginTop: 6,
        }}>
          {exp.type}
        </span>
      </div>

      {/* Center: timeline line (ẩn mobile) */}
      <div className="timeline-line-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: exp.color,
          boxShadow: `0 0 16px ${exp.color}88`,
          flexShrink: 0, marginTop: 4,
          transition: 'transform 0.3s',
          transform: expanded ? 'scale(1.3)' : 'scale(1)',
        }} />
        {!isLast && (
          <div style={{
            width: 1, flex: 1,
            background: `linear-gradient(to bottom, ${exp.color}44, rgba(255,255,255,0.04))`,
            marginTop: 8, minHeight: 60,
          }} />
        )}
      </div>

      {/* Dot mobile — hiện trên mobile thay cho cột giữa */}
      <div className="timeline-dot-mobile" style={{
        background: exp.color,
        boxShadow: `0 0 10px ${exp.color}88`,
      }} />

      {/* Right: content card */}
      <div
        data-hover="true"
        onClick={() => setExpanded(!expanded)}
        className="exp-item-padding"
        style={{
          paddingBottom: isLast ? 0 : 56,
          cursor: 'pointer',
        }}
      >
        <div style={{
          padding: '24px 28px',
          borderRadius: 16,
          border: `1px solid ${expanded ? exp.color + '44' : 'rgba(255,255,255,0.06)'}`,
          background: expanded ? `${exp.color}0a` : 'rgba(255,255,255,0.02)',
          transition: 'all 0.4s ease',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 700, color: '#fff', marginBottom: 4,
              }}>
                {exp.role}
              </h3>
              <span style={{
                fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Syne', sans-serif",
              }}>
                {exp.company}
              </span>
            </div>
            <span style={{
              fontSize: 18, color: 'rgba(255,255,255,0.25)',
              transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              marginTop: 4,
            }}>+</span>
          </div>

          {/* Highlights — expand on click */}
          <div style={{
            maxHeight: expanded ? 300 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <ul style={{ marginTop: 20, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {exp.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: exp.color, flexShrink: 0, marginTop: 6,
                    boxShadow: `0 0 8px ${exp.color}`,
                  }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── App ── */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  const handleFinishLoading = useCallback(() => setLoading(false), [])
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (loading) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.3 }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [loading])

  if (loading) return <LoadingScreen onFinish={handleFinishLoading} />

  return (
    <>
      <StarBackground />
      <CustomCursor />
      <Nav activeSection={activeSection} sections={SECTIONS} />

      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: 'none', zIndex: 50,
      }} />

      {/* ════ HERO ════ */}
      <section
        id="home"
        onMouseMove={(e) => {
          mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
          mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
        }}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 clamp(24px, 6vw, 100px)', position: 'relative', textAlign: 'center' }}
      >
        <div className="scene-3d-wrap">
          <Scene3D mouse={mouse} />
        </div>

        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', top: '15%', right: '10%', animation: 'pulse-glow 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)', bottom: '20%', left: '5%', animation: 'pulse-glow 8s ease-in-out infinite 2s', pointerEvents: 'none' }} />

        <div className="hero-location" style={{ position: 'absolute', top: 120, right: 'clamp(24px, 6vw, 100px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: 2 }}>HCMC, VIETNAM</span>
          <div style={{ width: 1, height: 80, background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)' }} />
        </div>

        <div className="hero-content" style={{
          position: 'relative', zIndex: 2, maxWidth: 900,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(10,10,10,0.45)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '64px 56px', borderRadius: 32,
          boxShadow: '0 8px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          <RevealText delay={0.1}>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #9333ea, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              padding: '6px 20px', borderRadius: 999,
              border: '1px solid rgba(147,51,234,0.35)',
              display: 'inline-block',
            }}>
              Vibe Coder · IT Service Desk
            </span>
          </RevealText>
          <div style={{ marginTop: 28 }}>
            <RevealText delay={0.25}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(52px, 9vw, 112px)', fontWeight: 700, lineHeight: 1.05, display: 'block',
                background: 'linear-gradient(135deg, #fff 30%, #c084fc 70%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Cao Bao
              </span>
            </RevealText>
            <RevealText delay={0.4}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(52px, 9vw, 112px)', fontWeight: 400, fontStyle: 'italic',
                lineHeight: 1.05, display: 'block',
                color: 'transparent', WebkitTextStroke: '1.5px rgba(192,132,252,0.6)',
              }}>
                Vibe Codes
              </span>
            </RevealText>
          </div>
          <RevealText delay={0.6}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 440, lineHeight: 1.8, marginTop: 32, letterSpacing: 0.3 }}>
              IT Service Desk by day, Vibe Coder by night —<br />building tools and apps with AI from Ho Chi Minh City.
            </p>
          </RevealText>
          <RevealText delay={0.75}>
            <div style={{ display: 'flex', gap: 48, marginTop: 36 }}>
              {[['3+', 'Years Exp'], ['10+', 'Projects'], ['95%', 'SLA Rate']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700,
                    background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </RevealText>
          <RevealText delay={0.9}>
            <div style={{ marginTop: 40 }}>
              <MagneticButton onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects
              </MagneticButton>
            </div>
          </RevealText>
        </div>

        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'float 3s ease-in-out infinite' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 3, textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </section>

      <Marquee items={['Developer', '×', 'Designer', '×', 'Creator', '×', 'Vibe Coder', '×']} />

      {/* ════ ABOUT ════ */}
      <section id="about" style={{ padding: '120px clamp(24px, 6vw, 100px)', position: 'relative' }}>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <RevealText>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', letterSpacing: 4, textTransform: 'uppercase' }}>About</span>
            </RevealText>
            <RevealText delay={0.15}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, marginTop: 20 }}>
                I turn ideas into<br />
                <span style={{ fontStyle: 'italic', color: '#7C3AED' }}>reality</span>
              </h2>
            </RevealText>
            <RevealText delay={0.3}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginTop: 28, maxWidth: 460 }}>
                IT Service Desk professional and self-taught vibe coder from Ho Chi Minh City. I leverage AI tools to build and ship real-world solutions faster — from internal IT tools to full-stack web apps.
              </p>
            </RevealText>
            <RevealText delay={0.45}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginTop: 16, maxWidth: 460 }}>
                I believe anyone can build anything with the right mindset, curiosity, and a little help from AI.
              </p>
            </RevealText>
          </div>

          <Parallax speed={0.3}>
            <div style={{ marginTop: 40 }}>
              <RevealText>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.2)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 24, display: 'block' }}>
                  Tech Stack
                </span>
              </RevealText>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SKILLS.map((skill, i) => (
                  <RevealText key={skill} delay={0.1 + i * 0.05}>
                    <span
                      data-hover="true"
                      style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px', borderRadius: 999, display: 'inline-block', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.02)' }}
                      onMouseEnter={(e) => { e.target.style.borderColor = '#9333ea'; e.target.style.color = '#fff'; e.target.style.background = 'rgba(147,51,234,0.12)'; e.target.style.boxShadow = '0 0 18px rgba(147,51,234,0.25)' }}
                      onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.background = 'rgba(255,255,255,0.02)'; e.target.style.boxShadow = 'none' }}
                    >
                      {skill}
                    </span>
                  </RevealText>
                ))}
              </div>

              <div style={{ marginTop: 60, position: 'relative', width: 120, height: 120 }}>
                <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, animation: 'spin-slow 12s linear infinite' }}>
                  <defs><path id="circlePath" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" /></defs>
                  <text fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="Syne, sans-serif" letterSpacing="5">
                    <textPath href="#circlePath">AVAILABLE FOR WORK • AVAILABLE FOR WORK •</textPath>
                  </text>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: '50%', background: '#059669', boxShadow: '0 0 20px rgba(5,150,105,0.4)' }} />
              </div>
            </div>
          </Parallax>
        </div>
        <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>

      {/* ════ WORK — BENTO GRID ════ */}
      <section id="work" style={{ padding: '100px clamp(24px, 6vw, 100px)', position: 'relative' }}>
        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <RevealText>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', letterSpacing: 4, textTransform: 'uppercase' }}>
                Selected Work
              </span>
            </RevealText>
            <RevealText delay={0.15}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, marginTop: 16 }}>
                Projects I've<br />
                <span style={{ fontStyle: 'italic' }}>shipped</span>
              </h2>
            </RevealText>
          </div>
          <RevealText delay={0.2}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>
              {PROJECTS.length} projects
            </span>
          </RevealText>
        </div>

        {/* Bento grid */}
        <div className="bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 16,
        }}>
          {/* Large card — featured */}
          <BentoCard project={PROJECTS[0]} large />

          {/* Small cards stacked */}
          <div className="bento-small-stack" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <BentoCard project={PROJECTS[1]} />
            <BentoCard project={PROJECTS[2]} />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .bento-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <Marquee items={["Let's Work", '×', 'Together', '×', "Let's Build", '×', 'Something', '×']} speed={35} />

      {/* ════ EXPERIENCE — TIMELINE ════ */}
      <section id="experience" style={{ padding: '100px clamp(24px, 6vw, 100px)', position: 'relative' }}>

        {/* Background orb */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          top: '30%', right: '-10%', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <RevealText>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', letterSpacing: 4, textTransform: 'uppercase' }}>
                Experience
              </span>
            </RevealText>
            <RevealText delay={0.15}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, marginTop: 16 }}>
                Where I've<br />
                <span style={{ fontStyle: 'italic' }}>worked</span>
              </h2>
            </RevealText>
          </div>
          <RevealText delay={0.2}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>
              Click to expand
            </span>
          </RevealText>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCES.map((exp, i) => (
            <ExperienceItem
              key={exp.id}
              exp={exp}
              index={i}
              isLast={i === EXPERIENCES.length - 1}
            />
          ))}
        </div>

        <style>{`
          @media (max-width: 640px) {
            .timeline-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ════ CONTACT ════ */}
      <section
        id="contact"
        style={{ padding: '120px clamp(24px, 6vw, 100px)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(34,211,238,0.04) 50%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', animation: 'pulse-glow 6s ease-in-out infinite' }} />

        <RevealText>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #9333ea, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Get in Touch</span>
        </RevealText>
        <RevealText delay={0.2}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
            Let's create<br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #9333ea, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>together</span>
          </h2>
        </RevealText>
        <RevealText delay={0.4}>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, lineHeight: 1.8, marginTop: 24 }}>
            Have an idea, a project, or just want to say hi? I'd love to hear from you.
          </p>
        </RevealText>
        <RevealText delay={0.55}>
          <div style={{ marginTop: 48, position: 'relative', display: 'inline-block' }}>
            <div style={{
              position: 'absolute', inset: -3, borderRadius: 999,
              background: 'linear-gradient(135deg, #9333ea, #22d3ee)',
              filter: 'blur(12px)', opacity: 0.6,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }} />
            <MagneticButton onClick={() => window.open('https://mail.google.com/mail/?view=cm&to=caothienbao1805@gmail.com')} style={{ fontSize: 16, padding: '18px 48px', borderColor: '#9333ea', position: 'relative' }}>
              Say Hello →
            </MagneticButton>
          </div>
        </RevealText>
        <RevealText delay={0.7}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 64 }}>
            {[
              { label: 'GitHub', href: 'https://github.com/Baocaothien' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bảo-cao-34984a372/' },
              { label: 'Gmail', href: 'https://mail.google.com/mail/?view=cm&to=caothienbao1805@gmail.com' },
              { label: '+84 368 841 160', href: 'tel:+84368841160' },
            ].map(({ label, href }) => (
              <a key={label} href={href} data-hover="true"
                style={{
                  fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
                  letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.3s ease',
                  padding: '10px 20px', borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)'; e.currentTarget.style.background = 'rgba(147,51,234,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(147,51,234,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
        </RevealText>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px clamp(24px, 6vw, 100px)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: 'linear-gradient(to top, rgba(147,51,234,0.03), transparent)' }}>
        <span style={{
          fontSize: 12,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>© 2026 Cao Bao</span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: 1 }}>Built with passion from HCMC 🇻🇳</span>
      </footer>
    </>
  )
}
