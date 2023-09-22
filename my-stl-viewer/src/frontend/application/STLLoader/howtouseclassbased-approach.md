# How to Use This Class-Based Approach:

Initialization: Create an instance of the STLModel class for each STL file you want to load.

# *javascript*
const caudalMedulla = new STLModel('path/to/caudal-medulla.stl', scene);
        Loading: Use the .load() method to load the model into the scene.

# *javascript*
caudalMedulla.load().then((mesh) => {
  console.log('Model loaded:', mesh);
});
        Updating Options: To update properties like color or position, use the .updateOptions() method.


# *javascript*
caudalMedulla.updateOptions({ color: 0xff0000, position: { x: 10, y: 20, z: 30 } });


# Future Customizations:
* You can easily add new methods to the STLModel class for additional functionalities like interactivity, annotations, and more.
* You can also extend this class to handle different types of 3D models, not just STLs.
* This class-based approach makes it easier to manage multiple STL models and allows for more complex features and customizations.




