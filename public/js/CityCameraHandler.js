//#region IMPORTS
import {easeInOutSine, easeOutQuad} from "./Ease.js";
import {loadJSON} from './JSONLoader.js'

//#endregion

//#region GENERAL DATA
let d
let requestIconRefresh
//#endregion

//#region TRANSLATION PARAMS
let spots
let const_y
let requestedTranslation
let translation = {
    initialPos : null,
    targetPos : null,
    initialZoom : null,
    targetZoom : null,
    state : 0,
}
//#endregion

//#region TRANSITION PARAMS
const animationSpeed = 0.5
const animationZoom = 5

let fadeDiv
let requestedTransition
let transition = {
    initialPos : null,
    initialZoom : null,
    targetPos : null,
    href: null,
    state : 0
}
//#endregion

//#region API

//ASK FOR INITIALIZATION
export const SetupCameraHandler = (threeData) => Initialize(threeData)

//REQUEST A TRANSITION
export const RequestTransition = (pos, href) => {
    if (requestedTransition || requestedTranslation) {
        return
    }
    transition.targetPos = pos.clone()
    transition.initialZoom = d.camera.zoom
    transition.href = href
    transition.state = 0
    requestedTransition = true
}

//ASK IF ICON REFRESH
export const RequestIconsRefresh = () => {
    if (requestIconRefresh) {
        requestIconRefresh = false
        return true
    }
    return false
}

//#endregion

//#region INITIALIZATION

const Initialize = (threeData) => {
    d = threeData
    fadeDiv = document.getElementById("fade")
    loadJSON("./cameraData.json",
        (data) => {
            spots = data["spots"]
            const_y = data["const_y"]
            d.camera.position.set(spots[0].x, const_y, spots[0].z)
            d.camera.zoom = spots[0].zoom
            d.camera.updateProjectionMatrix()
            requestIconRefresh = true

            for (let i = 0; i < spots.length; i++) {
                document.getElementById(spots[i].id).addEventListener('click', () => RequestTranslation(i))
            }
        },
        (error) => {
            console.error(error)
        })
}

//#endregion

//#region TRANSLATION

const RequestTranslation = (id) => {
    if (requestedTranslation || requestedTransition) {
        return
    }
    translation.initialPos = d.camera.position.clone()
    translation.targetPos = new d.THREE.Vector3(spots[id].x, const_y, spots[id].z)
    translation.initialZoom = d.camera.zoom
    translation.targetZoom = spots[id].zoom
    translation.state = 0
    requestedTranslation=true
}

const AnimateTranslation = (delta) => {
    let t = easeInOutSine(translation.state)
    if (translation.state >= 1) {
        t=1
    }

    //zoom
    d.camera.zoom = (1-t) * translation.initialZoom + t * translation.targetZoom
    d.camera.updateProjectionMatrix()

    //pos
    d.camera.position.lerpVectors(translation.initialPos, translation.targetPos, t)

    if (t===1) {
        requestedTranslation = false
    }
    else {
        translation.state += animationSpeed * delta
    }

    requestIconRefresh = true
}

//#endregion

//#region TRANSITION

const AnimateTransition = (delta) => {

    const t = easeInOutSine(transition.state)

    //zoom
    d.camera.zoom = (1-t) * transition.initialZoom + t * animationZoom
    d.camera.updateProjectionMatrix()

    //fade
    const fadeAmount = easeOutQuad(transition.state)
    UpdateFade(fadeAmount)

    transition.state += animationSpeed * delta

    if (transition.state >= 1) {
        requestedTransition = false
        window.location.href = transition.href
    }

    requestIconRefresh = true
}

//#endregion

//#region UPDATE

export const UpdateCamera = (delta) => {
    if (requestedTransition) {
        AnimateTransition(delta)
    }
    if (requestedTranslation) {
        AnimateTranslation(delta)
    }
}

//#endregion

//#region FADE

const UpdateFade = (newValue) =>{
    fadeDiv.style.opacity = newValue
}

//#endregion

