//#region IMPORTS
import {easeInOutSine, easeOutQuad} from "./Ease.js";
import {loadJSON} from './JSONLoader.js'
import * as Cursor from './Cursor.js';
import * as IconsHandler from './IconsHandler.js'

//#endregion

//#region GENERAL DATA
let d
let requestIconRefresh
//#endregion

//#region FREEFORM PARAMS
const acceleration = 0.25
const deceleration = 0.75
const maxVelocity = 0.5
const maxCameraMovement = 400
let initialPosX = 0
let initialPosY = 0
let offsetX = 0
let offsetZ = 0
let xVelocity = 0
let zVelocity = 0
let currentMouseX = null
let currentMouseY = null

//#endregion

//#region ZOOM PARAMS

const maxZoomLevel = 3
const minZoomLevel = 0.5
const zoomSpeed = 0.2
const zoomDeceleration = 0.2
let currentZoomSpeed = 0
//#endregion

//#region TRANSLATION PARAMS
let spots
let const_y
let requestedTranslation
let currentSpot
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
            currentSpot = 0
            spots = data["spots"]
            const_y = data["const_y"]
            d.camera.position.set(spots[0].x, const_y, spots[0].z)
            d.camera.zoom = spots[0].zoom
            d.camera.updateProjectionMatrix()
            requestIconRefresh = true

            for (let i = 0; i < spots.length; i++) {
                //document.getElementById(spots[i].id).addEventListener('click', () => RequestTranslation(i))
            }
            
            document.body.addEventListener("mousemove", OnMouseMove)
            document.body.addEventListener("mousedown", OnMouseClick)
            document.body.addEventListener("mouseup", OnMouseRelease)
            document.body.addEventListener("mouseout", OnMouseRelease)
            document.body.addEventListener("wheel", OnWheel)
        },
        (error) => {
            console.error(error)
        })
}

//#endregion

//#region FREEFORM
const OnMouseRelease = () => {
    if (!Cursor.IsDrag()) {
        return;
    }
    Cursor.NormalMode();
    currentMouseX = null
}
const OnMouseClick = (e) => {
    if (!Cursor.IsNormal() || e.target.tagName!== 'CANVAS') {
        return
    }
    Cursor.DragMode();
    currentMouseX = e.clientX
    currentMouseY = e.clientY
    initialPosX = currentMouseX
    initialPosY = currentMouseY
}
const OnMouseMove = (e) => {
    if (currentMouseX === null) {
        return
    }
    
    if (e.target.tagName!== 'CANVAS') {
        OnMouseRelease()
    }
    offsetX = -e.clientX + currentMouseX
    offsetZ = e.clientY - currentMouseY
    currentMouseX = e.clientX
    currentMouseY = e.clientY
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const UpdateFreeform = (delta) => {
    xVelocity += offsetX * delta * acceleration
    zVelocity += offsetZ * delta * acceleration
    if (xVelocity === zVelocity && zVelocity === 0) {
        return 
    }
    
    d.camera.translateX(xVelocity)
    d.camera.translateY(zVelocity)
    
    
    //The use of ratio during deceleration allow to simulate a vector magnitude diminution without using an actual vector.
    let xRatio = 1, zRatio = 1
    if (Math.abs(zVelocity) < Math.abs(xVelocity)) {
        zRatio = Math.abs(zVelocity / xVelocity)
    } else {
        xRatio =  Math.abs(xVelocity / zVelocity)
    }
    
    const newXVelocity = xVelocity + (xVelocity > 0 ? -1 : 1) * delta * deceleration * xRatio
    xVelocity = newXVelocity * xVelocity > 0 ? newXVelocity : 0
    xVelocity = xVelocity > maxVelocity ? maxVelocity : xVelocity
    xVelocity = xVelocity < -maxVelocity ? -maxVelocity : xVelocity

    const newZVelocity = zVelocity + (zVelocity > 0 ? -1 : 1) * delta * deceleration * zRatio
    zVelocity = newZVelocity * zVelocity > 0 ? newZVelocity : 0
    zVelocity = zVelocity > maxVelocity ? maxVelocity : zVelocity
    zVelocity = zVelocity < -maxVelocity ? -maxVelocity : zVelocity
    
    offsetX = 0
    offsetZ = 0

    requestIconRefresh = true
}


//#endregion

//#region ZOOM

const OnWheel = (e) => {
    if (e.deltaY > 0) {
        currentZoomSpeed = zoomSpeed
    } else {
        currentZoomSpeed = -zoomSpeed
    }
}

const UpdateZoom = (delta) => {
    if (currentZoomSpeed === 0) {
        return
    }
    d.camera.zoom = Math.max( minZoomLevel, Math.min( maxZoomLevel, d.camera.zoom * Math.pow( 0.95, currentZoomSpeed )))
    d.camera.updateProjectionMatrix()
    if (currentZoomSpeed < 0) {
        currentZoomSpeed = Math.min(0, currentZoomSpeed + delta * zoomDeceleration)
    } else {
        currentZoomSpeed = Math.max(0, currentZoomSpeed - delta * zoomDeceleration)
    }
    requestIconRefresh = true
}


//#endregion

//#region TRANSLATION

const RequestTranslation = (id) => {
    if (requestedTranslation || requestedTransition || id === currentSpot) {
        return
    }
    translation.initialPos = d.camera.position.clone()
    translation.targetPos = new d.THREE.Vector3(spots[id].x, const_y, spots[id].z)
    translation.initialZoom = d.camera.zoom
    translation.targetZoom = spots[id].zoom
    translation.state = 0
    requestedTranslation=true
    currentSpot = id
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
    if (IconsHandler.IsLinkActive()) {
        currentZoomSpeed = offsetZ =offsetX = xVelocity = zVelocity = 0
        return
    }
    if (requestedTransition) {
        AnimateTransition(delta)
    }
    else if (requestedTranslation) {
        AnimateTranslation(delta)
    }
    else {
        UpdateFreeform(delta)
        UpdateZoom(delta)
    }
}

//#endregion

//#region FADE

const UpdateFade = (newValue) =>{
    fadeDiv.style.opacity = newValue
}

//#endregion

