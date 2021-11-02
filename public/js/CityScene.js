//File managing the main scene : the city view.

//#region IMPORTS
import {UpdateIconsPosition} from "./IconsHandler.js";
import {SetupCameraHandler, UpdateCamera, RequestIconsRefresh} from "./CityCameraHandler.js"
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
    
    d.loader.load(
        './model/port.glb', 
        (gltf) => {
            setupScene(gltf, d)
            SetupCameraHandler(d)
            UpdateIconsPosition(d)
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
    
    ready = true
    
}

//Create an animation mixer and launches the looping animation of the city.
const setupAnimMixer = (gltf, d) => {
    mixer = new d.THREE.AnimationMixer(gltf.scene)
    console.log(gltf.scene)
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).reset().play()
    })
}
//#endregion

//#region UPDATE

//Update the city animation and check camera movements
export const update = (d) => {
    let delta = d.clock.getDelta()
    if (ready) {
        mixer.update(delta)
        UpdateCamera(delta)
        if (RequestIconsRefresh()) {
            UpdateIconsPosition(d)
        }
        
    }
}

//#endregion