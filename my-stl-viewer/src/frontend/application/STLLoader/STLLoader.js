// src/frontend/application/STLLoader/index.js

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export class STLModel {
  constructor(path, scene, options = {}) {
    this.path = path;
    this.scene = scene;
    this.loader = new STLLoader();
    this.mesh = null;
    this.defaultOptions = {
      color: 0x00ff00,
      position: { x: 0, y: 0, z: 0 },
      // Add more default options here
    };
    this.options = { ...this.defaultOptions, ...options };
  }

  load() {
    return new Promise((resolve, reject) => {
      this.loader.load(this.path, (geometry) => {
        const material = new THREE.MeshPhongMaterial({ color: this.options.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.options.position.x, this.options.position.y, this.options.position.z);
        this.scene.add(this.mesh);
        resolve(this.mesh);
      }, null, reject);
    });
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    if (this.mesh) {
      if (newOptions.color) {
        this.mesh.material.color.set(newOptions.color);
      }
      if (newOptions.position) {
        this.mesh.position.set(newOptions.position.x, newOptions.position.y, newOptions.position.z);
      }
      // Update other properties here
    }
  }

  // Add more methods for interactivity, annotations, etc.
}
