import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fs from "fs";



// function that loads each model in turn and converts to jsons stored in an array

let currentModel;
let modelName;
let vertexCount;
let facesCount;

let modelArray = [];

const modelDatabaseLoader = function() {
    for (let i = 0; i < 7; i++) {
        if(fs.existsSync(`/3dmodels/spaceship${i}.glb`)) {
        loader.load( `/3dmodels/spaceship${i}.glb`, function ( gltf ) {
        currentModel = gltf.scene
        console.log(currentModel.children[0])
        extractModelData(currentModel);
        modelArray.push(newProduct(modelName, facesCount, vertexCount, i));
         //reset vertex and face count 

        vertexCount = 0;
        facesCount = 0;      

        console.log(JSON.stringify(modelArray, null, 2));
        },      undefined, function ( error ) {

                console.error( error );

                } ) 

        } else {
            break;
        }
    
    }

}   

function extractModelData(model) {
  //get the model name 

  modelName = model.children[0].userData.name


  //get the model's vertices and faces 

  model.traverse(function (object) {
    if (object.isMesh) {
      vertexCount += Number(object.geometry.attributes.position.count);
      facesCount+= Number(object.geometry.index.count / 3);
    }
  }
) 

}

const newProduct = (productTitle, faces, vertices, i) => {
    return {
        productTitle: productTitle,
        fileName: '',
        fileSize: 0,
        geometry: {
            vertices: vertices,
            faces: faces
        },
        
        assetLocations: {
            glbLocation: `/3dmodels/spaceship${i}.glb`,
            texturesLocation: '',
            thumbnailLocation: `/3dmodelthumbs/spaceship${i}.png`,
        },
        Author: '',
        description: '',
    }
}

modelDatabaseLoader();


    

