//#region Screen Projection
//Auxiliary function allowing to project 3D objects into the 2D screen space.
const toScreenPosition = (obj, d) => {
    const vector = new d.THREE.Vector3()

    const widthHalf = d.canvas.clientWidth/2
    const heightHalf = d.canvas.clientHeight/2

    obj.updateMatrixWorld()
    vector.setFromMatrixPosition(obj.matrixWorld)
    vector.set(vector.x, vector.y, vector.z)
    vector.project(d.camera)

    vector.normX = vector.x
    vector.normY = vector.y
    vector.x = ( vector.x * widthHalf ) + widthHalf
    vector.y = - ( vector.y * heightHalf ) + heightHalf

    return {
        x: vector.x,
        y: vector.y,
        normX: vector.normX,
        normY: vector.normY
    }
}
//#endregion

//#region Cursor
const normal = 0
const drag = 1

let cursor
let grab
let mode

const InitializeCursor = (d) => {
    cursor = document.getElementById('custom-cursor')
    grab = document.getElementById('custom-grab')
    NormalMode()
    window.addEventListener('mousemove', MoveCursor)
    window.addEventListener('mouseout', HideCursor)
    window.addEventListener('mouseleave', HideCursor)
    window.addEventListener('mouseover', ShowCursor)
}

const IsNormal = () => {
    return mode === normal
}

const IsDrag = () => {
    return mode === drag
}

const HideCursor = (e) => {
    cursor.style.display = "none"
    grab.style.display = "none"
}

const ShowCursor = (e) => {
    if (IsNormal()) {
        cursor.style.display = "inherit"
    }
    else {
        grab.style.display = "inherit"
    }

}
const MoveCursor = (e) => {
    cursor.style.top = e.pageY+"px"
    cursor.style.left = (e.pageX-20)+"px"
    grab.style.top = e.pageY+"px"
    grab.style.left = (e.pageX-20)+"px"
}

const NormalMode = () => {
    let interactibles = document.getElementsByClassName('interactible')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "all"
    }
    cursor.style.display = "inherit"
    grab.style.display = "none"
    mode = normal
}

const DragMode = () => {
    let interactibles = document.getElementsByClassName('interactible')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    cursor.style.display = "none"
    grab.style.display = "inherit"
    mode = drag
}


//#endregion

//#region JSON Loader

//Path : path to access the json file from the current repertory.
//Success : function that takes the successful json object constructed from parsing as an argument
//Error : function that takes the error string as an argument
const loadJSON = (path, success, error) => {

    //Building the Http Request
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function()
    {
        //Once the request is completed
        if (xhr.readyState === XMLHttpRequest.DONE) {
            //In case of success, execute the success method
            if (xhr.status === 200) {
                if (success) {
                    success(JSON.parse(xhr.responseText))
                }
            }
            //In case of failure, execute the error method
            else {
                if (error) {
                    error(xhr)
                }
            }
        }
    }

    xhr.open("GET", path, true)
    xhr.send()
}

//#endregion

//#region EASING

const easeInOutCirc = (x) => {
    return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
}

const easeInOutSine = (x) => {
    return -(Math.cos(Math.PI * x) - 1) / 2
}

const easeInCube = (x) => {
    return x * x * x
}

const easeOutQuad = (x) => {
    return 1 - (1 - x) * (1 - x)
}

//#endregion

//#region HOTSPOT HANDLER
let hotspotDivs = []
let hotspotInfos = []

const GetHotspotData = (id) => hotspotInfos[id]

const InitializeHotspots = (d) => {
    hotspotDivs[0] = document.getElementById('hotspot-content-video')
    hotspotDivs[1] = document.getElementById('hotspot-content-embed')
    hotspotDivs[2] = document.getElementById('hotspot-content-slideshow')
    hotspotDivs[3] = document.getElementById('hotspot-content-quizz')
    loadJSON("https://lucas971.github.io/UEX/public/hotspotsData.json",
        (data) => {
            hotspotInfos = data["hotspotInfos"]
            InitializeIcons(d)
        },
        (error) => {
            console.error(error)
        })
}

