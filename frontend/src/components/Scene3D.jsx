import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Leaf() {
  const g = useRef()
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -1.5)
    s.bezierCurveTo(1.15, -0.8, 1.15, 0.7, 0, 1.6)
    s.bezierCurveTo(-1.15, 0.7, -1.15, -0.8, 0, -1.5)
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 32 })
  }, [])
  useFrame(({ pointer, clock }) => {
    const t = clock.elapsedTime
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.9 + Math.sin(t * 0.5) * 0.35, 0.05)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.4, 0.05)
  })
  const veins = [-0.7, -0.15, 0.4].flatMap((y) => [-1, 1].map((side) => ({ y, side })))
  return (
    <group ref={g}>
      <mesh geometry={geo} position={[0, 0, -0.04]}>
        <meshStandardMaterial color="#B91FD9" emissive="#5B12A8" emissiveIntensity={0.7} roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0.1]}>
        <boxGeometry args={[0.05, 2.9, 0.03]} />
        <meshStandardMaterial color="#22E5D3" emissive="#22E5D3" emissiveIntensity={1.2} />
      </mesh>
      {veins.map(({ y, side }) => (
        <mesh key={`${y}${side}`} position={[side * 0.28, y, 0.1]} rotation={[0, 0, -side * 0.95]}>
          <boxGeometry args={[0.75, 0.03, 0.03]} />
          <meshStandardMaterial color="#22E5D3" emissive="#22E5D3" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Star({ position, scale = 1, speed = 1, color = '#22E5D3' }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 0.2 : 1
      const a = (i * Math.PI) / 4
      i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    return new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 })
  }, [])
  useFrame((_, d) => { ref.current.rotation.y += d * speed; ref.current.rotation.z += d * speed * 0.3 })
  return (
    <Float speed={2} floatIntensity={1.4} rotationIntensity={0.4}>
      <mesh ref={ref} geometry={geo} position={position} scale={scale}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.15} metalness={0.8} />
      </mesh>
    </Float>
  )
}

export default function Scene3D() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 45 }} aria-hidden="true">
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <pointLight position={[3, 2, 3]} color="#22E5D3" intensity={30} />
      <pointLight position={[-3, -2, 2]} color="#D31BE6" intensity={30} />
      <Float speed={1.4} floatIntensity={0.9}><Leaf /></Float>
      <Star position={[-2.1, 1.5, 0.3]} scale={0.45} speed={0.9} />
      <Star position={[2.2, -1.5, 0.5]} scale={0.3} speed={-1.2} color="#D31BE6" />
      <Star position={[2.0, 1.7, -0.5]} scale={0.18} speed={1.6} color="#A6F0E8" />
    </Canvas>
  )
}
