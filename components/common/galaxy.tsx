'use client'
import { Canvas } from '@react-three/fiber'

export const Galaxy = () => {
    return (
        <Canvas className='bg-red-100'>
            <ambientLight intensity={0.1} />
            <directionalLight color="red" position={[0, 0, 5]} />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial />
            </mesh>
        </Canvas>
    )
}