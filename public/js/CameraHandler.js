//#region IMPORTS
import {easeInOutCirc, easeInOutSine, easeOutQuad} from "./Ease.js";

//#endregion

//#region MOVEMENT PARAMS
const panningSpeed = 20

let cameraInitialPosition
let canvas
let camera
let city

let mousePos = {
    x:0,
    y:0
}

const boundaries = {
    Left: null,
    Right: null,
    Top: null,
    Bottom: null
}
//#endregion

//#region TRANSITION PARAMS
const animationSpeed = 0.5
const animationZoom = 5

let fadeDiv
let requestedAnimation
let ad = {
    initialPos : null,
    targetPos : null,
    href: null,
    state : 0
}
//#endregion

//#region SETUP
export const SetupCameraHandler = (d, cityRef) => {
    cameraInitialPosition = d.camera
    document.addEventListener('mousemove', updateMousePos)
    document.addEventListener('mouseout', mouseOut)
    boundaries.Left = d.scene.getObjectByName('Left')
    boundaries.Right = d.scene.getObjectByName('Right')
    boundaries.Top = d.scene.getObjectByName('Top')
    boundaries.Bottom = d.scene.getObjectByName('Bottom')
    canvas = d.canvas
    camera = d.camera
    city = cityRef
    fadeDiv = document.getElementById("fade")
}
//#endregion

//#region MOUSE
const mouseOut = () => {
    mousePos.x = 0
    mousePos.y = 0
}
const updateMousePos = (mouseEvent) => {
    mousePos.x = mouseEvent.clientX
    mousePos.y = mouseEvent.clientY
}
//#endregion

//#region MOVE
const TryMove = (delta) => {
    if (mousePos.x === 0 && mousePos.y === 0) {
        return false
    }
    
    let desiredY = 0
    let desiredX = 0

    if (mousePos.x < canvas.clientWidth && mousePos.x / canvas.clientWidth > 0.9) {
        desiredX = 1
    } else if (mousePos.x > 0 && mousePos.x / canvas.clientWidth < 0.1) {
        desiredX = -1
    }

    if (mousePos.y / canvas.clientHeight > 0.9) {
        desiredY = -1
    } else if (mousePos.y / canvas.clientHeight < 0.1) {
        desiredY = 1
    }

    if (desiredY !== 0 || desiredX !== 0) {
        const dir = {
            x : desiredX,
            y : desiredY
        }
        city.translateX(-dir.x * delta * panningSpeed)
        city.translateZ(-dir.x * delta * panningSpeed)
        city.translateY(-dir.y * delta * panningSpeed)
        return true
    }

    return false
}
//#endregion

//#region TRANSITION
export const RequestTransition = (pos, href) => {
    ad.initialPos = city.position.clone()
    ad.targetPos = pos.clone()
    ad.targetPos.x
    ad.targetPos.z
    ad.href = href
    ad.state = 0
    requestedAnimation = true
}
//#endregion

//#region UPDATE
export const Update = (delta) => {
    if (requestedAnimation) {
        return Animate(delta)
    }
    //return TryMove(delta)
    return false
}

const Animate = (delta) => {
    
    const t = easeInOutSine(ad.state)
    
    //pos
    city.position.x = ad.initialPos.x * (1 - t) - ad.targetPos.x * t
    city.position.z = ad.initialPos.z * (1 - t) - ad.targetPos.z * t
    city.position.y = ad.initialPos.y * (1 - t) + ad.targetPos.y * t

    //zoom
    camera.zoom = 1 + (animationZoom - 1) * t
    camera.updateProjectionMatrix()
    
    //fade
    const fadeAmount = easeOutQuad(ad.state)
    UpdateFade(fadeAmount)
    
    ad.state += animationSpeed * delta
    
    if (ad.state >= 1) {
        requestedAnimation = false
        window.location.href = ad.href
    }
    
    return true
}
//#endregion

//#region FADE

const UpdateFade = (newValue) =>{
    fadeDiv.style.opacity = newValue
}

//#endreion

