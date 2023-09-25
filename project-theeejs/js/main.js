import * as THREE from 'three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import setupLights from './utils/setupLights';
import loadModel from './utils/loadModel';
import { setupCamera, setupRenderer } from './utils/setupCameraAndRenderer';
import setupEventListeners from './utils/setupEventListeners';
import { TextureLoader } from 'three';

// New imports
import initHomeScene from './scenes/HomeScene';
import initBrainstemScene from './scenes/BrainstemScene';
import initOtherScene from './scenes/OtherScene';

// Initialize scene, camera, renderer, and controls
const scene = new THREE.Scene();
const camera = setupCamera();
const renderer = setupRenderer();

// Set the background color to space gray
renderer.setClearColor(0x1D1F21, 1);

const controls = new OrbitControls(camera, renderer.domElement);

// Initialize Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let highlightedObject = null;

// Initialize infoBox
const infoBox = document.getElementById('infoBox');

// Load textures and create material
const textureLoader = new TextureLoader();
const baseColorMap = textureLoader.load('/assets/textures/basecolor/male_fullarm_skin_1_Base_Color.jpg');
const normalMap = textureLoader.load('/assets/textures/normal/male_fullarm_skin_1_Normal.jpg');
const metallicMap = textureLoader.load('/assets/textures/metallic/male_fullarm_skin_1_Metallic.jpg');
const material = new THREE.MeshStandardMaterial({
  map: baseColorMap,
  normalMap: normalMap,
  metalnessMap: metallicMap,
});

// Initialize default scene
initHomeScene(scene);

// Add event listeners for the navigation tabs
document.getElementById('homeTab').addEventListener('click', () => initHomeScene(scene));
document.getElementById('brainstemTab').addEventListener('click', () => initBrainstemScene(scene, material, controls));
document.getElementById('otherTab').addEventListener('click', () => initOtherScene(scene));

// Your existing highlightModel function
function highlightModel(event) {
  // ...existing code...
}

// Setup event listeners
setupEventListeners(renderer, camera, scene);

// New event listener for mouse click to highlight models
window.addEventListener('click', highlightModel);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start animation loop
animate();
