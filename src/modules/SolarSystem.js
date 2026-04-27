import * as THREE from 'three';

export class SolarSystem {
    constructor() {
        this.group = new THREE.Group();
        this.planets = [];
        this.init();
    }

    init() {
        // Sun
        const sunGeom = new THREE.SphereGeometry(2, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
        const sun = new THREE.Mesh(sunGeom, sunMat);
        sun.userData = { name: "The Sun", description: "The star at the center of our Solar System." };
        this.group.add(sun);

        // Planet Data
        const planetData = [
            { name: "Mercury", color: 0xaaaaaa, dist: 4, size: 0.4 },
            { name: "Venus", color: 0xe3bb76, dist: 6, size: 0.7 },
            { name: "Earth", color: 0x2233ff, dist: 8, size: 0.8 },
            { name: "Mars", color: 0xff5522, dist: 10, size: 0.6 },
            { name: "Jupiter", color: 0xeb9350, dist: 14, size: 1.5 },
            { name: "Saturn", color: 0xead6b8, dist: 18, size: 1.2 },
            { name: "Uranus", color: 0xbbe1e4, dist: 22, size: 0.9 },
            { name: "Neptune", color: 0x6081ff, dist: 25, size: 0.9 }
        ];

        planetData.forEach((data, index) => {
            const planetGeom = new THREE.SphereGeometry(data.size, 32, 32);
            const planetMat = new THREE.MeshStandardMaterial({ color: data.color });
            const planet = new THREE.Mesh(planetGeom, planetMat);
            
            planet.position.x = data.dist;
            planet.userData = { 
                name: data.name, 
                description: `Information about ${data.name}... Discovery ${index + 1}/8` 
            };

            // Orbit line
            const orbitGeom = new THREE.RingGeometry(data.dist - 0.05, data.dist + 0.05, 64);
            const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
            const orbit = new THREE.Mesh(orbitGeom, orbitMat);
            orbit.rotation.x = Math.PI / 2;
            
            this.group.add(orbit);
            this.group.add(planet);
            this.planets.push(planet);
        });

        // Stars Background
        const starGeom = new THREE.BufferGeometry();
        const starPos = [];
        for (let i = 0; i < 5000; i++) {
            starPos.push(THREE.MathUtils.randFloatSpread(200));
            starPos.push(THREE.MathUtils.randFloatSpread(200));
            starPos.push(THREE.MathUtils.randFloatSpread(200));
        }
        starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new THREE.Points(starGeom, starMat);
        this.group.add(stars);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        const sunLight = new THREE.PointLight(0xffffff, 5, 50);
        this.group.add(ambientLight, sunLight);
    }

    update(time) {
        this.planets.forEach((planet, index) => {
            const speed = 0.5 / (index + 1);
            const dist = planet.position.length();
            planet.position.x = Math.cos(time * speed) * (index * 3 + 4);
            planet.position.z = Math.sin(time * speed) * (index * 3 + 4);
            planet.rotation.y += 0.01;
        });
    }

    getScene() {
        return this.group;
    }
}
