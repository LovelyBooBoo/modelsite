import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fs from "fs";

// assign model details on HTML page to variables

const displayedName = document.getElementById('displayed_name')
const displayedSize = document.getElementById('displayed_size')
const displayedFormat = document.getElementById('displayed_format')
const displayedVertices = document.getElementById('displayed_vertices')
const displayedFaces= document.getElementById('displayed_faces')

//instantiate the scene and set a background colour

const scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load("assets/backgrounds/gradient_background-01.png");
scene.background = texture;

//load the 3D and declare variables about its data

let modelName;

const loader = new GLTFLoader();

let displayedModel;
let vertexCount = 0;
let facesCount = 0;
let format = 'glb';
let modelFile;  
let fileSize = '0';


// extract the name of the model file from the site's current url 

const pageUrl = window.location.href

console.log(pageUrl);

const pageId = function (pageUrl) {

  return pageUrl.slice(pageUrl.indexOf("spaceship"), pageUrl.length - 5);
}

console.log(pageId(pageUrl));

loader.load( `/3dmodels/${pageId(pageUrl)}.glb`, function ( gltf ) {
  displayedModel = gltf.scene
  console.log(displayedModel.children[0])
  scene.add(displayedModel)
  extractModelData(displayedModel);
// experimental animation mixer

}, undefined, function ( error ) {

  console.error( error );

} );

function extractModelData(model) {
  //get the model name then add to html

  modelName = displayedModel.children[0].userData.name
  const paraName = document.createElement("p");
  const nodeName = document.createTextNode(`${modelName}`);
  paraName.appendChild(nodeName);
  displayedName.appendChild(nodeName);

  //get the model's vertices and faces 

  displayedModel.traverse(function (object) {
    if (object.isMesh) {
      vertexCount += Number(object.geometry.attributes.position.count)
      facesCount+= Number(object.geometry.index.count / 3)
    }
  }
) 
//add the face and vertex total to html

    const paraVertices = document.createElement("p");
    const nodeVertices = document.createTextNode(`${vertexCount}`);
    paraVertices.appendChild(nodeVertices);
    displayedVertices.appendChild(nodeVertices);
    console.log(`The vertex count is ${vertexCount}`)

    const paraFaces = document.createElement("p");
    const nodeFaces = document.createTextNode(`${facesCount}`);
    paraFaces.appendChild(nodeFaces);
    displayedFaces.appendChild(nodeFaces);

    const paraFormat = document.createElement("p");
    const nodeFormat = document.createTextNode(`.${format}`);
    paraFormat.appendChild(nodeFormat);
    displayedFormat.appendChild(nodeFormat);
  
    const paraSize = document.createElement("p");
    const nodeSize = document.createTextNode(`${fileSize}mb`);
    paraSize.appendChild(nodeSize);
    displayedSize.appendChild(nodeSize);
}
  

// add lights to the scene

const color = 0xFFFFFF;
const intensity = 6;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(0, 10, 0);
light2.target.position.set(-5, 0, 0);
scene.add(light2);
scene.add(light2.target);

const light = new THREE.AmbientLight(0x404040, 4);
scene.add( light );

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0,25,0);
scene.add(spotLight);

// instantiate the camera

const canvas = document.querySelector('canvas.threejs')

const camera = new THREE.PerspectiveCamera(50, (window.innerWidth / 2) / (window.innerHeight/ 1.65), 0.1, 30)
camera.position.z = 5

scene.add(camera)


//instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//instantiate the renderer and set size to half the window

const renderer = new THREE.WebGLRenderer(
  {canvas: canvas,
  alpha: true}
);

renderer.setClearColor(0xffffff, 0);

renderer.setSize(window.innerWidth / 2, window.innerHeight / 1.65)

console.log(scene)

// resize the render area when window is resized

window.addEventListener('resize', () =>{
  if (window.innerWidth > 1004) {
    camera.aspect = (window.innerWidth / 2) / (window.innerHeight / 1.65);
  } else {
    camera.aspect = 502/ 674;
  }
  camera.updateProjectionMatrix()
  if (window.innerWidth > 1004) {  
  renderer.setSize(window.innerWidth / 2, window.innerHeight /1.65);
  } else {
  renderer.setSize(502, 674);
  }
})



//render loop which updates camera position and size based on window size and orbit controls



function animate() {
  

  renderer.render(scene, camera);
  controls.update();
  
}

renderer.setAnimationLoop( animate );

// add product minis to the sidebar next to the main viewer canvas

const productSuggestedBar = document.getElementById('suggested-box');

productSuggestedBar.classList.add("sidebar-image-text");

const suggestBarPopulator = function (shipNumber, description) {
  const divProduct = document.createElement("div");
  const productSidebarEntry = new Image();
  productSidebarEntry.src = `/3dmodelthumbs/spaceship${shipNumber}.png`;
  productSidebarEntry.onclick = function () {
    window.location.href = `spaceship${shipNumber}.html`;
  };

  divProduct.appendChild(productSidebarEntry);

const paraProduct = document.createElement("span");
    const nodeProduct = document.createTextNode(`${description}`);
    paraProduct.appendChild(nodeProduct);
    divProduct.appendChild(paraProduct);
    productSuggestedBar.appendChild(divProduct);
}

