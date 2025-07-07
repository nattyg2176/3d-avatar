class Scene3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Set up camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Set up renderer
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Set up controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        
        // Add lighting
        this.addLighting();
        
        // Create room
        this.createRoom();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    addLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light (room light)
        const pointLight = new THREE.PointLight(0xffd700, 0.5, 20);
        pointLight.position.set(0, 8, 0);
        this.scene.add(pointLight);
    }
    
    createRoom() {
        const roomSize = 20;
        const wallHeight = 10;
        
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B7355,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Walls
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE8DCC0,
            roughness: 0.9
        });
        
        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomSize, wallHeight),
            wallMaterial
        );
        backWall.position.z = -roomSize / 2;
        backWall.position.y = wallHeight / 2;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomSize, wallHeight),
            wallMaterial
        );
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -roomSize / 2;
        leftWall.position.y = wallHeight / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomSize, wallHeight),
            wallMaterial
        );
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = roomSize / 2;
        rightWall.position.y = wallHeight / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
        
        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const ceilingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            roughness: 0.9
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = wallHeight;
        this.scene.add(ceiling);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}