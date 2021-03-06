//#region IMPORTS
// noinspection JSFileReferences

import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/DRACOLoader.js'
import * as CityScene from './CityScene.js'
import {InitializeIcons} from "./IconsHandler.js";
import {InitializeCursor} from "./Cursor.js";
//#endregion

//#region CONST

const clock = new THREE.Clock()

const noActiveScene = -1
const cityActiveScene = 0
const cameraSize = 25
//#endregion

//#region VARIABLES

let threeData
let activeScene = noActiveScene

//#endregion

//#region SETUP

const setup = () => {
    const scene = new THREE.Scene()

    const camera = null;

    const renderer = new THREE.WebGLRenderer({antialias: true});
    const canvas = document.getElementById("canvas")
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor( 0xEDE89F );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    //renderer.shadowMapEnabled = true;
    //renderer.shadowMapType = THREE.PCFSoftShadowMap;
    
    canvas.appendChild( renderer.domElement );
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-1'
    window.addEventListener('resize', Resize)

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    
    threeData = {THREE, loader, clock, scene, camera, renderer, canvas}
}

//#endregion

//#region SCENE MANAGEMENT

const ClearScene = () => {
    while(threeData.scene.children.length > 0){
        threeData.scene.remove(threeData.scene.children[0]);
    }
}

const LoadCityScene = () => {
    ClearScene()
    const aspect = window.innerWidth / window.innerHeight;
    threeData.camera = new THREE.OrthographicCamera( - cameraSize * aspect, cameraSize * aspect, cameraSize, - cameraSize, 0.001, 10000 )
    threeData.scene.add(threeData.camera)
    threeData.camera.rotation.order = 'YXZ'
    threeData.camera.rotation.y = - Math.PI / 4
    threeData.camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) )
    CityScene.generateCity(threeData)
    activeScene = cityActiveScene
}

//#endregion

//#region UPDATE

const animate = () => {
    requestAnimationFrame( animate );
    if (activeScene === cityActiveScene) {
        CityScene.update(threeData)
    }
    render()
}

const render = () => {
    threeData.renderer.render( threeData.scene, threeData.camera );
}

//#endregion

//#region RESPONSIVE

const Resize = () => {
    
    //If we're using an orthographic camera
    if (activeScene === cityActiveScene) {
        const aspect = window.innerWidth / window.innerHeight;
        threeData.camera.left = -cameraSize * aspect
        threeData.camera.right = cameraSize * aspect
        threeData.camera.top = cameraSize
        threeData.camera.bottom = -cameraSize
        threeData.camera.updateProjectionMatrix()
    }
    
    threeData.renderer.setSize(window.innerWidth, window.innerHeight)
    render()
    
    if (activeScene === cityActiveScene) {
        CityScene.resize(threeData)
    }
}

//#endregion

const main = () => {
    setup()

    LoadCityScene()

    InitializeIcons(threeData)

    InitializeCursor(threeData);
    animate()
}

main()