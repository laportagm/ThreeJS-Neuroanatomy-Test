import * as THREE from 'three';
import { STLLoader as ThreeSTLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

class SimpleSTLLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new ThreeSTLLoader();
  }

  loadModel(filename, position = { x: 0, y: 0, z: 0 }) {
    return new Promise((resolve, reject) => {
      this.loader.load(`assets/stl-files/${filename}`, (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);

        this.scene.add(mesh);
        resolve(mesh);
      }, undefined, (error) => {
        reject(error);
      });
    });
  }
}

export default SimpleSTLLoader;