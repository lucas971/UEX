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
const hotspot = 2

let mode

const InitializeCursor = (d) => {
    NormalMode()
}

const IsNormal = () => {
    return mode === normal
}

const IsDrag = () => {
    return mode === drag
}

const NormalMode = () => {
    document.getElementById('canvas').style.cursor = "grab"
    let interactibles = document.getElementsByClassName('spot-on-map')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "all"
    }
    mode = normal
}

const DragMode = () => {
    document.getElementById('canvas').style.cursor = "grabbing"
    let interactibles = document.getElementsByClassName('spot-on-map')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    mode = drag
}

const HotspotMode = () => {
    document.getElementById('canvas').style.cursor = "grab"
    let interactibles = document.getElementsByClassName('spot-on-map')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    mode = hotspot
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
let sponsorsTexts = []
let sponsorHeaders = []

const blue = '#06b7ff'
const red = '#fe004b'
const yellow = '#ffd503'
const green = '#90d301'
const GetHotspotData = (id) => hotspotInfos[id]

const InitializeHotspots = (d) => {
    hotspotDivs[0] = document.getElementById('hotspot-content-video')
    hotspotDivs[1] = document.getElementById('hotspot-content-embed')
    hotspotDivs[2] = document.getElementById('hotspot-content-slideshow')
    hotspotDivs[3] = document.getElementById('hotspot-content-quizz')
    loadJSON("https://lucas971.github.io/UEX/public/hotspotsData.json",
        (data) => {
            hotspotInfos = data["hotspotInfos"]
            sponsorsTexts = data["sponsorsTexts"]
            sponsorHeaders = data["sponsorsHeaders"]
            InitializeIcons(d)
        },
        (error) => {
            console.error(error)
        })
}

const OpenedHotspot = (triggerName) => {
    PopulateHotspot(hotspotInfos[triggerName])
}

String.prototype.convertToRGB = function(){
    if(this.length !== 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = this.match(/.{1,2}/g);
    return [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
}

const PopulateHotspot = (hotspotInfo) => {
    if (hotspotInfo.type > 3) {
        return
    }
    const div = hotspotDivs[hotspotInfo.type]
    let newColor = blue
    if (hotspotInfo.theme === "Usine du futur") {
        newColor = red
    } else if (hotspotInfo.theme === "Développement Durable") {
        newColor = green
    } else if (hotspotInfo.theme === "Innovation") {
        newColor = yellow
    }
    div.style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-back-button")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-back-button")[0].style.boxShadow = "1px 1px 16px 0 " +newColor
    div.getElementsByClassName("hotspot-partner-div")[0].style.backgroundColor = newColor
    div.getElementsByClassName("theme-tag-div")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-title-h1")[0].style.color = newColor
    div.getElementsByClassName("title-header-div")[0].style.shadowColor = newColor
    div.getElementsByClassName("title-header-div")[0].style.boxShadow = "1px 9px 20px -5px rgba(0, 0, 0, 0.17), 10px -10px 0 3px " + newColor
    div.getElementsByClassName("hotspot-title-h1")[0].innerHTML = hotspotInfo.title
    div.getElementsByClassName("sponsor-name-text")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("theme-text")[0].innerHTML = hotspotInfo.theme
    div.getElementsByClassName("paragraph-text")[0].innerHTML = hotspotInfo.paragraphText
    let rgb = newColor.slice(1).convertToRGB()
    div.getElementsByClassName("hotspot-partner-div")[0].style.boxShadow = "1px 1px 50px 0 rgba(" +
        rgb[0].toString() +", " +rgb[1].toString() + ", " +rgb[2].toString() + ", 0.47)"
    div.getElementsByClassName("hotspot-partner-name")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("hotspot-partner-info")[0].innerHTML = sponsorsTexts[hotspotInfo.sponsor]
    div.getElementsByClassName("hotspot-header-section")[0].style.backgroundImage = "url(" +sponsorHeaders[hotspotInfo.sponsor] + ")"
    
    if (hotspotInfo.video) {
        div.getElementsByClassName("video embed")[0].getElementsByTagName("iframe")[0].src = hotspotInfo.video
    }
    
    
    
}

//#endregion

//#region Icons Handler

//Manages the 2D icons sizes and positions on the screen

//#region VARIABLES

const iconWidth = 75
const iconHeight = 75
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
        let data = GetHotspotData(icons[i].iconid)
        icons[i].image.getElementsByClassName('hotspot-name')[0].innerHTML = data.title
        if (data.type <= 4) {
            icons[i].image.addEventListener("click", () => TryClickedLink(i))
        }
        else {
            icons[i].image.addEventListener("click", () => TryClickedRoom(data.room_link, i))
        }
        iconDiv.appendChild(icons[i].image)
    }

    let backButtons = document.getElementsByClassName("hotspot-back-button")
    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", TryLeaveLink)
    }
}

