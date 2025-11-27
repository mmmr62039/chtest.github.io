console.log("THREE version:", THREE);

// صحنه
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// دوربین
let camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(5, 10, 10);

// رندر
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// کنترل دوربین
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// نور
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// بورد
let board = new THREE.Group();
for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
        let color = (x + z) % 2 === 0 ? 0xffffff : 0x111111;
        let tile = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 1),
            new THREE.MeshStandardMaterial({ color })
        );
        tile.position.set(x, 0, z);
        board.add(tile);
    }
}
scene.add(board);

// لود مدل
let mixer;
let loader = new THREE.GLTFLoader();
loader.load(
    "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.4, 0.4, 0.4);
        model.position.set(0, 0.2, 0);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
);

// انیمیشن
let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}
animate();
