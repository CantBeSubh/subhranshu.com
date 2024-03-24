'use client'
import { Canvas, useThree } from '@react-three/fiber';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    ShaderMaterial
} from 'three';

// @ts-ignore
import ParticleVertex from '@/shaders/star/vertex.glsl';
// @ts-ignore
import ParticleFragment from '@/shaders/star/fragment.glsl';

const GenerateGalaxy = () => {
    const { gl } = useThree()

    // MATERIAL
    const ParticleMat: ShaderMaterial = new ShaderMaterial({
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
        vertexShader: ParticleVertex,
        fragmentShader: ParticleFragment,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: 50 * gl.getPixelRatio() },
        },
    })

    // CONSTANTS
    const count = 5000;
    const insideColor = "purple";
    const outsideColor = "blue";
    const radius = 1;
    const branches = 2;
    const spin = 1;
    const randomness = 10;
    const randomnessPower = 1;
    const dx = 1;
    const dy = 0;
    const dz = 1;

    // INITIALIZE
    const ParticleGeo = new BufferGeometry();
    const ParticlePosition = new Float32Array(count * 3);
    const ParticleColors = new Float32Array(count * 3);
    const colorInside = new Color(insideColor);
    const colorOutside = new Color(outsideColor);
    const scales = new Float32Array(count * 1);
    const randomnessArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const rad = Math.random() * radius;
        const spinAngle = rad * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * rad;
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 2 : -2) * randomness * rad;
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * rad;

        randomnessArr[i3] = randomX;
        randomnessArr[i3 + 1] = randomY;
        randomnessArr[i3 + 2] = randomZ;

        ParticlePosition[i3] = Math.cos(branchAngle + spinAngle) * rad * dx;
        ParticlePosition[i3 + 1] = dy;
        ParticlePosition[i3 + 2] = Math.sin(branchAngle + spinAngle) * rad * dz;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, rad / rad);
        ParticleColors[i3] = mixedColor.r;
        ParticleColors[i3 + 1] = mixedColor.g;
        ParticleColors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random();
    };
    ParticleGeo.setAttribute("position", new BufferAttribute(ParticlePosition, 3));
    ParticleGeo.setAttribute("color", new BufferAttribute(ParticleColors, 3));
    ParticleGeo.setAttribute("aScale", new BufferAttribute(scales, 1));
    ParticleGeo.setAttribute("aRandomness", new BufferAttribute(randomnessArr, 3));

    // const POINTS = new Points(ParticleGeo, ParticleMat)

    return (
        <points geometry={ParticleGeo} material={ParticleMat} />
    )
}


export const Galaxy = () => {
    return (
        <Canvas
            camera={{
                fov: 55,
                near: 0.0001,
                far: 10000,
                position: [-0.5, 3, 6],
                // rotateOnAxis: [-0.3, 0, 0],
            }}
            scene={{
                background: new Color(0x000000),
            }}
        >
            <mesh>
                <ambientLight intensity={0.1} />
                <GenerateGalaxy />
            </mesh>
        </Canvas>
    )
}