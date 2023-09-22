// src/frontend/App.js

import React, { useEffect } from 'react';
import { loadSTL, addToScene } from './application/STLLoader/STLLoader';  // Import the functions from STLLoader.js
import * as THREE from 'three';  // Import THREE library for Three.js

function App() {
  // Initialize Three.js viewer here (you can do this inside a useEffect as well)
  
  useEffect(() => {
    // Initialize your Three.js scene, camera, and renderer here
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create an array to hold paths to your STL files
    const stlFilePaths = [
      'path/to/caudal-medulla.stl',
      'path/to/midbrain.stl',
      'path/to/pons.stl',
      'path/to/rostral-medulla.stl',
    ];

    // Load the STL files
    stlFilePaths.forEach((filePath, index) => {
      loadSTL(filePath, (mesh) => {
        // Add mesh to the scene at different positions for demonstration
        addToScene(mesh, scene, { x: index * 10, y: 0, z: 0 });
      });
    });

    // Your animation or render loop here
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, []);  // Empty dependency array means this useEffect runs once when the component mounts

  return (
    <div>
      {/* Your React components go here */}
    </div>
  );
}

export default App;

