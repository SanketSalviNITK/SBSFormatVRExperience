import '../style.css';
import * as THREE from 'three';
import { SBSRenderer } from './core/Renderer';
import { CameraController } from './core/CameraController';
import { SolarSystem } from './modules/SolarSystem';

class App {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        
        // Modules
        this.sbsRenderer = new SBSRenderer(this.container);
        this.cameraController = new CameraController(this.sbsRenderer.camera);
        this.solarSystem = new SolarSystem();
        
        this.scene.add(this.solarSystem.getScene());
        
        // Raycaster for gaze interaction
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 100;
        this.gazeTarget = null;
        
        // UI elements
        this.ui = {
            onboarding: document.getElementById('onboarding'),
            calibration: document.getElementById('calibration'),
            hud: document.getElementById('hud'),
            targetName: document.getElementById('target-name'),
            targetDesc: document.getElementById('target-description'),
            startBtn: document.getElementById('start-btn'),
            calibrateBtn: document.getElementById('calibrate-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn')
        };

        this.init();
    }

    init() {
        this.ui.startBtn.addEventListener('click', () => this.requestPermissions());
        this.ui.calibrateBtn.addEventListener('click', () => this.startExperience());
        this.ui.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Set initial camera position
        this.sbsRenderer.camera.position.set(0, 5, 20);
        this.sbsRenderer.camera.lookAt(0, 0, 0);

        this.animate();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    async requestPermissions() {
        // Handle iOS DeviceOrientation permissions
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.cameraController.enable();
                    this.goToCalibration();
                } else {
                    alert("Sensor permission denied. Manual rotation enabled.");
                    this.goToCalibration();
                }
            } catch (error) {
                console.error("Device orientation permission error", error);
                this.goToCalibration();
            }
        } else {
            // Android or other browsers
            this.cameraController.enable();
            this.goToCalibration();
        }
    }

    goToCalibration() {
        this.ui.onboarding.classList.remove('active');
        this.ui.calibration.classList.add('active');
    }


    startExperience() {
        this.cameraController.calibrate();
        this.ui.calibration.classList.remove('active');
        this.ui.hud.classList.remove('hidden');
    }

    checkGaze() {
        // Gaze is always at the center of the screen
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.sbsRenderer.camera);
        
        const intersects = this.raycaster.intersectObjects(this.solarSystem.planets);

        if (intersects.length > 0) {
            const target = intersects[0].object;
            if (this.gazeTarget !== target) {
                this.gazeTarget = target;
                this.updateHUD(target.userData);
            }
        } else {
            this.gazeTarget = null;
        }
    }

    updateHUD(data) {
        this.ui.targetName.innerText = data.name;
        this.ui.targetDesc.innerText = data.description;
        
        // Visual feedback for gaze
        this.ui.targetName.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.ui.targetName.style.transform = 'scale(1)';
        }, 200);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        this.solarSystem.update(time);
        this.cameraController.update();
        this.checkGaze();
        
        this.sbsRenderer.render(this.scene);
    }
}

new App();