const shipNameDatabase = [
'Starweaver', 'Nebulark', 'Void Seraph', 'Crimson Drift', 'Solstice Warden', 'Echo Vortex', 'Zenith Ember', 'Quantum Mirage', 'Iron Halo', 'Celestara',
'Rift Nomad', 'Polaris Wraith', 'Emberwake', 'Nova Talon', 'Obsidian Pulse', 'Arcflare', 'Vanta Whisper', 'Chrono Lancer', 'Eclipse Howl', 'Stellar Revenant',
'Ion Dagger', 'Phantom Spiral', 'Radiant Husk', 'Thorneclipse', 'Spectra Vane', 'Warp Lynx', 'Astral Glaive', 'Duskborne', 'Cryo Vesper', 'Helix Marauder',
'Zephyr Coil', 'Gravemind Echo', 'Lumen Fang', 'Parallax Shade', 'Riftborne', 'Embercoil', 'Solara Drift', 'Voidhowl', 'Nexus Ember', 'Halcyon Rift',
'Pyre Serpent', 'Umbra Lance', 'Titan Wisp', 'Flux Nomad', 'Celestial Thorn', 'Obscura Ray', 'Prism Warden', 'Nightflare', 'Arc Wyrm', 'Zenith Shard',
'Phantom Ember', 'Nova Coil', 'Iron Specter', 'Chrono Whisper', 'Starbane', 'Rift Seraph', 'Ember Vane', 'Void Talon', 'Polaris Drift', 'Cryo Howl',
'Gravemind Pulse', 'Solstice Fang', 'Warp Revenant', 'Ion Husk', 'Radiant Marauder', 'Lumen Spiral', 'Duskcoil', 'Zephyr Ember', 'Obsidian Warden', 'Vanta Nomad',
'Halcyon Talon', 'Celestara Howl', 'Flux Shard', 'Umbra Glaive', 'Titan Vortex', 'Arcflare Whisper', 'Nova Thorn', 'Phantom Coil', 'Chrono Drift', 'Iron Vane',
'Starweaver Pulse', 'Rift Ember', 'Void Revenant', 'Polaris Husk', 'Cryo Marauder', 'Gravemind Spiral', 'Solstice Coil', 'Warp Ember', 'Ion Warden', 'Radiant Nomad',
'Lumen Talon', 'Dusk Howl', 'Zephyr Shard', 'Obsidian Glaive', 'Vanta Vortex', 'Halcyon Whisper', 'Celestara Thorn', 'Flux Coil'
];

for (let i = 1; i < 7; i++) {
  
  suggestBarPopulator(i, shipNameDatabase[i]);
  
  };


/*const divProduct1 = document.createElement("div");

divProduct1.appendChild(productSidebarEntry1);

const paraProduct1 = document.createElement("span");
    const nodeProduct1 = document.createTextNode(`Starfury`);
    paraProduct1.appendChild(nodeProduct1);
    divProduct1.appendChild(paraProduct1);
    productSuggestedBar.appendChild(divProduct1);
    
const divProduct2 = document.createElement("div");

divProduct2.appendChild(productSidebarEntry2);

const paraProduct2 = document.createElement("span");
const nodeProduct2 = document.createTextNode(`NASA ship`);
    paraProduct2.appendChild(nodeProduct2);
    divProduct2.appendChild(paraProduct2);
    productSuggestedBar.appendChild(divProduct2);

const divProduct3 = document.createElement("div");

divProduct3.appendChild(productSidebarEntry3);

const paraProduct3 = document.createElement("span");
const nodeProduct3 = document.createTextNode(`Funky craftoid`);
    paraProduct3.appendChild(nodeProduct3);
    divProduct3.appendChild(paraProduct3);
    productSuggestedBar.appendChild(divProduct3);
*/

// add a download button to the right sidebar next to the viewer

const rightSidebar = document.getElementById('right-sidebar');

const downloadArea = document.createElement("div");   
const downloadButton = document.createElement("button");
downloadButton.setAttribute('content', 'Download');
downloadButton.setAttribute('class', 'btn');
downloadButton.textContent = 'Download';
downloadArea.appendChild(downloadButton);
rightSidebar.appendChild(downloadArea);

// create a dropdown menu listing 




















// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const loader = new GLTFLoader();

// loader.load( './3dmodels/Suzanne.glb', function ( gltf ) {

//   scene.add( gltf.scene );

// }, undefined, function ( error ) {

//   console.error( error );

// } );

// const color = 0xFFFFFF;
// const intensity = 1;
// const light = new THREE.AmbientLight(color, intensity);
// scene.add(light);

// camera.position.z = 5;


// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();
