// OtherScene.js
export default function initOtherScene(scene) {
  // Remove all objects from the scene
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  // Add elements specific to the Other scene here
  // ...
}