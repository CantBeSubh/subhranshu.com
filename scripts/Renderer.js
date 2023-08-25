import * as THREE from "three";

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);
renderer.setSize(window.innerWidth, window.innerHeight);

export default renderer;