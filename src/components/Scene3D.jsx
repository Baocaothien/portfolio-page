import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const BLACK = new THREE.MeshBasicMaterial({ color: '#000000', side: THREE.BackSide })

/* Mesh + viền đen bọc ngoài */
function Outlined({ geo, mat, position = [0,0,0], rotation = [0,0,0], scale = 1.08 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>{geo}{mat}</mesh>
      <mesh scale={scale}><primitive object={geo} /><primitive object={BLACK} /></mesh>
    </group>
  )
}

/* ── Scan line ── */
function ScanLine() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 1.8
  })
  return (
    <mesh ref={ref} position={[0, 0, 0.58]}>
      <planeGeometry args={[2.0, 0.022]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.75} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ── Hologram figure ── */
function HoloFigure({ mouse }) {
  const root     = useRef()
  const r1       = useRef()
  const r2       = useRef()
  const r3       = useRef()
  const o1       = useRef()
  const o2       = useRef()
  const o3       = useRef()
  const core     = useRef()
  const leftArm  = useRef()
  const rightArm = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!root.current) return

    root.current.rotation.y += (mouse.current.x * 0.65 - root.current.rotation.y) * 0.055
    root.current.rotation.x += (mouse.current.y * -0.2  - root.current.rotation.x) * 0.055
    root.current.position.y  = Math.sin(t * 0.85) * 0.1

    if (r1.current) r1.current.rotation.z = t * 0.52
    if (r2.current) r2.current.rotation.x = t * 0.35
    if (r3.current) r3.current.rotation.y = t * 0.44

    if (o1.current) {
      o1.current.position.x = Math.cos(t * 0.75) * 2.15
      o1.current.position.y = Math.sin(t * 0.75) * 1.5
      o1.current.position.z = Math.sin(t * 0.75 + 1) * 0.7
    }
    if (o2.current) {
      o2.current.position.x = Math.cos(t * 0.48 + Math.PI) * 2.5
      o2.current.position.y = Math.sin(t * 0.48) * 1.2
      o2.current.position.z = Math.cos(t * 0.48) * 1.1
    }
    if (o3.current) {
      o3.current.position.x = Math.sin(t * 1.05 + 2) * 1.7
      o3.current.position.y = Math.cos(t * 1.05) * 2.1
      o3.current.position.z = Math.sin(t * 1.05) * 0.9
    }

    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08)
    if (leftArm.current)  leftArm.current.rotation.x  =  Math.sin(t * 1.4) * 0.18
    if (rightArm.current) rightArm.current.rotation.x = -Math.sin(t * 1.4) * 0.18
  })

  const P = '#7C3AED'
  const V = '#a78bfa'
  const C = '#06b6d4'

  const mat = (color, opacity = 0.85, ei = 1.4) => (
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={ei}
      transparent opacity={opacity} roughness={0.05} metalness={0.9} />
  )

  return (
    <group ref={root} scale={0.88}>

      {/* ════ HEAD ════ */}
      <group position={[0, 2.05, 0]}>
        <mesh><sphereGeometry args={[0.46, 20, 20]} />{mat(V, 0.9, 1.6)}</mesh>
        <mesh scale={1.12}><sphereGeometry args={[0.46, 20, 20]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* Visor */}
      <mesh position={[0, 2.05, 0.38]} rotation={[0.25, 0, 0]}>
        <planeGeometry args={[0.56, 0.17]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={5}
          transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* ════ NECK ════ */}
      <group position={[0, 1.5, 0]}>
        <mesh><cylinderGeometry args={[0.1, 0.14, 0.22, 8]} />{mat(P, 0.9, 1)}</mesh>
        <mesh scale={1.18}><cylinderGeometry args={[0.1, 0.14, 0.22, 8]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* ════ BODY ════ */}
      <group position={[0, 0.6, 0]}>
        <mesh><boxGeometry args={[0.9, 1.5, 0.5]} />{mat(P, 0.88, 1.2)}</mesh>
        <mesh scale={1.09}><boxGeometry args={[0.9, 1.5, 0.5]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* Energy core */}
      <mesh ref={core} position={[0, 0.78, 0.27]}>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={10} />
      </mesh>
      <mesh position={[0, 0.78, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.012, 4, 36]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={5} />
      </mesh>

      {/* Shoulder pads */}
      <group position={[-0.56, 1.32, 0]}>
        <mesh><boxGeometry args={[0.22, 0.14, 0.52]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.15}><boxGeometry args={[0.22, 0.14, 0.52]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[0.56, 1.32, 0]}>
        <mesh><boxGeometry args={[0.22, 0.14, 0.52]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.15}><boxGeometry args={[0.22, 0.14, 0.52]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* ════ LEFT ARM ════ */}
      <group ref={leftArm} position={[-0.66, 0.88, 0]}>
        <group position={[0, -0.44, 0]} rotation={[0, 0, 0.1]}>
          <mesh><cylinderGeometry args={[0.11, 0.09, 0.88, 7]} />{mat(P, 0.88, 1)}</mesh>
          <mesh scale={1.14}><cylinderGeometry args={[0.11, 0.09, 0.88, 7]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -0.9, 0]}>
          <mesh><sphereGeometry args={[0.1, 8, 8]} />{mat(V, 0.9, 2)}</mesh>
          <mesh scale={1.2}><sphereGeometry args={[0.1, 8, 8]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -1.28, 0]}>
          <mesh><cylinderGeometry args={[0.09, 0.08, 0.7, 7]} />{mat(P, 0.88, 1)}</mesh>
          <mesh scale={1.16}><cylinderGeometry args={[0.09, 0.08, 0.7, 7]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -1.72, 0]}>
          <mesh><boxGeometry args={[0.19, 0.18, 0.16]} />{mat(V, 0.9, 1.5)}</mesh>
          <mesh scale={1.18}><boxGeometry args={[0.19, 0.18, 0.16]} /><primitive object={BLACK} /></mesh>
        </group>
      </group>

      {/* ════ RIGHT ARM ════ */}
      <group ref={rightArm} position={[0.66, 0.88, 0]}>
        <group position={[0, -0.44, 0]} rotation={[0, 0, -0.1]}>
          <mesh><cylinderGeometry args={[0.11, 0.09, 0.88, 7]} />{mat(P, 0.88, 1)}</mesh>
          <mesh scale={1.14}><cylinderGeometry args={[0.11, 0.09, 0.88, 7]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -0.9, 0]}>
          <mesh><sphereGeometry args={[0.1, 8, 8]} />{mat(V, 0.9, 2)}</mesh>
          <mesh scale={1.2}><sphereGeometry args={[0.1, 8, 8]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -1.28, 0]}>
          <mesh><cylinderGeometry args={[0.09, 0.08, 0.7, 7]} />{mat(P, 0.88, 1)}</mesh>
          <mesh scale={1.16}><cylinderGeometry args={[0.09, 0.08, 0.7, 7]} /><primitive object={BLACK} /></mesh>
        </group>
        <group position={[0, -1.72, 0]}>
          <mesh><boxGeometry args={[0.19, 0.18, 0.16]} />{mat(V, 0.9, 1.5)}</mesh>
          <mesh scale={1.18}><boxGeometry args={[0.19, 0.18, 0.16]} /><primitive object={BLACK} /></mesh>
        </group>
      </group>

      {/* ════ WAIST ════ */}
      <group position={[0, -0.2, 0]}>
        <mesh><boxGeometry args={[0.78, 0.28, 0.46]} />{mat(P, 0.88, 1)}</mesh>
        <mesh scale={1.1}><boxGeometry args={[0.78, 0.28, 0.46]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* ════ LEFT LEG ════ */}
      <group position={[-0.24, -0.74, 0]}>
        <mesh><cylinderGeometry args={[0.155, 0.13, 1.0, 7]} />{mat(P, 0.88, 0.9)}</mesh>
        <mesh scale={1.12}><cylinderGeometry args={[0.155, 0.13, 1.0, 7]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[-0.24, -1.28, 0]}>
        <mesh><sphereGeometry args={[0.14, 8, 8]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.2}><sphereGeometry args={[0.14, 8, 8]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[-0.24, -1.82, 0]}>
        <mesh><cylinderGeometry args={[0.11, 0.09, 0.9, 7]} />{mat(P, 0.88, 0.9)}</mesh>
        <mesh scale={1.14}><cylinderGeometry args={[0.11, 0.09, 0.9, 7]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[-0.24, -2.35, 0.1]}>
        <mesh><boxGeometry args={[0.26, 0.15, 0.48]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.16}><boxGeometry args={[0.26, 0.15, 0.48]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* ════ RIGHT LEG ════ */}
      <group position={[0.24, -0.74, 0]}>
        <mesh><cylinderGeometry args={[0.155, 0.13, 1.0, 7]} />{mat(P, 0.88, 0.9)}</mesh>
        <mesh scale={1.12}><cylinderGeometry args={[0.155, 0.13, 1.0, 7]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[0.24, -1.28, 0]}>
        <mesh><sphereGeometry args={[0.14, 8, 8]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.2}><sphereGeometry args={[0.14, 8, 8]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[0.24, -1.82, 0]}>
        <mesh><cylinderGeometry args={[0.11, 0.09, 0.9, 7]} />{mat(P, 0.88, 0.9)}</mesh>
        <mesh scale={1.14}><cylinderGeometry args={[0.11, 0.09, 0.9, 7]} /><primitive object={BLACK} /></mesh>
      </group>
      <group position={[0.24, -2.35, 0.1]}>
        <mesh><boxGeometry args={[0.26, 0.15, 0.48]} />{mat(C, 0.9, 2.5)}</mesh>
        <mesh scale={1.16}><boxGeometry args={[0.26, 0.15, 0.48]} /><primitive object={BLACK} /></mesh>
      </group>

      {/* ════ SCAN LINE ════ */}
      <ScanLine />

      {/* ════ ORBITING RINGS ════ */}
      <group ref={r1}>
        <mesh>
          <torusGeometry args={[2.1, 0.016, 2, 100]} />
          <meshStandardMaterial color={C} emissive={C} emissiveIntensity={5} transparent opacity={0.95} />
        </mesh>
        <mesh position={[2.1, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={C} emissive={C} emissiveIntensity={8} />
        </mesh>
      </group>

      <group ref={r2} rotation={[Math.PI / 2.3, 0.5, 0]}>
        <mesh>
          <torusGeometry args={[2.55, 0.012, 2, 100]} />
          <meshStandardMaterial color={V} emissive={V} emissiveIntensity={4} transparent opacity={0.8} />
        </mesh>
        <mesh position={[2.55, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={V} emissive={V} emissiveIntensity={8} />
        </mesh>
      </group>

      <group ref={r3} rotation={[0.6, Math.PI / 3.2, 0.4]}>
        <mesh>
          <torusGeometry args={[3.0, 0.008, 2, 100]} />
          <meshStandardMaterial color={P} emissive={P} emissiveIntensity={3} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ════ FLOATING ORBS ════ */}
      <mesh ref={o1}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={8} />
      </mesh>
      <mesh ref={o2}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color={V} emissive={V} emissiveIntensity={8} />
      </mesh>
      <mesh ref={o3}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={8} />
      </mesh>

    </group>
  )
}

/* ── Particles ── */
function Particles() {
  const count = 180
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 26
      arr[i * 3 + 1] = (Math.random() - 0.5) * 26
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.013
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#a78bfa" size={0.05} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ── Main ── */
export default function Scene3D({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.5], fov: 52 }}
      style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.2 }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 3, 4]}   intensity={3}   color="#7C3AED" />
      <pointLight position={[4, 0, 2]}   intensity={2}   color="#06b6d4" />
      <pointLight position={[-4, -2, 0]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[0, -4, 2]}  intensity={0.8} color="#06b6d4" />

      <Stars radius={90} depth={50} count={1000} factor={3} fade speed={0.4} />
      <Particles />
      <HoloFigure mouse={mouse} />

      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={[0.0008, 0.0008]}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  )
}
