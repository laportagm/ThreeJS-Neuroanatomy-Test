// HomeScene.js
export default function initHomeScene(scene) {
  // Remove all objects from the scene
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  // Add elements specific to the Home scene here
  // ...
}