import * as THREE from 'three';

// Initialize Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Lights
const light = new THREE.PointLight(0xffffff);
light.position.set(50, 50, 50);
scene.add(light);

// Dynamic import of SimpleSTLLoader and loading STL files
// This part uses code splitting via dynamic import
import(/* webpackChunkName: "stl-loader" */ './src/frontend/application/STLLoader/STLLoader')
  .then(({ default: SimpleSTLLoader }) => {
    const mySTLLoader = new SimpleSTLLoader(scene);

    // Function to load an STL file
    function loadSTL(filename, position = { x: 0, y: 0, z: 0 }) {
      mySTLLoader.loadModel(filename, position)
        .then((mesh) => {
          // Additional logic here, if needed
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }

    // Load specific STL files
    loadSTL('caudal-medulla.stl', { x: -10, y: 0, z: 0 });
    loadSTL('midbrain.stl', { x: 10, y: 0, z: 0 });
    loadSTL('pons.stl', { x: 0, y: 10, z: 0 });
    loadSTL('rostral-medulla.stl', { x: 0, y: -10, z: 0 });
  })
  .catch((error) => {
    console.error('Failed to load STL Loader:', error);
  });

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
