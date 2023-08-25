import '/styles/main.scss';

import * as THREE from "three";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

import Stats from "three/examples/jsm/libs/stats.module";

import GalaxyV from "../shaders/vertex.glsl";
import GalaxyF from "../shaders/fragment.glsl";

const canvas = document.getElementById("canvas");

//STATS
const stats = Stats();
stats.dom.id = 'stats'
document.body.appendChild(stats.dom);

//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

//CAMERA
class CAMERA {
    constructor(x, y, z, rotX) {
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.0001, 10000);
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotX = rotX;
        this.camera.position.set(this.x, this.y, this.z);
        this.camera.rotation.x = this.rotX;
    }

    update(t) {
        this.camera.position.y = (t - 8) / 1400 + this.y;
        // this.camera.position.z = (t - 8) / 1400 + this.z;
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

//GALAXY
class GALAXY {
    constructor(randomnessPower) {
        this.count = 5000;
        this.radius = 0;
        this.branches = 2;
        this.spin = 1;
        this.randomness = 10;
        this.randomnessPower = randomnessPower;
        this.insideColor = "purple";
        this.outsideColor = "blue";
        this.ParticleMat = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: GalaxyV,
            fragmentShader: GalaxyF,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 50 * renderer.getPixelRatio() },
            },
        });
        this.pointCap = 1000000;
        this.BlackHole = new THREE.Mesh(new THREE.SphereGeometry(0.05, 25, 25), new THREE.MeshBasicMaterial({ color: "black" }));
        this.BlackHole.scale.set(0, 0, 0);
        scene.add(this.BlackHole);
    }

    generateGalaxy(dx, dy, dz) {
        const ParticleGeo = new THREE.BufferGeometry();
        const ParticlePosition = new Float32Array(this.count * 3);

        const ParticleColors = new Float32Array(this.count * 3);
        const colorInside = new THREE.Color(this.insideColor);
        const colorOutside = new THREE.Color(this.outsideColor);

        const scales = new Float32Array(this.count * 1);
        const randomness = new Float32Array(this.count * 3);

        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * this.radius;
            const spinAngle = radius * this.spin;
            const branchAngle = ((i % this.branches) / this.branches) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), this.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.randomness * radius;
            const randomY = Math.pow(Math.random(), this.randomnessPower) * (Math.random() < 0.5 ? 2 : -2) * this.randomness * radius;
            const randomZ = Math.pow(Math.random(), this.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.randomness * radius;

            randomness[i3] = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            ParticlePosition[i3] = Math.cos(branchAngle + spinAngle) * radius * dx;
            ParticlePosition[i3 + 1] = dy;
            ParticlePosition[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius * dz;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / this.radius);
            ParticleColors[i3] = mixedColor.r;
            ParticleColors[i3 + 1] = mixedColor.g;
            ParticleColors[i3 + 2] = mixedColor.b;

            scales[i] = Math.random();
        };
        ParticleGeo.setAttribute("position", new THREE.BufferAttribute(ParticlePosition, 3));
        ParticleGeo.setAttribute("color", new THREE.BufferAttribute(ParticleColors, 3));
        ParticleGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
        ParticleGeo.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));

        scene.add(new THREE.Points(ParticleGeo, this.ParticleMat));
    }

    update(t, PointCount) {
        this.randomness = (-1 * (t - 8)) / 1000 + 0.1;
        this.radius = ((t - 8) / 1000) * ((12 * 4) / 1.4) * -1;

        if (PointCount < this.pointCap) this.generateGalaxy(1, 0, 1);
        if (PointCount < 25000) {
            let scale = PointCount / 25000;
            this.BlackHole.scale.set(scale, scale, scale);
        }
    }

    render(t) {
        this.ParticleMat.uniforms.uTime.value = t;
    }
}

//RENDERER
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new CAMERA(-0.5, 3, 6, -0.3);
const galaxy = new GALAXY(1);


//EVENT LISTENERS
window.addEventListener("scroll", () => {
    const t = document.body.getBoundingClientRect().top;
    let PointCount = renderer.info.render.points;
    camera.update(t);
    galaxy.update(t, PointCount);
});

window.addEventListener("resize", () => {
    camera.resize();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.querySelector("#toggle").addEventListener('click', e => {
    if (scene.background.b == new THREE.Color(0x111133).b) {
        scene.background = new THREE.Color('black')
        document.documentElement.style.setProperty('--card-color', 'rgb(23, 12, 34)');
    } else {
        scene.background = new THREE.Color(0x111133);
        document.documentElement.style.setProperty('--card-color', 'rgb(46, 40, 83)');
    }

})

const uTimeClock = new THREE.Clock();
const renderScene = new RenderPass(scene, camera.camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)

const render = () => {
    galaxy.render(uTimeClock.getElapsedTime());
    stats.update();
    composer.render()
};

const animate = () => {
    render();
    requestAnimationFrame(animate);
};

animate();