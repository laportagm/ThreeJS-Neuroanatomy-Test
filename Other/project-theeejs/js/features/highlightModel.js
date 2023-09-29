let highlightedObject = null;  // Store the currently highlighted object

function highlightModel(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Reset the previously highlighted object, if any
  if (highlightedObject) {
    highlightedObject.material = highlightedObject.originalMaterial;
  }

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.isMesh) {
      object.originalMaterial = object.material; // Save original material
      const newMaterial = object.material.clone();
      newMaterial.emissive.set(0xffaa00);  // Set emissive to orange
      object.material = newMaterial;
      highlightedObject = object;  // Update the currently highlighted object
    }
  } else {
    highlightedObject = null;  // No object is highlighted if clicked outside
  }
}
