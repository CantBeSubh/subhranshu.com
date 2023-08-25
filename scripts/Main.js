import * as THREE from "three";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import Stats from "three/examples/jsm/libs/stats.module";

import galaxy from "./Galaxy.js";
import camera from "./Camera.js";
import renderer from './Renderer.js';
import scene from './Scene.js';

import '/styles/main.scss';

//STATS
// const stats = Stats();
// stats.dom.id = 'stats'
// document.body.appendChild(stats.dom);

const uTimeClock = new THREE.Clock();
const renderScene = new RenderPass(scene, camera.camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)

const render = () => {
    galaxy.render(uTimeClock.getElapsedTime());
    composer.render()
};

const animate = () => {
    render();
    // stats.update();
    requestAnimationFrame(animate);
};

animate();