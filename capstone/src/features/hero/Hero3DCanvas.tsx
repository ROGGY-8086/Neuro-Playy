import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  reducedMotion?: boolean;
}

// Procedural anatomical 3D brain hemisphere generator
function createHemisphereGeometry(isRight: boolean): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(1.15, 36, 32);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Anatomical proportions: elongated front-to-back (Z), curved top (Y), hemisphere width (X)
    v.x *= 0.76;
    v.y *= 0.94;
    v.z *= 1.24;

    // Hemispheric separation along X midline (longitudinal fissure)
    const side = isRight ? 1 : -1;
    v.x = side * (0.14 + Math.abs(v.x) * 0.88);

    // Temporal lobe lateral expansion (lower middle)
    if (v.y < -0.05 && v.z > -0.25 && v.z < 0.6) {
      v.x += side * 0.14;
    }

    // Frontal pole rounding (front upper)
    if (v.z > 0.6) {
      v.y *= 0.92;
      v.x *= 0.90;
    }

    // Occipital lobe rounding & cerebellum slope (back lower)
    if (v.z < -0.4 && v.y < -0.15) {
      v.y -= 0.12;
      v.x *= 0.86;
    }

    // Cortical convolutions (Gyri ridges & Sulci grooves)
    const folds =
      Math.sin(v.x * 10.0) * Math.cos(v.y * 10.0) * Math.sin(v.z * 10.0) * 0.075 +
      Math.sin(v.y * 18.0 + v.z * 9.0) * 0.035;

    v.addScaledVector(v.clone().normalize(), folds);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    if (reducedMotion) return;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for the 3D architectural neural lattice
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Isometric Wireframe Outer Cube Structure (Framing container)
    const boxGeometry = new THREE.BoxGeometry(3.2, 3.2, 3.2);
    const boxEdges = new THREE.EdgesGeometry(boxGeometry);
    const boxLineMaterial = new THREE.LineBasicMaterial({
      color: 0x121316,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const boxWireframe = new THREE.LineSegments(boxEdges, boxLineMaterial);
    mainGroup.add(boxWireframe);

    // Outer Cube Corner Indicator Nodes (Signal vertices)
    const cornerNodeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const cornerNodeMaterial = new THREE.MeshBasicMaterial({ color: 0xf5b800 });
    const cornerNodes: THREE.Mesh[] = [];

    const cornerPositions = [
      [1.6, 1.6, 1.6],
      [-1.6, 1.6, 1.6],
      [1.6, -1.6, 1.6],
      [-1.6, -1.6, 1.6],
      [1.6, 1.6, -1.6],
      [-1.6, 1.6, -1.6],
      [1.6, -1.6, -1.6],
      [-1.6, -1.6, -1.6],
    ];

    cornerPositions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(cornerNodeGeometry, cornerNodeMaterial);
      node.position.set(x, y, z);
      mainGroup.add(node);
      cornerNodes.push(node);
    });

    // 2. Circular Orbital Line Wrapping Around the Cube
    const ringGeometry = new THREE.TorusGeometry(2.55, 0.018, 12, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x646675,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.8;
    ring.rotation.y = 0.22;
    mainGroup.add(ring);

    // 3. BRAIN DIAGRAM (Enclosed inside the cube)
    const brainGroup = new THREE.Group();
    mainGroup.add(brainGroup);

    // Left & Right Cerebral Hemispheres
    const brainWireMaterial = new THREE.LineBasicMaterial({
      color: 0x22242c,
      linewidth: 1.2,
      transparent: true,
      opacity: 0.65,
    });

    // Left Hemisphere Wireframe
    const leftGeom = createHemisphereGeometry(false);
    const leftWireframe = new THREE.LineSegments(new THREE.WireframeGeometry(leftGeom), brainWireMaterial);
    brainGroup.add(leftWireframe);

    // Right Hemisphere Wireframe
    const rightGeom = createHemisphereGeometry(true);
    const rightWireframe = new THREE.LineSegments(new THREE.WireframeGeometry(rightGeom), brainWireMaterial);
    brainGroup.add(rightWireframe);

    // 3. Synaptic Neural Pathways & Corpus Callosum Bridging Lines
    const neuralLineMaterial = new THREE.LineBasicMaterial({
      color: 0xf5b800,
      linewidth: 1,
      transparent: true,
      opacity: 0.6,
    });

    const synapsePoints: THREE.Vector3[] = [];
    const neuralBridgeGeom = new THREE.BufferGeometry();

    // Central cross-hemisphere connections
    for (let k = -0.6; k <= 0.6; k += 0.25) {
      synapsePoints.push(new THREE.Vector3(-0.4, 0.1 + Math.sin(k * 3) * 0.2, k));
      synapsePoints.push(new THREE.Vector3(0.4, 0.1 + Math.sin(k * 3) * 0.2, k));
    }
    // Front-to-back prefrontal to occipital neural tract
    synapsePoints.push(new THREE.Vector3(-0.35, 0.2, 0.9), new THREE.Vector3(-0.35, 0.1, -0.7));
    synapsePoints.push(new THREE.Vector3(0.35, 0.2, 0.9), new THREE.Vector3(0.35, 0.1, -0.7));

    neuralBridgeGeom.setFromPoints(synapsePoints);
    const neuralBridges = new THREE.LineSegments(neuralBridgeGeom, neuralLineMaterial);
    brainGroup.add(neuralBridges);

    // 4. Glowing Cortical Synaptic Nodes (Distributed over brain lobes)
    const brainNodeGeom = new THREE.SphereGeometry(0.055, 10, 10);
    const brainNodeMat = new THREE.MeshBasicMaterial({ color: 0xf5b800 });
    const corticalNodes: THREE.Mesh[] = [];

    const brainNodePositions = [
      // Prefrontal cortex (front)
      [0.45, 0.35, 0.95],
      [-0.45, 0.35, 0.95],
      [0.35, 0.05, 1.05],
      [-0.35, 0.05, 1.05],
      // Parietal / Motor cortex (top)
      [0.55, 0.85, 0.1],
      [-0.55, 0.85, 0.1],
      [0.2, 0.92, -0.1],
      [-0.2, 0.92, -0.1],
      // Temporal lobe (lateral bottom)
      [0.85, -0.2, 0.2],
      [-0.85, -0.2, 0.2],
      // Occipital lobe (visual back)
      [0.4, 0.15, -0.95],
      [-0.4, 0.15, -0.95],
      // Midbrain corpus callosum
      [0.18, 0.1, 0.0],
      [-0.18, 0.1, 0.0],
    ];

    brainNodePositions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(brainNodeGeom, brainNodeMat);
      node.position.set(x, y, z);
      brainGroup.add(node);
      corticalNodes.push(node);
    });

    // Initial slight isometric tilt
    mainGroup.rotation.x = 0.35;
    mainGroup.rotation.y = 0.45;

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0.35;
    let targetY = 0.45;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.4;
      mouseY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation with mouse influence
      targetX = 0.35 + mouseY * 0.45;
      targetY = 0.45 + mouseX * 0.75 + elapsedTime * 0.12;

      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05;

      // Subtle biological breathing pulse for brain
      const brainPulse = 1 + Math.sin(elapsedTime * 2.2) * 0.03;
      brainGroup.scale.set(brainPulse, brainPulse, brainPulse);

      // Pulse synaptic nodes
      const nodeScale = 1 + Math.sin(elapsedTime * 3.5) * 0.2;
      corticalNodes.forEach((n) => n.scale.set(nodeScale, nodeScale, nodeScale));
      cornerNodes.forEach((n) => n.scale.set(nodeScale, nodeScale, nodeScale));

      // Rotate the wrapping circular ring
      ring.rotation.z = elapsedTime * 0.16;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      leftGeom.dispose();
      rightGeom.dispose();
      neuralBridgeGeom.dispose();
      ringGeometry.dispose();
      boxGeometry.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion || !webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <svg
          viewBox="0 0 300 300"
          className="w-64 h-64 opacity-85"
          fill="none"
          stroke="#121316"
          strokeWidth="1.5"
        >
          {/* Static Isometric Outer Cube */}
          <polygon points="150,30 270,100 270,220 150,290 30,220 30,100" fill="#FAF9F5" />
          <line x1="150" y1="30" x2="150" y2="290" />
          <line x1="150" y1="160" x2="270" y2="100" />
          <line x1="150" y1="160" x2="30" y2="100" />

          {/* Cube Golden Corner Nodes */}
          <circle cx="150" cy="30" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />
          <circle cx="270" cy="100" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />
          <circle cx="30" cy="100" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />
          <circle cx="270" cy="220" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />
          <circle cx="30" cy="220" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />
          <circle cx="150" cy="290" r="5" fill="#F5B800" stroke="#121316" strokeWidth="1.5" />

          {/* Circular Orbital Ring Wrapping Around Cube */}
          <ellipse
            cx="150"
            cy="160"
            rx="128"
            ry="58"
            transform="rotate(-22 150 160)"
            stroke="#646675"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />

          {/* Detailed Brain Diagram in Center */}
          <g transform="translate(100, 105)" stroke="#121316" strokeWidth="1.5" fill="none">
            {/* Left Hemisphere */}
            <path d="M48,15 C30,15 15,28 15,45 C15,55 20,62 18,72 C16,80 28,88 48,88" strokeWidth="1.8" />
            <path d="M48,15 C40,25 35,35 40,45 C45,55 35,65 42,75 C45,80 48,88 48,88" strokeDasharray="3 2" />
            <path d="M22,35 C28,32 35,38 32,48" strokeWidth="1.2" />
            <path d="M22,55 C28,52 36,58 30,68" strokeWidth="1.2" />

            {/* Right Hemisphere */}
            <path d="M52,15 C70,15 85,28 85,45 C85,55 80,62 82,72 C84,80 72,88 52,88" strokeWidth="1.8" />
            <path d="M52,15 C60,25 65,35 60,45 C55,55 65,65 58,75 C55,80 52,88 52,88" strokeDasharray="3 2" />
            <path d="M78,35 C72,32 65,38 68,48" strokeWidth="1.2" />
            <path d="M78,55 C72,52 64,58 70,68" strokeWidth="1.2" />

            {/* Longitudinal Fissure (Center Split) */}
            <line x1="50" y1="12" x2="50" y2="90" strokeWidth="2" strokeDasharray="4 2" />

            {/* Synaptic Nodes */}
            <circle cx="35" cy="28" r="3" fill="#F5B800" stroke="#121316" strokeWidth="1" />
            <circle cx="65" cy="28" r="3" fill="#F5B800" stroke="#121316" strokeWidth="1" />
            <circle cx="28" cy="62" r="3" fill="#F5B800" stroke="#121316" strokeWidth="1" />
            <circle cx="72" cy="62" r="3" fill="#F5B800" stroke="#121316" strokeWidth="1" />
            <circle cx="50" cy="48" r="3" fill="#F5B800" stroke="#121316" strokeWidth="1" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{ minHeight: '340px' }}
      aria-label="Interactive 3D isometric cube enclosing an anatomical neural brain diagram"
    />
  );
};
