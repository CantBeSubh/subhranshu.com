'use client'
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Clock,
    Color,
    ShaderMaterial,
    Vector2
} from 'three';

// @ts-ignore
import PlaneVertex from '@/shaders/isovalues/vertex.glsl';
// @ts-ignore
import PlaneFragment from '@/shaders/isovalues/fragment.glsl';
import { useRef } from 'react';



const ShaderPlane = () => {
    const uTimeClock = new Clock();
    const materialRef = useRef<ShaderMaterial | null>(null);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.iTime.value = uTimeClock.getElapsedTime();
        }
    })

    return (
        <mesh>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial
                uniforms={{
                    iTime: { value: 0 },
                    iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
                    iChannel0: { value: null }
                }}
                vertexShader={PlaneVertex}
                fragmentShader={PlaneFragment}
                ref={(materialRef as unknown) as React.MutableRefObject<ShaderMaterial | null>}
            />
        </mesh>
    )
}

export const IsoValues = () => {
    return (
        <Canvas
            scene={{ background: new Color(0x000000) }}
            style={{
                mask: `radial-gradient(circle at center, rgba(0,0,0,1) 0%,rgba(0,0,0,0.5) 60%, rgba(0,0,0,0)  100%)`
            }}
        >
            <ShaderPlane />
        </Canvas>
    )
}