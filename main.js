import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('bg.jpg');
scene.background = backgroundImage;


const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "#0B9ED2",
    roughness: 0.5,
    metalness: 0.4
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// light
const light = new THREE.PointLight(0xFFFFFF, 500, 100);
light.position.set(0, 10, 10);
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);



// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true 
controls.enablePan = false
controls.enableZoom = false 
controls.autoRotate = true
controls.autoRotateSpeed = 5

//resize
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
})



const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop()

//timeline

const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1})
tl.fromTo('nav', {y: '-100%'}, {y: '0%'})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

//Colors

let mouseOver = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseOver = true))
window.addEventListener("mouseup", () => (mouseOver = false))

window.addEventListener('mousemove', (event) => {
    if (mouseOver) {
        rgb = [
            Math.round((event.clientX / sizes.width) * 255),
            Math.round((event.clientY / sizes.height) * 255),
            150
        ]

        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
    }
})