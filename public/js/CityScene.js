//File managing the main scene : the city view.

//#region IMPORTS
import {UpdateIconsPosition} from "./IconsHandler.js";
import * as CameraHandler from "./CameraHandler.js"
//#endregion

//#region CONST

//The initial position of the camera in the world
const cameraPos = 50
//#endregion

//#region VARIABLES

//The animation mixer.
let mixer
//True once the city is loaded.
let ready

//#endregion

//#region API

//Loads the city model and setup the camera and lighting.
export const generateCity = (d) => {
    
    new d.GLTFLoader().load(
        './model/port.glb', 
        (gltf) => {
            setupScene(gltf, d)
            UpdateIconsPosition(d)
            CameraHandler.SetupCameraHandler(d, gltf.scene)
        }, 
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }, 
        (error) => {
            console.log(error)
        });
}

//Reposition the icons when the screen changes size.
export const resize = (d) => {
    if (ready) {
        UpdateIconsPosition(d)
    }
}

//#endregion

//#region SCENE SETUP

//Create the scene from the gltf model, generate lightning, setup camera
const setupScene = (gltf, d) => {
    setupAnimMixer(gltf, d)
    
    d.scene.add(gltf.scene)
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    generateLightning(d)

    setCameraPosition(d)
    
    ready = true
}

//Create an animation mixer and launches the looping animation of the city.
const setupAnimMixer = (gltf, d) => {
    mixer = new d.THREE.AnimationMixer(gltf.scene)
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).reset().play()
    })
}

//Place the camera accordingly
const setCameraPosition = (d) => {
    d.camera.position.set(-cameraPos,cameraPos,cameraPos)
}

//Add lighting to the scene
const generateLightning = (d) => {
    const color = 0xFFFFFF;
    const intensity = 4;
    
    const dirLight = new d.THREE.DirectionalLight(color, intensity)
   //const light = new d.THREE.AmbientLight(color, intensity/2)
    dirLight.position.set(0, 10, 0);
    dirLight.target.position.set(1, -1, -1);
    dirLight.castShadow = true
    d.scene.add(dirLight)
    //d.scene.add(light)
}

//#endregion

//#region UPDATE

//Update the city animation and check camera movements
export const update = (d) => {
    let delta = d.clock.getDelta()
    if (ready) {
        mixer.update(delta)
        if (CameraHandler.Update(delta)) {
            UpdateIconsPosition(d)
        }
    }
}

//#endregion