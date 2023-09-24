import * as THREE from 'three';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

// Initialize scene
const scene = new THREE.Scene();

// Initialize camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.set(0, 0, 5);

// Initialize renderer with antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// Add directional light that will move with the camera
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 1, 1).normalize();
scene.add(dirLight);

// Initialize GLTFLoader
const loader = new GLTFLoader();

// Load the model and center it
loader.load('./models/caudal-medulla.glb', (gltf) => {
  scene.add(gltf.scene);

  // Compute the bounding box of the loaded model
  const box = new THREE.Box3().setFromObject(gltf.scene);

  // Calculate the center of the bounding box
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Update OrbitControls to rotate around the center of the model
  controls.target.copy(center);
  controls.update();
});

// Event listener for window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update directional light to match camera position
  dirLight.position.copy(camera.position);

  controls.update();
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
