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
import { MutableRefObject, useEffect, useRef } from 'react';

import { WebGLRenderTarget } from 'three';

const ShaderPlane = () => {
    const uTimeClock = useRef(new Clock());
    const materialRef = useRef<ShaderMaterial | null>(null);
    const renderTarget1 = useRef<WebGLRenderTarget | null>(null);
    const renderTarget2 = useRef<WebGLRenderTarget | null>(null);
    const isFirstPass = useRef<boolean>(true);

    // Create render targets on mount
    useEffect(() => {
        renderTarget1.current = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
        renderTarget2.current = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
    }, []);

    useFrame(({ gl, scene, camera }) => {
        if (materialRef.current && renderTarget1.current && renderTarget2.current) {
            // Update time uniform
            materialRef.current.uniforms.iTime.value = uTimeClock.current.getElapsedTime();

            if (isFirstPass.current) {
                // Render scene to render target 1
                gl.setRenderTarget(renderTarget1.current);
                gl.render(scene, camera);
                gl.setRenderTarget(null);

                // Update texture uniform to use render target 1
                materialRef.current.uniforms.iChannel0.value = renderTarget1.current.texture;

                isFirstPass.current = false;
            } else {
                // Render scene to render target 2
                gl.setRenderTarget(renderTarget2.current);
                gl.render(scene, camera);
                gl.setRenderTarget(null);

                // Update texture uniform to use render target 2
                materialRef.current.uniforms.iChannel0.value = renderTarget2.current.texture;

                isFirstPass.current = true;
            }
        }
    });

    return (
        <mesh>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial
                uniforms={{
                    iTime: { value: 0 },
                    iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
                    iChannel0: { value: null } // Initial value, will be updated dynamically
                }}
                vertexShader={PlaneVertex}
                fragmentShader={PlaneFragment}
                ref={(materialRef as unknown) as MutableRefObject<ShaderMaterial | null>}
            />
        </mesh>
    );
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
    );
}
