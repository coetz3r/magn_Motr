// =============================================================================
// MODULE IMPORTS (Required for ES Modules with Import Maps)
// =============================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function initmagnMotr() {
  const container = document.getElementById("container3D");

  if (!container) {
    setTimeout(initmagnMotr, 100);
    return;
  }

  if (container.querySelector("canvas")) return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  // =============================================================================
  // 1. SCENE & GLOBAL STATE
  // =============================================================================
  const scene = new THREE.Scene();

  let object;
  let rotor;
  const pistons = [];

  let mainAngle = 0;
  const ROTATION_SPEED = 0.02;

  const STROKE_LENGTH = 55;
  const BASE_SAFETY_GAP = 25.0;
  const PHASE_OFFSET = Math.PI / 2;

  // Ground Grid
  const gridHelper = new THREE.GridHelper(30, 30, 0x00ffcc, 0x444444);
  gridHelper.position.y = -5;
  scene.add(gridHelper);

  // Camera & Renderer
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Updated to use imported OrbitControls directly
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
  frontLight.position.set(100, 100, 100);
  scene.add(frontLight);

  // =============================================================================
  // 2. GLTF ASSET LOADING & MINIMAL BLUE PROGRESS BAR
  // =============================================================================
  
  // Minimal Progress Bar Track
  const progressBarTrack = document.createElement("div");
  progressBarTrack.style.position = "absolute";
  progressBarTrack.style.top = "50%";
  progressBarTrack.style.left = "50%";
  progressBarTrack.style.transform = "translate(-50%, -50%)";
  progressBarTrack.style.width = "220px";
  progressBarTrack.style.height = "6px";
  progressBarTrack.style.background = "rgba(255, 255, 255, 0.12)";
  progressBarTrack.style.borderRadius = "3px";
  progressBarTrack.style.overflow = "hidden";
  progressBarTrack.style.zIndex = "100";

  // Blue Fill Bar
  const progressBarFill = document.createElement("div");
  progressBarFill.style.width = "0%";
  progressBarFill.style.height = "100%";
  progressBarFill.style.background = "#0088ff"; // Vibrant Electric Blue
  progressBarFill.style.boxShadow = "0 0 8px #0088ff"; // Subtle glow
  progressBarFill.style.borderRadius = "3px";
  progressBarFill.style.transition = "width 0.15s ease-out";

  progressBarTrack.appendChild(progressBarFill);
  container.appendChild(progressBarTrack);

  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  const loader = new GLTFLoader();
  const modelPath = (typeof magnaData !== "undefined" && magnaData.modelUrl)
    ? magnaData.modelUrl
    : "assets/magn_Motr.glb";

  console.log("magnMotr loading model from:", modelPath);

  loader.load(
    modelPath,
    // 1. Success Callback
    function (gltf) {
      console.log("magnMotr: GLTF loaded successfully!", gltf);
      
      // Remove progress bar when finished
      progressBarTrack.remove();

      object = gltf.scene;
      scene.add(object);

      const outerHousingTerms = ["frame", "block", "carrier", "output"];

      object.traverse((child) => {
        if (child.isMesh) {
          const meshName = child.name.toLowerCase();
          const isHousing = outerHousingTerms.some((term) => meshName.includes(term));

          if (isHousing) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 0.35;
              mat.depthWrite = false;
            });
          } else {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
            });
          }
        }
      });

      rotor = object.getObjectByName("Rotor") || object.getObjectByName("rotor");

      pistons.length = 0;
      object.traverse((child) => {
        const cName = child.name.toLowerCase();
        if (cName.includes("piston") && !cName.includes("block") && !cName.includes("mag")) {
          pistons.push({
            mesh: child,
            baseZ: child.position.z
          });
        }
      });

      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      object.position.x -= center.x;
      object.position.y -= center.y;
      object.position.z -= center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 2.5;

      camera.position.set(0, maxDim / 2, cameraZ || 25);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    // 2. Progress Callback (Updates fill width)
    function (xhr) {
      if (xhr.lengthComputable && xhr.total > 0) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        progressBarFill.style.width = percent + "%";
      } else {
        progressBarFill.style.width = "100%";
      }
    },
    // 3. Error Callback
    function (error) {
      console.error("magnMotr GLTF Load Error:", error);
      progressBarTrack.remove();

      const errDiv = document.createElement("div");
      errDiv.style.position = "absolute";
      errDiv.style.top = "15px";
      errDiv.style.left = "15px";
      errDiv.style.color = "#ff4444";
      errDiv.style.fontFamily = "monospace";
      errDiv.style.fontSize = "12px";
      errDiv.style.background = "rgba(0, 0, 0, 0.9)";
      errDiv.style.padding = "10px 14px";
      errDiv.style.borderRadius = "4px";
      errDiv.style.zIndex = "999";
      errDiv.style.border = "1px solid #ff4444";
      errDiv.innerHTML = `<strong>magnMotr Error:</strong> Cannot load 3D file.<br>Path: <code>${modelPath}</code>`;
      container.appendChild(errDiv);
    }
  );

  // =============================================================================
  // 3. ANIMATION LOOP & RESIZE HANDLER
  // =============================================================================
  function animate() {
    requestAnimationFrame(animate);

    if (rotor) {
      mainAngle += ROTATION_SPEED;
      rotor.rotation.z = mainAngle;

      pistons.forEach((pistonObj, index) => {
        const pairPhase = (index % 2 === 0) ? 0 : Math.PI;
        const pushFactor = 0.5 + 0.5 * Math.sin((mainAngle * 2) + pairPhase + PHASE_OFFSET);
        pistonObj.mesh.position.z = pistonObj.baseZ + BASE_SAFETY_GAP - (pushFactor * STROKE_LENGTH);
      });
    }

    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initmagnMotr);
} else {
  initmagnMotr();
}