import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//instantiate the scene and set a background colour

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); 

//instantiate the renderer and composer and set size to half the window

const canvas = document.getElementById('threejs-canvas');

const renderer = new THREE.WebGLRenderer(
  {canvas: canvas,
  alpha: true,
  antialias: true}
);

renderer.setPixelRatio(window.devicePixelRatio);

// instantiate the camera


const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 30)
camera.position.z = 5

scene.add(camera)


const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.3,    
  0.2,    
  0.9    
);
composer.addPass(bloomPass);

let displayedModel;

const loader = new GLTFLoader();

let glowColor = 0xffffff; 

loader.load( `/3dmodels/rubix.glb`, function ( gltf ) {
  displayedModel = gltf.scene
  displayedModel.position.set(1, 0, 0); // Center model
  displayedModel.scale.set(3,3,3);
  console.log(displayedModel.children[0])
  scene.add(displayedModel)

   displayedModel.traverse((child) => {
    if (child.isMesh && child.material) {
      if ('emissive' in child.material) {
        glowColor = child.material.color; 
        child.material.emissive.set(glowColor); // White glow
        child.material.emissiveIntensity = 5; // Increase for stronger glow
      }
    }
  });

}, undefined, function ( error ) {

  console.error( error );

} );

// add lights to the scene



const light = new THREE.AmbientLight(0x404040, 0);
scene.add( light );



renderer.setClearColor(0xffffff, 0);

renderer.setSize(canvas.clientWidth, canvas.clientHeight);

console.log(scene)

// resize the render area when window is resized

window.addEventListener('resize', () => {
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
});

//render loop which updates camera position and size based on window size and orbit controls
function animate() {
    
  if (displayedModel) {
    displayedModel.rotation.y += 0.005; // Spin slowly around vertical axis
  }

  composer.render();
  
  
}

renderer.setAnimationLoop( animate );




















