class Avatar {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.parts = {};
        this.isSpeaking = false;
        this.breathingSpeed = 0.02;
        this.breathingAmount = 0.1;
        this.time = 0;
    }
    
    create() {
        // Materials
        const skinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFDBB4,
            roughness: 0.8
        });
        
        const shirtMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4A90E2,
            roughness: 0.9
        });
        
        const pantsMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2C3E50,
            roughness: 0.9
        });
        
        const hairMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3D2314,
            roughness: 0.9
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.parts.head = new THREE.Mesh(headGeometry, skinMaterial);
        this.parts.head.position.y = 4.5;
        this.parts.head.castShadow = true;
        this.group.add(this.parts.head);
        
        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
        this.parts.hair = new THREE.Mesh(hairGeometry, hairMaterial);
        this.parts.hair.position.y = 4.5;
        this.parts.hair.position.z = 0.05;
        this.group.add(this.parts.hair);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.3
        });
        
        this.parts.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.parts.leftEye.position.set(-0.15, 4.5, 0.4);
        this.group.add(this.parts.leftEye);
        
        this.parts.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.parts.rightEye.position.set(0.15, 4.5, 0.4);
        this.group.add(this.parts.rightEye);
        
        // Body (torso)
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 2, 32);
        this.parts.body = new THREE.Mesh(bodyGeometry, shirtMaterial);
        this.parts.body.position.y = 2.8;
        this.parts.body.castShadow = true;
        this.group.add(this.parts.body);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
        
        this.parts.leftArm = new THREE.Mesh(armGeometry, skinMaterial);
        this.parts.leftArm.position.set(-0.7, 3.2, 0);
        this.parts.leftArm.rotation.z = 0.3;
        this.parts.leftArm.castShadow = true;
        this.group.add(this.parts.leftArm);
        
        this.parts.rightArm = new THREE.Mesh(armGeometry, skinMaterial);
        this.parts.rightArm.position.set(0.7, 3.2, 0);
        this.parts.rightArm.rotation.z = -0.3;
        this.parts.rightArm.castShadow = true;
        this.group.add(this.parts.rightArm);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
        
        this.parts.leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        this.parts.leftLeg.position.set(-0.3, 0.8, 0);
        this.parts.leftLeg.castShadow = true;
        this.group.add(this.parts.leftLeg);
        
        this.parts.rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        this.parts.rightLeg.position.set(0.3, 0.8, 0);
        this.parts.rightLeg.castShadow = true;
        this.group.add(this.parts.rightLeg);
        
        // Shoes
        const shoeGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.5);
        const shoeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8
        });
        
        this.parts.leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        this.parts.leftShoe.position.set(-0.3, -0.1, 0.1);
        this.group.add(this.parts.leftShoe);
        
        this.parts.rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        this.parts.rightShoe.position.set(0.3, -0.1, 0.1);
        this.group.add(this.parts.rightShoe);
        
        // Add speaking indicator (glow)
        const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0
        });
        this.parts.speakingGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.parts.speakingGlow.position.y = 4.5;
        this.group.add(this.parts.speakingGlow);
        
        // Position avatar
        this.group.position.set(0, 0, 0);
        this.scene.add(this.group);
    }
    
    animate() {
        this.time += this.breathingSpeed;
        
        // Breathing animation
        const breathOffset = Math.sin(this.time) * this.breathingAmount;
        this.parts.body.scale.x = 1 + breathOffset * 0.5;
        this.parts.body.scale.z = 1 + breathOffset * 0.5;
        this.parts.body.position.y = 2.8 + breathOffset * 0.2;
        
        // Subtle head movement
        this.parts.head.rotation.y = Math.sin(this.time * 0.5) * 0.05;
        this.parts.head.position.y = 4.5 + breathOffset * 0.1;
        
        // Arm sway
        this.parts.leftArm.rotation.z = 0.3 + Math.sin(this.time * 0.7) * 0.05;
        this.parts.rightArm.rotation.z = -0.3 - Math.sin(this.time * 0.7) * 0.05;
        
        // Speaking animation
        if (this.isSpeaking) {
            this.parts.speakingGlow.material.opacity = 0.3 + Math.sin(this.time * 5) * 0.2;
            this.parts.head.rotation.x = Math.sin(this.time * 8) * 0.02;
        } else {
            this.parts.speakingGlow.material.opacity *= 0.95;
        }
    }
    
    startSpeaking() {
        this.isSpeaking = true;
    }
    
    stopSpeaking() {
        this.isSpeaking = false;
    }
}