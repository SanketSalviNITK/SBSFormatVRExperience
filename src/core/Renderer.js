import * as THREE from 'three';

export class SBSRenderer {
    constructor(container) {
        this.container = container;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.container.appendChild(this.renderer.domElement);

        // Main tracking camera
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Stereo Camera handler
        this.stereo = new THREE.StereoCamera();
        this.stereo.aspect = 0.5; // Each eye is half width
        this.stereo.eyeSep = 0.064; // IPD in meters
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    render(scene) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.clear();

        // Update stereo projection
        this.stereo.update(this.camera);

        // Render Left Eye
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, width / 2, height);
        this.renderer.setViewport(0, 0, width / 2, height);
        this.renderer.render(scene, this.stereo.cameraL);

        // Render Right Eye
        this.renderer.setScissor(width / 2, 0, width / 2, height);
        this.renderer.setViewport(width / 2, 0, width / 2, height);
        this.renderer.render(scene, this.stereo.cameraR);

        this.renderer.setScissorTest(false);
    }


    getDomElement() {
        return this.renderer.domElement;
    }
}
