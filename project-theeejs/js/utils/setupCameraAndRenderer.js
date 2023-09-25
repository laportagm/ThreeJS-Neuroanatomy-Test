import * as THREE from 'three';

export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
  camera.position.set(0, 0, 15);
  return camera;
}

export function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("#233143");
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}
