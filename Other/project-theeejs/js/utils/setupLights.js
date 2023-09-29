import * as THREE from 'three';

export default function setupLights(scene) {
  const ambientLight = new THREE.AmbientLight(0x888888);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, -5, 5);
  const pointLight = new THREE.PointLight(0xffaa00, 4, 200);
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 200, 0);
  scene.add(ambientLight, dirLight, pointLight, hemiLight);
}
