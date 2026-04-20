import { useState, useEffect, useRef } from 'react'

export default function CustomCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Ẩn cursor trên mobile
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const move = (e) => {
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const over = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setHovering(true)
      else setHovering(false)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovering ? 60 : 40,
          height: hovering ? 60 : 40,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#7C3AED' : 'rgba(255,255,255,0.4)'}`,
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s',
          mixBlendMode: 'difference',
          marginLeft: hovering ? -10 : 0,
          marginTop: hovering ? -10 : 0,
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}
