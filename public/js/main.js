//#region IMPORTS
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import {GLTFLoader} from  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js'

import * as CityScene from './CityScene.js'
import {InitializeIcons} from "./IconsHandler.js";

//#endregion

//#region CONST

const clock = new THREE.Clock()

const noActiveScene = -1
const cityActiveScene = 0
const cameraSize = 30
//#endregion

//#region VARIABLES

let threeData
let activeScene = noActiveScene

//#endregion

//#region SETUP

const setup = () => {
    const scene = new THREE.Scene()
    
    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.OrthographicCamera( - cameraSize * aspect, cameraSize * aspect, cameraSize, - cameraSize, 0.01, 1000 );
    scene.add(camera)
    camera.rotation.order = 'YXZ';
    camera.rotation.y = - Math.PI / 4;
    camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const canvas = document.getElementById("canvas")
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor( 0xEDE89F );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    canvas.appendChild( renderer.domElement );
    window.addEventListener('resize', Resize)
    
    threeData = {THREE, GLTFLoader, clock, scene, camera, renderer, canvas}
    
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
    var aspect = window.innerWidth / window.innerHeight;
    threeData.camera.left = -cameraSize * aspect
    threeData.camera.right = cameraSize * aspect
    threeData.camera.top = cameraSize
    threeData.camera.bottom = -cameraSize
    threeData.camera.updateProjectionMatrix()
    threeData.renderer.setSize(threeData.canvas.clientWidth, threeData.canvas.clientHeight)
    render()
    
    if (activeScene === cityActiveScene) {
        CityScene.resize(threeData)
    }
}

//#endregion

const main = () => {
    setup()

    InitializeIcons(threeData)
    LoadCityScene()

    animate()
}

main()