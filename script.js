import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.181.2/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.181.2/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 10, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// بورد ساده (مرکزنشین)
const board = new THREE.Group();
for (let x = 0; x < 8; x++) {
  for (let z = 0; z < 8; z++) {
    const color = (x + z) % 2 === 0 ? 0xffffff : 0x111111;
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.2, 1),
      new THREE.MeshStandardMaterial({ color })
    );
    tile.position.set(x - 3.5, 0, z - 3.5);
    board.add(tile);
  }
}
scene.add(board);

// لود مدل محلی
let mixer = null;
const loader = new GLTFLoader();

// مسیر نسبی به فایل داخل پوشه models
loader.load(
  './models/character.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.4, 0.4, 0.4);
    // قرار دادن مدل روی مرکز بورد
    model.position.set(0, 0.2, 0);
    scene.add(model);

    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach(clip => mixer.clipAction(clip).play());
    }
    console.log('Model loaded successfully');
  },
  (xhr) => {
    // پیشرفت بارگذاری (اختیاری)
    console.log(`Model ${ (xhr.loaded / xhr.total * 100).toFixed(1) }% loaded`);
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
animate();
