//File managing the second scene : the interior view.

//#region IMPORTS
//#endregion

//#region CONST
//#endregion

//#region VARIABLES

//The animation mixer.
let mixer
//True once the city is loaded.
let ready

//#endregion

//#region API

//Loads the city model and setup the camera and lighting.
export const generateInterior = (d) => {
    
    d.loader.load(
        './model/interior.glb', 
        (gltf) => {
            setupScene(gltf, d)
        }, 
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }, 
        (error) => {
            console.log(error)
        });
}

//#endregion

//#region SCENE SETUP

//Create the scene from the gltf model, generate lightning, setup camera
const setupScene = (gltf, d) => {
    setupAnimMixer(gltf, d)
    
    gltf.scene.traverse((obj) => {
        if (obj.castShadow !== undefined) {
            if (obj.name!== "Ground") {
                obj.castShadow = true
            }
            obj.receiveShadow = true;
        }
    });
    
    d.scene.add(gltf.scene)
    
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
    d.camera.rotation.set(Math.PI, Math.PI/2, Math.PI)

    d.camera.position.set(0, 1, 0)

    console.log(d.camera.rotation)
}

//Add lighting to the scene
const generateLightning = (d) => {
    const ambient = new d.THREE.AmbientLight(0XB9CDFF,2)
    d.scene.add(ambient)
}

//#endregion

//#region UPDATE

//Update the city animation and check camera movements
export const update = (d) => {
    let delta = d.clock.getDelta()
    if (ready) {
        mixer.update(delta)
    }
}

//#endregion