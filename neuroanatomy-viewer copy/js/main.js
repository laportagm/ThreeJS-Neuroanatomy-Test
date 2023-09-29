import * as THREE from 'three';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
let camera, renderer, controls, raycaster, mouse, selectedObject, originalMaterial, tooltip, targetPosition, mouseMoveTimeout, pointLight;

init();
animate();

function init() {
    // Scene setup
    scene.background = new THREE.Color(0x1D1F21); // space gray

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.6, 10000);
    camera.position.set(0, -55, 15);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    document.body.appendChild(renderer.domElement);

    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    setupControls();

    // Raycaster and mouse setup
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listeners setup
    setupEventListeners();

    // Lighting setup
    setupLights();

    // Tooltip setup
    tooltip = createTooltip();

    // Load 3D models
    loadGLBModels();

    // Listen to mouse move with throttling for performance
    document.addEventListener('mousemove', throttle(updatePointLightPosition, 16));
}

function setupControls() {
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.screenSpacePanning = true;
    controls.minDistance = 5;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    renderer.domElement.addEventListener('click', onClick, false);
    renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);

    const legendItems = document.querySelectorAll('#legend li');
    legendItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const modelName = event.target.getAttribute('data-model-name');
            highlightModelByName(modelName);
        });
    });
}

function setupLights() {
    // Ambient Light
    // This acts as a soft light from everywhere, ensuring there are no completely dark parts.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Directional Light 1
    // Acts as a sun-like source, coming from the top.
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight1.position.set(0, 10, 10);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    // Directional Light 2
    // Additional directional light coming from the bottom to balance shadows.
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(0, -10, -10);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);

    // Point Light
    // This is a light placed at a point in the scene. It shines in all directions and 
    // can be used to highlight certain parts of a model or scene.
    pointLight = new THREE.PointLight(0xffffff, 0.5, 500);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Hemisphere Light
    // Light positioned above the scene, with color gradients fading from one color to another along the Y-axis.
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.1);
    scene.add(hemisphereLight);
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '4px 8px';
    tooltip.style.background = 'rgba(0, 0, 0, 0.6)';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

function updatePointLightPosition(event) {
    const ratioX = event.clientX / window.innerWidth;
    const ratioY = event.clientY / window.innerHeight;

    pointLight.position.x = ratioX * 100 - 50;  // Range from -50 to 50 on X-axis
    pointLight.position.y = -(ratioY * 100 - 50);  // Range from -50 to 50 on Y-axis
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function loadGLBModels() {
    const loader = new GLTFLoader();

    const enableShadows = (object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    };

    const addModelToScene = (gltf) => {
        gltf.scene.traverse(enableShadows);
        scene.add(gltf.scene);
    };

    loader.load('/models/caudal-medulla.glb', addModelToScene);
    loader.load('/models/rostral-medulla.glb', addModelToScene);
    loader.load('/models/midbrain.glb', addModelToScene);
    loader.load('/models/pons.glb', addModelToScene);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
    event.preventDefault();
    const intersects = getIntersects(event.clientX, event.clientY);
    handleIntersections(intersects);
}

function onDoubleClick(event) {
    event.preventDefault();
    const intersects = getIntersects(event.clientX, event.clientY);
    if (intersects.length > 0) {
        intersects[0].object.visible = !intersects[0].object.visible;
    }
}

function onMouseMove(event) {
    event.preventDefault();
    const intersects = getIntersects(event.clientX, event.clientY);
    handleTooltip(intersects, event);
}

function getIntersects(x, y) {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObject(scene, true);
}

function handleIntersections(intersects) {
    if (intersects.length > 0) {
        if (selectedObject && originalMaterial) {
            selectedObject.material = originalMaterial;
        }
        selectedObject = intersects[0].object;
        originalMaterial = selectedObject.material;
        selectedObject.material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    } else if (selectedObject && originalMaterial) {
        selectedObject.material = originalMaterial;
        selectedObject = null;
    }
}

function handleTooltip(intersects, event) {
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.name) {
            tooltip.textContent = obj.name;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY + 10}px`;
        }
    } else {
        tooltip.style.display = 'none';
    }
}

function highlightModelByName(modelName) {
    const model = scene.getObjectByName(modelName);
    if (model) {
        if (selectedObject && originalMaterial) {
            selectedObject.material = originalMaterial;
        }
        selectedObject = model;
        originalMaterial = selectedObject.material;
        selectedObject.material = new THREE.MeshBasicMaterial({
            color: 0xFFFF00,
            opacity: 0.1,
            transparent: true,
        });
    }
}

function updateInfoPanel(modelName) {
    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');

    const modelInfo = {
        'caudal-medulla': {
            title: 'Caudal Medulla',
            description: 'The caudal medulla is the lower half of the medulla oblongata.'
        },
        'rostral-medulla': {
            title: 'Rostral Medulla',
            description: 'The rostral medulla is the upper half of the medulla oblongata.'
        },
        'midbrain': {
            title: 'Midbrain',
            description: 'The midbrain is part of the brainstem. It plays an important role in motor movement.'
        },
        'pons': {
            title: 'Pons',
            description: 'The pons is part of the brainstem, linking the medulla oblongata and the thalamus.'
        }
    };

    if (modelInfo[modelName]) {
        infoTitle.textContent = modelInfo[modelName].title;
        infoDescription.textContent = modelInfo[modelName].description;
        infoPanel.style.display = 'block';
    } else {
        infoPanel.style.display = 'none';
    }
}
