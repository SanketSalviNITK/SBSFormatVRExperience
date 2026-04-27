import * as THREE from 'three';

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.enabled = false;
        
        // Orientation state
        this.targetRotation = new THREE.Euler(0, 0, 0, 'YXZ');
        this.currentRotation = new THREE.Euler(0, 0, 0, 'YXZ');
        this.offset = new THREE.Euler(0, 0, 0, 'YXZ');
        
        // Smoothing
        this.lerpFactor = 0.1;
        
        // Mouse fallback
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initListeners();
    }

    initListeners() {
        window.addEventListener('deviceorientation', (e) => this.onDeviceOrientation(e), true);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onDeviceOrientation(event) {
        if (!this.enabled || !event.alpha) return;

        // Convert degrees to radians
        const alpha = THREE.MathUtils.degToRad(event.alpha); // Z
        const beta = THREE.MathUtils.degToRad(event.beta);   // X
        const gamma = THREE.MathUtils.degToRad(event.gamma); // Y

        // Basic mapping for landscape/portrait
        // In mobile VR, we usually expect landscape
        this.targetRotation.set(beta, alpha, -gamma);
    }

    onMouseMove(event) {
        if (this.enabled) return; // Prioritize device orientation if active

        const x = (event.clientX / window.innerWidth) - 0.5;
        const y = (event.clientY / window.innerHeight) - 0.5;
        
        this.targetRotation.y = -x * 2;
        this.targetRotation.x = -y * 2;
    }

    calibrate() {
        this.offset.copy(this.targetRotation);
    }

    update() {
        // Smooth interpolation
        this.camera.rotation.x += (this.targetRotation.x - this.camera.rotation.x) * this.lerpFactor;
        this.camera.rotation.y += (this.targetRotation.y - this.camera.rotation.y) * this.lerpFactor;
        this.camera.rotation.z += (this.targetRotation.z - this.camera.rotation.z) * this.lerpFactor;
    }

    enable() {
        this.enabled = true;
    }
}
