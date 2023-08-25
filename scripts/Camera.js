import * as THREE from 'three';

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
        this.camera.position.y = (t - 8) / 1000 + this.y;
        // this.camera.position.z = (t - 8) / 1400 + this.z;
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

const camera = new CAMERA(-0.5, 3, 6, -0.3);

export default camera;