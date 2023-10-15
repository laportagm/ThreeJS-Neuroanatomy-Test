import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Vector3,
    Raycaster,
    Color,
    Box3,
    HemisphereLight,
  } from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  
  // Initialize variables
  const mouse = new Vector3();
  const raycaster = new Raycaster();
  const models = [];
  let selectedObject = null;
  let camera, renderer, container;
  
  // Event handlers
  function onWindowResize(camera, renderer, container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  function onClick(event, camera) {
    event.preventDefault();
  
    const isDoubleClick = event.detail && event.detail === 2;
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(models, true);
  
    if (selectedObject) {
      selectedObject.material.opacity = 1;
      selectedObject.material.transparent = false;
    }
  
    if (intersects.length > 0) {
      const firstObject = intersects[0].object;
  
      if (isDoubleClick) {
        firstObject.visible = !firstObject.visible;
      } else {
        selectedObject = firstObject;
        selectedObject.material.opacity = 0.5;
        selectedObject.material.transparent = true;
      }
    } else {
      selectedObject = null;
    }
  }
  
  async function init() {
    const scene = new Scene();
    scene.background = new Color('#333333');
  
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  
    renderer = new WebGLRenderer({ antialias: true });
    container = document.getElementById('spinal-threejs-container');
  
    if (!container) {
      console.error('Container element with id "spinal-threejs-container" not found.');
      return;
    }
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.minDistance = 0.2;
    controls.maxDistance = 260;
  
    const ambientLight = new AmbientLight(0x404040, 1);
    ambientLight.position.set(1, 1, 1);
    scene.add(ambientLight);
  
    const directionalLight = new DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-2, 1, 0);
    scene.add(directionalLight);
  
    const hemisphereLight = new HemisphereLight(0xffffff, 0x404040, 0.7);
    hemisphereLight.position.set(0, 1, 0);
    scene.add(hemisphereLight);
  
    const modelPaths = [
      'assets/models/SpinalNerves1.glb',
      'assets/models/SpinalNerves2.glb',
      'assets/models/SpinalNerves3.glb',
      'assets/models/SpinalNerves4.glb',
      'assets/models/SpinalNerves5.glb',
      'assets/models/SpinalNerves6.glb',
    ];
  
    const loader = new GLTFLoader();
  
    try {
      const modelPromises = modelPaths.map(async (path) => {
        const gltf = await loader.loadAsync(path);
        return gltf;
      });
  
      const gltfs = await Promise.all(modelPromises);
  
      const globalBoundingBox = new Box3();
  
      gltfs.forEach((gltf) => {
        models.push(gltf.scene);
        scene.add(gltf.scene);
  
        const yOffset = 0;
        const zOffset = -25;
        gltf.scene.position.y += yOffset;
        gltf.scene.position.z += zOffset;
        const boundingBox = new Box3().setFromObject(gltf.scene);
        globalBoundingBox.union(boundingBox);
      });
  
      const center = globalBoundingBox.getCenter(new Vector3());
  
      const scale = 0.18;
      models.forEach((model) => model.scale.set(scale, scale, scale));
  
      const size = globalBoundingBox.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 380);
      const cameraZ = Math.abs(maxDim / Math.tan(fov * 1));
      camera.position.set(0, 28, 58);
  
      camera.lookAt(center);
  
      controls.target.copy(center);
    } catch (error) {
      console.error('Model loading error:', error);
      return;
    }
  
    window.addEventListener('resize', () => onWindowResize(camera, renderer, container));
    renderer.domElement.addEventListener('click', (event) => onClick(event, camera));
  
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
  
    animate();
  }
  
  // Initialize the application
  init().catch((error) => {
    console.error('Initialization error:', error);
  });
  