//#endregion

//#region Hotspots
const TryClickedRoom = (room_link, i) => {
    const button = document.getElementById(room_link)
    const obj = d.scene.getObjectByName(icons[i].id)
    RequestHotspotTranslation(obj.position, button)
}
const TryClickedLink = (i) => {
    let iconId = icons[i].iconid
    const obj = d.scene.getObjectByName(icons[i].id)
    RequestHotspotTranslation(obj.position, null)
    setAudioOnHotspot(true)
    HotspotMode()
    OpenedHotspot(iconId)
    AddToProgress(iconId)
    clickedLink = true
}

const TryLeaveLink = () => {
    NormalMode()
    setAudioOnHotspot(false)
    document.getElementsByClassName("video embed")[0].getElementsByTagName("iframe")[0].src = ""
    clickedLink = false
}
//#endregion

//#endregion

//#region Progress

let currentProgress = []
const total_Inclusion = 3.0
const total_Futur = 2.0
const total_Innovation = 3.0
const total_Ecologie = 3.0

const LoadProgress = () => {
    document.getElementsByClassName("collect-button-wrapper")[0].addEventListener('click', UpdateView)
    if (localStorage.progress) {
        currentProgress = JSON.parse(localStorage.progress)
    }
}

const AddToProgress = (id) => {
    if (currentProgress.indexOf(id) < 0) {
        currentProgress.push(id)
    }
    localStorage.progress = JSON.stringify(currentProgress);
}

