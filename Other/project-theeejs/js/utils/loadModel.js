import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'; // Import the entire THREE namespace to use Box3 and Vector3

export default function loadModel(modelPath, material, scene, controls) {
  const loader = new GLTFLoader();
  
  loader.load(modelPath, (gltf) => {
    const clonedMaterial = material.clone(); // Clone the material

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = clonedMaterial; // Use the cloned material
        child.material.needsUpdate = true;
      }
    });

    // Extract the file name from the model path and set it as the name of the scene
    const fileName = modelPath.split('/').pop().split('.')[0]; // Extracts 'caudal-medulla' from './models/caudal-medulla.glb'
    gltf.scene.name = fileName;  // Assign the name to the model

    // Add the loaded model to the main scene
    scene.add(gltf.scene);

    // Update the controls to focus on the loaded model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    controls.target.copy(center);
    controls.update();
  });
}
