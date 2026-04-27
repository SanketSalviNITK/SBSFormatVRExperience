import * as THREE from 'three';

export class SBSRenderer {
    constructor(container) {
        this.container = container;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.container.appendChild(this.renderer.domElement);

        // Parameters for Stereo
        this.eyeSeparation = 0.064; // Average human eye separation in meters
        this.focalLength = 15;
        
        // Cameras
        this.cameraL = new THREE.PerspectiveCamera(70, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
        this.cameraR = new THREE.PerspectiveCamera(70, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
        
        // Virtual camera for orientation tracking
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.cameraL.aspect = (width / 2) / height;
        this.cameraL.updateProjectionMatrix();
        
        this.cameraR.aspect = (width / 2) / height;
        this.cameraR.updateProjectionMatrix();
    }

    render(scene) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.clear();

        // Update Left/Right cameras based on main camera
        this.cameraL.position.copy(this.camera.position);
        this.cameraL.quaternion.copy(this.camera.quaternion);
        this.cameraL.translateX(-this.eyeSeparation / 2);

        this.cameraR.position.copy(this.camera.position);
        this.cameraR.quaternion.copy(this.camera.quaternion);
        this.cameraR.translateX(this.eyeSeparation / 2);

        // Render Left Eye
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, width / 2, height);
        this.renderer.setViewport(0, 0, width / 2, height);
        this.renderer.render(scene, this.cameraL);

        // Render Right Eye
        this.renderer.setScissor(width / 2, 0, width / 2, height);
        this.renderer.setViewport(width / 2, 0, width / 2, height);
        this.renderer.render(scene, this.cameraR);

        this.renderer.setScissorTest(false);
    }

    getDomElement() {
        return this.renderer.domElement;
    }
}