const UpdateView = () => {
    let updateViewData = []
    updateViewData["Développement durable"] = updateViewData["Inclusion"] = updateViewData["Usine du futur"] = updateViewData["Innovation"] = 0.0
    
    for (var i = 0; i < currentProgress.length; i++) {
        if (currentProgress[i].type > 3) {
            continue
        }
        updateViewData[GetHotspotData(currentProgress[i]).theme]+=1.0
    }
    
    document.getElementsByClassName("counter-text inclus")[0].innerHTML = updateViewData["Inclusion"]
    document.getElementsByClassName("counter-text usin")[0].innerHTML = updateViewData["Usine du futur"]
    document.getElementsByClassName("counter-text develo")[0].innerHTML = updateViewData["Développement durable"]
    document.getElementsByClassName("counter-text innov")[0].innerHTML = updateViewData["Innovation"]
    
    const futurBar = document.getElementsByClassName("inside-progres-ui futur")[0]
    futurBar.style.webkitTransform = 
        futurBar.style.MozTransform = 
            futurBar.style.msTransform = 
                futurBar.style.OTransform = 
                    futurBar.style.transform = 'translate(-' + ((1 - (updateViewData["Usine du futur"] / total_Futur))*100).toString() + '%, 0px)'

    const inclusionBar = document.getElementsByClassName("inside-progres-ui inclusion")[0]
    inclusionBar.style.webkitTransform =
        inclusionBar.style.MozTransform =
            inclusionBar.style.msTransform =
                inclusionBar.style.OTransform =
                    inclusionBar.style.transform = 'translate(-' + ((1 - (updateViewData["Inclusion"] / total_Inclusion))*100).toString() + '%, 0px)'

    const ecoBar = document.getElementsByClassName("inside-progres-ui durable")[0]
    ecoBar.style.webkitTransform =
        ecoBar.style.MozTransform =
            ecoBar.style.msTransform =
                ecoBar.style.OTransform =
                    ecoBar.style.transform = 'translate(-' + ((1 - (updateViewData["Développement durable"] / total_Ecologie))*100).toString() + '%, 0px)'
    
    const inovBar = document.getElementsByClassName("inside-progres-ui innovation")[0]
    inovBar.style.webkitTransform =
        inovBar.style.MozTransform =
            inovBar.style.msTransform =
                inovBar.style.OTransform =
                    inovBar.style.transform = 'translate(-' + ((1 - (updateViewData["Innovation"] / total_Innovation))*100).toString() + '%, 0px)'
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

//#region HOTSPOT MOVE PARAMS
let fadeDiv
const hotspotOffset = -10
const animationSpeed = 0.5
const animationZoom = 2
let hotspotTransition
let hotspotCamParam = {
    initialPos : null,
    initialZoom : null,
    hotspotPos : null,
    state : 0
}
//#endregion

//#region API

//ASK FOR INITIALIZATION
const SetupCameraHandler = (threeData) => InitializeCameraHandler(threeData)


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
    cameraHolder = d.scene.getObjectByName("CAMERACONTAINER")
    cameraHolder.visible = false
    cameraHolder.attach( d.camera)
    d.camera.position.set(-100, 100, 100)
    d.camera.updateProjectionMatrix()
    requestIconRefresh = true

    document.body.addEventListener("mousemove", OnMouseMove)
    document.body.addEventListener("mousedown", OnMouseClick)
    document.body.addEventListener("mouseup", OnMouseRelease)
    document.body.addEventListener("mouseout", OnMouseRelease)
    document.body.addEventListener("wheel", OnWheel)
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
    cameraHolder.updateMatrixWorld(true)
    
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

//#region HOTSPOT TRANSLATION

const RequestHotspotTranslation = (hotspotPos, button) => {
    if (hotspotTransition) {
        return
    }
    hotspotCamParam.initialPos = cameraHolder.position.clone()
    hotspotCamParam.state = 0
    hotspotCamParam.initialZoom = d.camera.zoom
    hotspotCamParam.hotspotPos = hotspotPos
    hotspotCamParam.button = button
    hotspotTransition = true
    
}
const AnimateHotspotTranslation = (delta) => {

    const t = easeInOutSine(hotspotCamParam.state)
    
    //translation
    const targetX = hotspotCamParam.initialPos.x * (1-t) + (hotspotCamParam.hotspotPos.x - hotspotOffset) * t
    const targetZ = hotspotCamParam.initialPos.z * (1-t) + (hotspotCamParam.hotspotPos.z - hotspotOffset) * t

    cameraHolder.position.x = targetX
    cameraHolder.position.z = targetZ
    
    //zoom
    d.camera.zoom = (1-t) * hotspotCamParam.initialZoom + t * animationZoom
    d.camera.updateProjectionMatrix()

    //fade
    if (hotspotCamParam.button !== null) {
        const fadeAmount = easeOutQuad(hotspotCamParam.state)
        UpdateFade(fadeAmount)
    }
    
    hotspotCamParam.state += animationSpeed * delta

    if (hotspotCamParam.state >= 1) {
        hotspotTransition = false
        if (hotspotCamParam.button !== null) {
            localStorage.currentX = cameraHolder.position.x.toString()
            localStorage.currentZ = cameraHolder.position.z.toString()
            localStorage.comeBack = 'true'
            hotspotCamParam.button.click()
        }
    }

    requestIconRefresh = true
}

const AnimateRoomExit = () => {
    
}

//#endregion

//#region UPDATE

const UpdateCamera = (delta) => {
    if (hotspotTransition) {
        AnimateHotspotTranslation(delta)
        return
    }
    
    if (IsLinkActive()) {
        currentZoomSpeed = offsetZ =offsetX = xVelocity = zVelocity = 0
        return
    }
    
    UpdateFreeform(delta)
    UpdateZoom(delta)
    
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
        },
        (xhr) => {
            //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            //console.log(error)
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
    /*
    const light1  = new d.THREE.AmbientLight(0xffba8b, 5)
    light1.name = 'ambient_light'
    d.scene.add( light1 )*/
/*
    const light2  = new d.THREE.DirectionalLight(0xffffff, 2.5)
    light2.position.set(0.5, 0, 0.866) // ~60º
    light2.name = 'main_light'
    d.scene.add( light2 )*/

    traverseMaterials(d.scene, (material) => {
        material.depthWrite = !material.transparent
        if (material.map) material.map.encoding = d.THREE.sRGBEncoding
        if (material.emissiveMap) material.emissiveMap.encoding = d.THREE.sRGBEncoding
        if (material.map || material.emissiveMap) material.needsUpdate = true;
    });
    document.getElementById("loading-screen-stopper").click()

    InitializePostProcessing(d)
    
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
    delta = Math.min(delta, 0.03)
    updateVolume(delta)
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

//#region Audio

const fadeSpeed = 0.3
const unFadeSpeed = 0.1
const maxVolume = 0.4
const hotspotVolume = 0.1
let muted = false
let audio = document.getElementById("background-music")
let audioStarted = false
let onHotspot = false

const setAudioOnHotspot = (isOn) => onHotspot = isOn

const tryToPlayAudio = () => {
    if (!audioStarted){
        changeVolume(0)
        audio.play()
        audioStarted = true
    }
}

const changeVolume = (value) => {
    if (muted) {
        audio.volume = 0
        return
    }
    audio.volume = value
}

const swapMute = () => {
    muted = !muted
    changeVolume(0)
    if (muted) {
        localStorage.muted = 'true'
    } else {
        localStorage.muted = 'false'
    }
}

const updateVolume = (dt) => {
    if (muted || !audioStarted) {
        return
    }
    if (onHotspot) {
        changeVolume(Math.max(audio.volume - dt * fadeSpeed, hotspotVolume))
    } else {
        changeVolume(Math.min(audio.volume + dt * unFadeSpeed, maxVolume))
    }
}

const InitializeSound =() => {
    if (localStorage.muted === 'true') {
        document.getElementsByClassName('button-ui-div')[0].click()
        swapMute()
    } else {
        localStorage.muted = 'false'
    }

    document.addEventListener('click', tryToPlayAudio)
    document.getElementsByClassName('sound-ui-wrapper')[0].addEventListener('click', swapMute)
}
//#endregion

//#region POST PROCESSING
import {EffectComposer} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js'
import {BloomPass} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/BloomPass.js'
let composer

const InitializePostProcessing = (d) => {
    composer = new EffectComposer(d.renderer)
    composer.addPass(new RenderPass(d.scene, d.camera))
    composer.setSize(d.canvas.width, d.canvas.height);
    const bloomPass = new BloomPass(
        1,    // strength
        25,   // kernel size
        4,    // sigma ?
        256,  // blur render target resolution
    );
    composer.addPass(bloomPass)
}

const RenderPostProcess = (deltaTime) => {
    if (composer) {
        console.log(deltaTime)
        composer.render(deltaTime)
    }
}
//#endregion

//#region MAIN

//#region IMPORTS
// noinspection JSFileReferences

import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/DRACOLoader.js'
import {KTX2Loader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/KTX2Loader.js'
import {MeshoptDecoder} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/meshopt_decoder.module.js';
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
    
    canvas.appendChild( renderer.domElement )
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-1'
    window.addEventListener('resize', Resize)

    const loadingManager = new THREE.LoadingManager()
    const DRACO_LOADER = new DRACOLoader(loadingManager).setDecoderPath('https://cdn.skypack.dev/three@0.132.2/examples/js/libs/draco/gltf/')
    const KTX2_LOADER = new KTX2Loader(loadingManager).setTranscoderPath('https://cdn.skypack.dev/three@0.132.2/examples/js/libs/basis/')
        
    const loader = new GLTFLoader( loadingManager )
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
    RenderPostProcess(clock.getDelta())
    //threeData.renderer.render( threeData.scene, threeData.camera )
    
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

    InitializeSound()
    InitializeHotspots(threeData)
    InitializeCursor(threeData)

    animate()
}
main()

//#endregion