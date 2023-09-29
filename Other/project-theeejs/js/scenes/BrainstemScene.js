// BrainstemScene.js
import setupLights from '../utils/setupLights';
import loadModel from '../utils/loadModel';

export default function initBrainstemScene(scene, material, controls) {
  // Remove all objects from the scene
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // Add lights and models specific to the Brainstem scene
  setupLights(scene);
  loadModel('./models/caudal-medulla.glb', material, scene, controls);
  loadModel('./models/rostral-medulla.glb', material, scene, controls);
  loadModel('./models/pons.glb', material, scene, controls);
  loadModel('./models/midbrain.glb', material, scene, controls);
}