const OpenedHotspot = (triggerName) => {
    PopulateHotspot(hotspotInfos[triggerName])
}
const PopulateHotspot = (hotspotInfo) => {
    const div = hotspotDivs[hotspotInfo.type]
    let newColor = '#06b7ff'
    if (hotspotInfo.theme === "Usine du futur") {
        newColor = '#fe004b'
    } else if (hotspotInfo.theme === "Développement Durable") {
        newColor = '#90d301'
    } else if (hotspotInfo.theme === "Innovation") {
        newColor = '#ffd503'
    }
    div.style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-back-button")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-partner-div")[0].style.backgroundColor = newColor
    div.getElementsByClassName("theme-tag-div")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-title-h1")[0].style.color = newColor
    div.getElementsByClassName("title-header-div")[0].style.shadowColor = newColor
    div.getElementsByClassName("hotspot-title-h1")[0].innerHTML = hotspotInfo.title
    div.getElementsByClassName("sponsor-name-text")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("theme-text")[0].innerHTML = hotspotInfo.theme
    div.getElementsByClassName("paragraph-text")[0].innerHTML = hotspotInfo.paragraphText
    div.getElementsByClassName("hotspot-partner-name")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("hotspot-partner-info")[0].innerHTML = "Information partenaire à placer ici"
    
    
    
}

//#endregion

//#region Icons Handler

//Manages the 2D icons sizes and positions on the screen

//#region VARIABLES

const iconWidth = 50
const iconHeight = 50
//Array of icons struct. See ../iconsData.json for more information on the structure.
let icons

//The general content div from which enabling/disabling the pointer events.
let content

//Is the zoom animation playing?
let clickedLink = false

//#endregion

//#region API

const IsLinkActive = () => {
    return clickedLink
}
//Creates the icons array from the json file and add the html images inside the Icons div.
const InitializeIcons = (d) => {

    loadJSON("https://lucas971.github.io/UEX/public/iconsData.json",
        (data) => {
            icons = data["icons"]
            GenerateHtml(d)
            UpdateIconsPosition(d)
        },
        (error) => {
            console.error(error)
        })
}

//Update the icons position on the screen using the 3D world space position of the building of interests.
const UpdateIconsPosition = (d) => {
    
    if (!d.scene || !icons) {
        return
    }
    d.camera.updateMatrixWorld()

    for (let i = 0; i < icons.length; i++) {
        const obj = d.scene.getObjectByName(icons[i].id)
        if (!obj) {
            continue
        }
        const toScreen = toScreenPosition(obj, d)

        icons[i].image.style.left = `${toScreen.x - iconWidth/2}px`
        icons[i].image.style.top = `${toScreen.y - iconHeight/2}px`
    }
}

//#endregion

//#region HTML Generation

//Used at initialization to create the Image elements inside the icons div.
const GenerateHtml = (d) => {
    content = document.getElementById('content')

    const iconDiv = document.getElementById('icons')
    
    for (let i = 0; i< icons.length; i++) {
        icons[i].image  = document.getElementById(icons[i].iconid)
        icons[i].image.addEventListener("click", () => TryClickedLink(icons[i].iconid))
        let data = GetHotspotData(icons[i].iconid)
        icons[i].image.getElementsByClassName('hotspot-name')[0].innerHTML = data.title
        iconDiv.appendChild(icons[i].image)
    }

    let backButtons = document.getElementsByClassName("hotspot-back-button")
    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", TryLeaveLink)
    }
}

//#endregion

//#region Hotspots

const TryClickedLink = (id) => {
    OpenedHotspot(id)
    AddToProgress(id)
    clickedLink = true
}

const TryLeaveLink = () => {
    clickedLink = false
}
//#endregion

//#endregion

//#region Progress

let currentProgress = []

const LoadProgress = () => {
    if (localStorage.progress) {
        currentProgress = JSON.parse(localStorage.progress)
        console.log(currentProgress)
    }
}

