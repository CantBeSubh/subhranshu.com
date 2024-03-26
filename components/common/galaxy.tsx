'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    ShaderMaterial
} from 'three';

// @ts-ignore
import ParticleVertex from '@/shaders/star/vertex.glsl';
// @ts-ignore
import ParticleFragment from '@/shaders/star/fragment.glsl';

const GenerateGalaxy = () => {
    const { gl, camera } = useThree()
    const uTimeClock = new Clock();

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
            uTransitionTime: { value: 15 },
        },
    })

    // CONSTANTS
    const count = 250000;
    const insideColor = "#44008b";
    const outsideColor = "#e54ed0";
    const radius = 10;
    const branches = 2;
    const spin = 1;
    const randomness = 0.25;
    const randomnessPower = 1.5;
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
        mixedColor.lerp(colorOutside, rad / radius);
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
    useFrame(() => {
        ParticleMat.uniforms.uTime.value = uTimeClock.getElapsedTime();
        // roate camera along z axis
        // camera.rotation.z += 0.001;
    })

    return (
        <points geometry={ParticleGeo} material={ParticleMat} />
    )
}


export const Galaxy = () => {
    return (
        <Canvas
            camera={{
                fov: 55,
                near: 0.00001,
                far: 10000,
                position: [-0.5, 3, 6],
                // rotateOnAxis: [-0.3, 0, 0],
            }}
            scene={{
                background: new Color(0x000000),
            }}
        >
            {/* <mesh>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshBasicMaterial color={'#44008b'} />
            </mesh> */}
            <mesh>
                <GenerateGalaxy />
            </mesh>
        </Canvas>
    )
}