const AddToProgress = (id) => {
    currentProgress.append(id)
    localStorage.progress = JSON.stringify(currentProgress);
}

//#endregion

//#region City Camera 

//#region GENERAL DATA
let d
let requestIconRefresh
let cameraHolder
//#endregion

//#region FREEFORM PARAMS
const acceleration = 0.25
const deceleration = 0.75
const maxVelocity = 0.5
const maxX = 150
const minX= -70
const maxZ = 120
const minZ= -120
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
const SetupCameraHandler = (threeData) => InitializeCameraHandler(threeData)

//REQUEST A TRANSITION
const RequestTransition = (pos, href) => {
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
const RequestIconsRefresh = () => {
    if (requestIconRefresh) {
        requestIconRefresh = false
        return true
    }
    return false
}

//#endregion

//#region INITIALIZATION

const InitializeCameraHandler = (threeData) => {
    d = threeData
    fadeDiv = document.getElementById("fade")
    loadJSON("https://lucas971.github.io/UEX/public/cameraData.json",
        (data) => {
            currentSpot = 0
            spots = data["spots"]
            const_y = data["const_y"]
            cameraHolder = d.scene.getObjectByName("CAMERACONTAINER")

            cameraHolder.attach( d.camera)
            d.camera.position.set(-100, 100, 100)
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
    if (!IsDrag()) {
        return
    }
    NormalMode()
    currentMouseX = null
}
const OnMouseClick = (e) => {
    if (!IsNormal() || e.target.id!== 'canvas') {
        return
    }
    DragMode()
    currentMouseX = e.clientX
    currentMouseY = e.clientY
    initialPosX = currentMouseX
    initialPosY = currentMouseY
}
const OnMouseMove = (e) => {
    if (currentMouseX === null) {
        return
    }

    if (e.target.id!== 'canvas') {
        OnMouseRelease()
    }
    offsetX = -e.clientX + currentMouseX
    offsetZ = e.clientY - currentMouseY
    currentMouseX = e.clientX
    currentMouseY = e.clientY
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

const UpdateFreeform = (delta) => {
    xVelocity += offsetX * delta * acceleration
    zVelocity += offsetZ * delta * acceleration *2
    if (xVelocity === zVelocity && zVelocity === 0) {
        return
    }

    let targetXPos = clamp(cameraHolder.position.x + xVelocity + zVelocity, minX, maxX)
    let targetZPos = clamp(cameraHolder.position.z - zVelocity + xVelocity, minZ, maxZ)

    cameraHolder.position.x = targetXPos
    cameraHolder.position.z = targetZPos
    
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

const UpdateCamera = (delta) => {
    if (IsLinkActive()) {
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



//#endregion

//#region City
//File managing the main scene : the city view.

//#region VARIABLES

//The animation mixer.
let mixer
//True once the city is loaded.
let ready

//#endregion

//#region API

//Loads the city model and setup the camera and lighting.
const generateCity = (d) => {

    d.loader.load(
        'https://lucas971.github.io/UEX/public/model/port.glb',
        (gltf) => {
            setupScene(gltf, d)
            SetupCameraHandler(d)
            UpdateIconsPosition(d)
            console.log(d.scene)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        })
}

//Reposition the icons when the screen changes size.
const citySceneResize = (d) => {
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
    
    const light1  = new d.THREE.AmbientLight(0xffffff, 2.5)
    light1.name = 'ambient_light'
    d.scene.add( light1 )

    const light2  = new d.THREE.DirectionalLight(0xffffff, 2.5)
    light2.position.set(0.5, 0, 0.866) // ~60º
    light2.name = 'main_light'
    d.scene.add( light2 )

    traverseMaterials(d.scene, (material) => {
        material.depthWrite = !material.transparent
        if (material.map) material.map.encoding = d.THREE.sRGBEncoding
        if (material.emissiveMap) material.emissiveMap.encoding = d.THREE.sRGBEncoding
        if (material.map || material.emissiveMap) material.needsUpdate = true;
    });
    ready = true
}

const traverseMaterials = (object, callback) => {
    object.traverse((node) => {
        if (!node.isMesh) {
            return
        }
        const materials = Array.isArray(node.material)
            ? node.material
            : [node.material]
        materials.forEach(callback)
    })
}

//Create an animation mixer and launches the looping animation of the city.
const setupAnimMixer = (gltf, d) => {
    mixer = new d.THREE.AnimationMixer(gltf.scene)
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).reset().play()
    })
}
//#endregion

//#region UPDATE

//Update the city animation and check camera movements
const UpdateCity = (d) => {
    let delta = d.clock.getDelta()
    delta = Math.min(delta, 0.05)
    if (ready) {
        mixer.update(delta)
        UpdateCamera(delta)
        if (RequestIconsRefresh()) {
            UpdateIconsPosition(d)
        }

    }
}

//#endregion

//#endregion

//#region MAIN

//#region IMPORTS
// noinspection JSFileReferences

import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/DRACOLoader.js'
import {KTX2Loader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/meshopt_decoder.module.js';
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

    const camera = null

    const renderer = new THREE.WebGLRenderer({antialias: true})
    const canvas = document.getElementById("canvas")
    renderer.physicallyCorrectLights = true
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setClearColor( 0xEDE89F )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMappingExposure = 0.2
    canvas.appendChild( renderer.domElement )
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-1'
    window.addEventListener('resize', Resize)

    const loadingManager = new THREE.LoadingManager()
    const DRACO_LOADER = new DRACOLoader(loadingManager).setDecoderPath('https://cdn.skypack.dev/three@0.132.2/examples/js/libs/draco/gltf/')
    const KTX2_LOADER = new KTX2Loader(loadingManager).setTranscoderPath('https://cdn.skypack.dev/three@0.132.2/examples/js/libs/basis/')
        
    const loader = new GLTFLoader( new THREE.LoadingManager() )
        .setCrossOrigin('anonymous')
        .setDRACOLoader( DRACO_LOADER )
        .setKTX2Loader( KTX2_LOADER.detectSupport( renderer ) )
        .setMeshoptDecoder( MeshoptDecoder );

    threeData = {THREE, loader, clock, scene, camera, renderer, canvas}
}

//#endregion

//#region SCENE MANAGEMENT

const ClearScene = () => {
    while(threeData.scene.children.length > 0){
        threeData.scene.remove(threeData.scene.children[0])
    }
}

const LoadCityScene = () => {
    ClearScene()
    const aspect = window.innerWidth / window.innerHeight
    threeData.camera = new THREE.OrthographicCamera( - cameraSize * aspect, cameraSize * aspect, cameraSize, - cameraSize, 0.001, 10000 )
    threeData.scene.add(threeData.camera)
    threeData.camera.rotation.order = 'YXZ'
    threeData.camera.rotation.y = - Math.PI / 4
    threeData.camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) )
    generateCity(threeData)
    activeScene = cityActiveScene
}

//#endregion

//#region UPDATE

const animate = () => {
    requestAnimationFrame( animate )
    if (activeScene === cityActiveScene) {
        UpdateCity(threeData)
    }
    render()
}

const render = () => {
    threeData.renderer.render( threeData.scene, threeData.camera )
}

//#endregion

//#region RESPONSIVE

const Resize = () => {

    //If we're using an orthographic camera
    if (activeScene === cityActiveScene) {
        const aspect = window.innerWidth / window.innerHeight
        threeData.camera.left = -cameraSize * aspect
        threeData.camera.right = cameraSize * aspect
        threeData.camera.top = cameraSize
        threeData.camera.bottom = -cameraSize
        threeData.camera.updateProjectionMatrix()
    }

    threeData.renderer.setSize(window.innerWidth, window.innerHeight)
    render()

    if (activeScene === cityActiveScene) {
        citySceneResize(threeData)
    }
}

//#endregion

const main = () => {
    setup()

    LoadCityScene()
    LoadProgress()
    
    InitializeHotspots(threeData)
    InitializeCursor(threeData)
    animate()
}

main()

//#endregion