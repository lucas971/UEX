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
const room = 3

let mode

const InitializeCursor = (d) => {
    NormalMode()
}

const IsNormal = () => {
    return mode === normal
}

const IsRoom = () => {
    return mode === room
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

const RoomMode = () => {
    document.getElementById('canvas').style.cursor = "pointer"
    let interactibles = document.getElementsByClassName('spot-on-map')
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    mode = room
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

//#region Trophee
let inclusionTrophee = document.getElementById("trophee-inclusion")
let devTrophee = document.getElementById("trophee-dev")
let innovationTrophee = document.getElementById("trophee-innovation")
let usineTrophee = document.getElementById("trophee-usine")

let gotInclusion = false
let gotDev = false
let gotInnovation = false
let gotUsine = false

const InitializeTrophees = () => {
    if (localStorage.gotInclusion) {
        gotInclusion = true
    } if (localStorage.gotDev) {
        gotDev = true
    } if (localStorage.gotInnovation) {
        gotInnovation = true
    } if (localStorage.gotUsine) {
        gotUsine = true
    }
    document.getElementById("trophee-wrapper").style.pointerEvents = 'none'
    inclusionTrophee.style.pointerEvents = 'all'
    devTrophee.style.pointerEvents = 'all'
    innovationTrophee.style.pointerEvents = 'all'
    usineTrophee.style.pointerEvents = 'all'
}

const CheckTrophees = (inclusionCount, devCount, innovationCount, usineCount) => {
    if (!gotInclusion && inclusionCount >= 10) {
        gotInclusion = true
        localStorage.gotInclusion = 'true'
        inclusionTrophee.style.display = 'flex'
    } if (!gotDev && devCount >= 10) {
        gotDev = true
        localStorage.gotDev = 'true'
        devTrophee.style.display = 'flex'
    }
    if (!gotInnovation && innovationCount >= 10) {
        gotInnovation = true
        localStorage.gotInnovation = 'true'
        innovationTrophee.style.display = 'flex'
    }
    if (!gotUsine && usineCount >= 10) {
        gotUsine = true
        localStorage.gotUsine = 'true'
        usineTrophee.style.display = 'flex'
    }
}

//#endregion

//#region HOTSPOT HANDLER
let hotspotDivs = {}
let hotspotInfos = []
let sponsorsTexts = []
let sponsorHeaders = []

const blue = '#06b7ff'
const red = '#fe004b'
const yellow = '#ffd503'
const green = '#90d301'
const white = '#ffffff'
const black = '#000000'

const GetHotspotData = (id) => hotspotInfos[id]

const InitializeHotspots = (d) => {
    hotspotDivs[0] = document.getElementById('hotspot-content-video')
    hotspotDivs[1] = document.getElementById('hotspot-content-embed')
    hotspotDivs[3] = document.getElementById('hotspot-content-quizz')
    hotspotDivs[31] = document.getElementById('hotspots-content-slideshow-31')
    hotspotDivs[39] = document.getElementById('hotspots-content-slideshow-39')
    hotspotDivs[40] = document.getElementById('hotspots-content-slideshow-40')
    hotspotDivs[48] = document.getElementById('hotspots-content-slideshow-48')
    hotspotDivs[56] = document.getElementById('hotspots-content-slideshow-56')
    hotspotDivs[61] = document.getElementById('hotspots-content-slideshow-61')
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

String.prototype.convertToRGBClamped = function(){
    if(this.length !== 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = this.match(/.{1,2}/g);
    return [
        parseInt(aRgbHex[0], 16) / 255.0,
        parseInt(aRgbHex[1], 16) / 255.0,
        parseInt(aRgbHex[2], 16) / 255.0
    ];
}

const PopulateHotspot = (hotspotInfo) => {
    if (hotspotInfo.type > 3 || hotspotInfo.type === 2) {
        return
    }
    const div = hotspotDivs[hotspotInfo.type]
    
    div.getElementsByClassName("theme-tag-div")[0].style.display = 'flex'
    div.getElementsByClassName("hotspot-descrip-div")[0].style.display='flex'
    let newColor = blue
    if (hotspotInfo.theme === "Usine du futur") {
        newColor = red
    } else if (hotspotInfo.theme === "Développement durable") {
        newColor = green
    } else if (hotspotInfo.theme === "Innovation") {
        newColor = yellow
    } else if (hotspotInfo.theme === "") {
        newColor = white
        div.getElementsByClassName("theme-tag-div")[0].style.display = 'none'
        if (hotspotInfo.paragraphText === "") {
            div.getElementsByClassName("hotspot-descrip-div")[0].style.display='none'
        }
    }

    div.getElementsByClassName("hotspot-header-section")[0].style.backgroundImage = "url(" +sponsorHeaders[hotspotInfo.sponsor] + ")"
    
    div.style.backgroundColor = newColor
    
    div.getElementsByClassName("hotspot-back-button")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-back-button")[0].style.boxShadow = "1px 1px 16px 0 " +newColor
    
    div.getElementsByClassName("theme-tag-div")[0].style.backgroundColor = newColor
    
    div.getElementsByClassName("hotspot-title-h1")[0].style.color = newColor
    if (newColor === white) {
        div.getElementsByClassName("hotspot-title-h1")[0].style.color = black
    }
    div.getElementsByClassName("title-header-div")[0].style.shadowColor = newColor
    div.getElementsByClassName("title-header-div")[0].style.boxShadow = "1px 9px 20px -5px rgba(0, 0, 0, 0.17), 10px -10px 0 3px " + newColor
    div.getElementsByClassName("hotspot-title-h1")[0].innerHTML = hotspotInfo.title
    
    div.getElementsByClassName("sponsor-name-text")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("theme-text")[0].innerHTML = hotspotInfo.theme
    div.getElementsByClassName("paragraph-text")[0].innerHTML = hotspotInfo.paragraphText
    
    let rgb = newColor.slice(1).convertToRGB()
    div.getElementsByClassName("hotspot-partner-div")[0].style.boxShadow = "1px 1px 50px 0 rgba(" +
        rgb[0].toString() +", " +rgb[1].toString() + ", " +rgb[2].toString() + ", 0.47)"
    div.getElementsByClassName("hotspot-partner-div")[0].style.backgroundColor = newColor
    div.getElementsByClassName("hotspot-partner-name")[0].innerHTML = hotspotInfo.sponsor
    div.getElementsByClassName("hotspot-partner-info")[0].innerHTML = sponsorsTexts[hotspotInfo.sponsor]
    
    if (hotspotInfo.video) {
        div.getElementsByClassName("video embed")[0].getElementsByTagName("iframe")[0].src = hotspotInfo.video
    }
    
    if (hotspotInfo.token) {
        for (let i = 0; i < tripettos.length; i++) {
            tripettos[i].style.display = i === hotspotInfo.token ? 'inherit' : 'none'
        }
    }
    
    if (hotspotInfo.link) {
        div.getElementsByClassName("hotspot-link-content stm w-inline-block")[0].href = hotspotInfo.link
    }
    
    if (hotspotInfo.background) {
        div.getElementsByClassName("content-wrapper")[0].style.backgroundColor = newColor
        div.getElementsByClassName("hotspot-link-content stm w-inline-block")[0].style.backgroundImage = 
            'linear-gradient(131deg, rgba('+rgb[0] +', ' + rgb[1] + ', '+ rgb[2] +', 0), ' +
            'rgba('+rgb[0].toString() +', ' + rgb[1].toString() + ', '+ rgb[2].toString() +', 0.72) 50%,' + newColor.toString() + '), ' +
            'url('+ hotspotInfo.background +')'
        console.log('linear-gradient(131deg, rgba('+rgb[0] +', ' + rgb[1] + ', '+ rgb[2] +', 0), ' +
            'rgba('+rgb[0] +', ' + rgb[1] + ', '+ rgb[2] +', 0.72) 50%,' + newColor + '), ' +
            'url('+ hotspotInfo.background +')')
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
let roomMapping = {}
let positionMapping = []
let positionRef = null
let zoomRef
let collectible_wrapper = document.getElementsByClassName("collectibles-wrapper w-clearfix")[0]
//The general content div from which enabling/disabling the pointer events.
let content

//Is the zoom animation playing?
let clickedLink = false

//#endregion

//#region API

const IsLinkActive = () => {
    return clickedLink || collectible_wrapper.style.display !== 'none'
}
//Creates the icons array from the json file and add the html images inside the Icons div.
const InitializeIcons = (d) => {

    loadJSON("https://lucas971.github.io/UEX/public/iconsData.json",
        (data) => {
            icons = data["icons"]
            GenerateHtml(d)
            InitializeIconsPosition(d)
            //InitializeTutorial()
            document.getElementById("loading-screen-stopper").click()
            InitializeSound()
            LoadProgress()
        },
        (error) => {
            console.error(error)
        })
}

function checkIconVisible(x,y) {
    if (x + iconWidth/2 < 0 || x - iconWidth/2 > window.innerWidth) {
        return false
    }
    if (y + iconHeight/2 < 0 || y - iconHeight/2 > window.innerHeight) {
        return false
    }
    return true
}

const InitializeIconsPosition = (d) => {
    if (!d.scene || !icons) {
        return
    }
    d.camera.updateMatrixWorld()

    for (let i = 0; i < icons.length; i++) {
        if (icons[i].image === null) {
            continue
        }
        const obj = d.scene.getObjectByName(icons[i].id)
        if (!obj) {
            console.log(icons[i].id)
            continue
        }
        const toScreen = toScreenPosition(obj, d)
        
        icons[i].image.style.display = 'flex'
        icons[i].image.style.left = `${toScreen.x - iconWidth/2}px`
        icons[i].image.style.top = `${toScreen.y - iconHeight/2}px`
        positionMapping[i] = toScreen
        if (i===0){
            positionRef = obj
            zoomRef = d.camera.zoom
        }
        if (!checkIconVisible(toScreen.x, toScreen.y)) {
            icons[i].image.style.display = 'none'
        }
    }
}
//Update the icons position on the screen using the 3D world space position of the building of interests.
const UpdateIconsPosition = (d) => {
    
    if (!d.scene || !icons) {
        return
    }
    
    if (d.camera.zoom !== zoomRef) {
        InitializeIconsPosition(d)
        return
    }
    d.camera.updateMatrixWorld()
    const toScreen = toScreenPosition(positionRef, d)
    const offsetX = toScreen.x - positionMapping[0].x
    const offsetY = toScreen.y - positionMapping[0].y

    for (let i = 0; i < icons.length; i++) {
        if (icons[i].image === null) {
            continue
        }
        icons[i].image.style.display = 'flex'
        icons[i].image.style.left = `${positionMapping[i].x + offsetX - iconWidth/2}px`
        icons[i].image.style.top = `${positionMapping[i].y + offsetY - iconHeight/2}px`
        if (!checkIconVisible(positionMapping[i].x + offsetX, positionMapping[i].y + offsetY)) {
            icons[i].image.style.display = 'none'
        }
    }
}
//#endregion

//#region HTML Generation

//Used at initialization to create the Image elements inside the icons div.
const GenerateHtml = (d) => {
    content = document.getElementById('content')

    const iconDiv = document.getElementById('icons')
    
    for (let i = 0; i< icons.length; i++) {
        icons[i].image = document.getElementById(icons[i].iconid)
        
        //MULTI ICONS
        if (icons[i].inside) {
            for (let j = 0; j < icons[i].inside.length; j++) {
                const insideDiv = document.getElementById(icons[i].inside[j])
                let data = GetHotspotData(icons[i].inside[j])
                insideDiv.addEventListener("click", () => TryClickedLink(icons[i].inside[j], icons[i].id))
                insideDiv.getElementsByClassName('hotspot-name')[0].innerHTML = data.title
                let newColor = blue
                if (data.theme === "Usine du futur") {
                    newColor = red
                } else if (data.theme === "Développement durable") {
                    newColor = green
                } else if (data.theme === "Innovation") {
                    newColor = yellow
                } else if (data.theme === "") {
                    newColor = black
                }
                const paths = Array.from(insideDiv.getElementsByClassName("pictosvg_embed")[0].getElementsByTagName('path'))
                for (let j = 0; j < paths.length; j++) {
                    paths[j].style.fill = newColor
                }
            }
            continue;
        }
        
        //GRAND MECENES
        let data = GetHotspotData(icons[i].iconid)
        
        if (data.type <= 4) {
            icons[i].image.getElementsByClassName('hotspot-name')[0].innerHTML = data.title
            icons[i].image.addEventListener("click", () => TryClickedLink(icons[i].iconid, icons[i].id))
            icons[i].image.getElementsByClassName("hotspot-name-div")[0].style.pointerEvents = "none"
            icons[i].image.addEventListener("mouseenter", () =>
                icons[i].image.getElementsByClassName("hotspot-name-div")[0].style.pointerEvents = "all", false)
            icons[i].image.addEventListener("mouseleave", () =>
                icons[i].image.getElementsByClassName("hotspot-name-div")[0].style.pointerEvents = "none", false)
            let newColor = blue
            if (data.theme === "Usine du futur") {
                newColor = red
            } else if (data.theme === "Développement durable") {
                newColor = green
            } else if (data.theme === "Innovation") {
                newColor = yellow
            } else if (data.theme === "") {
                newColor = black
            }
            const paths = Array.from(icons[i].image.getElementsByClassName("pictosvg_embed")[0].getElementsByTagName('path'))
            for (let j = 0; j < paths.length; j++) {
                paths[j].style.fill = newColor
            }
            iconDiv.appendChild(icons[i].image)
            continue;
        }
        
        //ROOMS
        icons[i].image = null
        const obj = d.scene.getObjectByName(icons[i].id)
        if (!obj){
            console.log(icons[i].id)
        }
        AddToSelectedObjects(obj)
        roomMapping[obj.name] = document.getElementById(data.room_link)
    }

    let backButtons = document.getElementsByClassName("hotspot-back-button")
    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", TryLeaveLink)
    }
    
    console.log(d.scene)
}

//#endregion

//#region Hotspots
const TryClickedRoom = (obj) => {
    let worldPos = new d.THREE.Vector3()
    obj.getWorldPosition(worldPos)
    document.getElementById('open-room-sound').play()
    RequestHotspotTranslation(worldPos, roomMapping[obj.name])
}
const TryClickedLink = (iconId, objectName) => {
    const obj = d.scene.getObjectByName(objectName)
    let worldPos = new d.THREE.Vector3()
    obj.getWorldPosition(worldPos)
    document.getElementById('open-hotspot-sound').play()
    RequestHotspotTranslation(worldPos, null)
    setAudioOnHotspot(true)
    if (InTutorial && tutoIndex === 2) {
        MoveTutorial(true)
    }
    HotspotMode()
    OpenedHotspot(iconId)
    AddToProgress(iconId)
    clickedLink = true
}

const TryLeaveLink = () => {
    UpdateView()
    NormalMode()
    setAudioOnHotspot(false)
    if (InTutorial && tutoIndex === 3) {
        MoveTutorial(true)
    }
    document.getElementsByClassName("video embed")[0].getElementsByTagName("iframe")[0].src = ""
    clickedLink = false
}
//#endregion

//#endregion

//#region Progress

let currentProgress = []
const total_Inclusion = 18.0
const total_Futur = 19.0
const total_Innovation = 18.0
const total_Ecologie = 10.0
let link_x_icon
let link_v_icon

const LoadProgress = () => {
    if (localStorage.progress) {
        currentProgress = JSON.parse(localStorage.progress)
    }
    link_x_icon = document.getElementsByClassName("option_icon is--x")[0].src
    link_v_icon = document.getElementsByClassName("option_icon is--check")[0].src
    UpdateView()
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
    
    for (let i = 0; i < currentProgress.length; i++) {
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

    const futurList = Array.from(document.getElementsByClassName("collectible-list-div futur")[0].getElementsByClassName("option_icon"))
    const incluList = Array.from(document.getElementsByClassName("collectible-list-div inclusion")[0].getElementsByClassName("option_icon"))
    const ecoList = Array.from(document.getElementsByClassName("collectible-list-div durable")[0].getElementsByClassName("option_icon"))
    const inoList = Array.from(document.getElementsByClassName("collectible-list-div innovation")[0].getElementsByClassName("option_icon"))
    
    const totalList = futurList.concat(incluList).concat(ecoList).concat(inoList)
    
    for (let i = 0; i < totalList.length; i++) {
        let idToTest = ''
        if (totalList[i].id && totalList[i].id.includes('collectible-')) {
            idToTest = totalList[i].id.replace('collectible-', '')
        }
        if (currentProgress.indexOf(idToTest) >= 0) {
            totalList[i].src = link_v_icon
        } else {
            totalList[i].src = link_x_icon
        }
    }

    CheckTrophees(updateViewData["Inclusion"], updateViewData["Développement durable"], updateViewData["Innovation"], updateViewData["Usine du futur"])
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
const maxX = 145
const minX= -20
const maxZ = 80
const minZ= -100
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
const maxZoomLevel = 1.2
const minZoomLevel = 0.6
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
let positionTracker
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
    document.body.addEventListener("mouseup", () => OnMouseRelease(false))
    document.body.addEventListener("mouseout", () => OnMouseRelease(true))
    document.body.addEventListener("wheel", OnWheel)
    document.getElementById("zoom-plus").addEventListener("click",( () => OnWheel({deltaY:-1})))
    document.getElementById("zoom-minus").addEventListener("click",( () => OnWheel({deltaY:1})))
    document.addEventListener('keydown', () => console.log(d.camera.zoom + '  ' + cameraHolder.position))
    document.addEventListener('keydown', () => console.log(cameraHolder.position))
}

//#endregion

//#region FREEFORM
const OnMouseRelease = (out) => {
    if (!IsDrag() && !out && !InTutorial){
        if (IsRoom()) {
            TryClickedRoom(currentObject)
        }
        return
    }
    NormalMode()
    currentMouseX = null
}
const OnMouseClick = (e) => {
    DebugRaycast(e.clientX, e.clientY)
    e.preventDefault()
    if (InTutorial && tutoIndex !== 1) {
        return;
    }
    if (!IsNormal() || e.target.id!== 'canvas') {
        return
    }
    DragMode()
    currentMouseX = e.clientX
    currentMouseY = e.clientY
    initialPosX = currentMouseX
    initialPosY = currentMouseY
    positionTracker = cameraHolder.position.clone()
}
const OnMouseMove = (e) => {
    e.preventDefault()
    RaycastOutline(e.clientX, e.clientY)
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

    /*let targetXPos = cameraHolder.position.x + xVelocity + zVelocity
    let targetZPos = cameraHolder.position.z - zVelocity + xVelocity
    

    if (targetZPos < minZ || targetZPos > maxZ || targetXPos < minX || targetXPos > maxX) {
        zVelocity *= -0.5
        xVelocity *= -0.5
        targetXPos = cameraHolder.position.x + xVelocity + zVelocity
        targetZPos = cameraHolder.position.x + xVelocity + zVelocity
        NormalMode()
        currentMouseX = null
    }*/
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
    
    if (xVelocity === 0 && zVelocity === 0 && InTutorial && tutoIndex === 1 && positionTracker.distanceTo(cameraHolder.position) > 3) {
        MoveTutorial(true)
    }
    offsetX = 0
    offsetZ = 0

    requestIconRefresh = true
}


//#endregion

//#region ZOOM

const OnWheel = (e) => {
    if (InTutorial) {
        return
    }
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

const RequestTranslation = (x, y, z, zoom) => {
    if (hotspotTransition) {
        return
    }

    hotspotCamParam.initialPos = cameraHolder.position.clone()
    hotspotCamParam.state = 0
    hotspotCamParam.initialZoom = d.camera.zoom
    hotspotCamParam.hotspotPos = new d.THREE.Vector3(x,y,z)
    hotspotCamParam.button = null
    hotspotCamParam.offset = 0
    hotspotCamParam.zoom = zoom
    hotspotCamParam.tutorial = true
    hotspotTransition = true
}
const RequestHotspotTranslation = (hotspotPos, button) => {
    if (hotspotTransition) {
        return
    }
    
    hotspotCamParam.initialPos = cameraHolder.position.clone()
    hotspotCamParam.state = 0
    hotspotCamParam.initialZoom = d.camera.zoom
    hotspotCamParam.hotspotPos = hotspotPos
    hotspotCamParam.button = button
    hotspotCamParam.offset = button === null ? hotspotOffset : 0
    hotspotCamParam.zoom = animationZoom
    hotspotCamParam.tutorial = false
    hotspotTransition = true
    
}
const AnimateHotspotTranslation = (delta) => {

    const t = easeInOutSine(hotspotCamParam.state)
    
    //translation
    const targetX = hotspotCamParam.initialPos.x * (1-t) + (hotspotCamParam.hotspotPos.x - hotspotCamParam.offset) * t
    const targetZ = hotspotCamParam.initialPos.z * (1-t) + (hotspotCamParam.hotspotPos.z - hotspotCamParam.offset) * t

    cameraHolder.position.x = targetX
    cameraHolder.position.z = targetZ
    
    //zoom
    d.camera.zoom = (1-t) * hotspotCamParam.initialZoom + t * hotspotCamParam.zoom
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
        if (hotspotCamParam.tutorial) {
            TutorialResume()
        }
    }

    requestIconRefresh = true
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

//#region DATGUI
import Stats from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/stats.module.js'
import {GUI} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js'
const ShowDatGUI = true
let gui
let stats = null
let a_light

const InitGUI = (d) => {
    const guiWrap = document.getElementById('gui')
    stats = new Stats()
    guiWrap.appendChild(stats.dom)
    stats.dom.style.left = '75%'
    
    if (!ShowDatGUI) { 
        guiWrap.style.pointerEvents = 'none'
        return 
    }
    
    gui = new GUI({autoPlace: false, width: 260, hideable: true})
    let params = {
        lightColor:0xFFFFFF,
        lightIntensity:1.3,
        lightX : -100,
        lightY : 50,
        lightZ : -8,
        foam_color:0xb8ebf7,
        water_color:0x4488cc,
        water2_color:0x347aa5,
        wave_speed:0.2,
        outline_color:0xFFFFFF,
        outline_color2:0x3C3C01,
        edge_glow:0.0,
        edgeThickness:1.0,
        edgeStrength:3.0,
        pulsePeriod:0
        
    }
    gui.addColor(params, 'outline_color').onFinishChange((value) => outlinePass.visibleEdgeColor.setHex(value))
    gui.addColor(params, 'outline_color2').onFinishChange((value) => outlinePass.hiddenEdgeColor.setHex(value))
    gui.add(params, 'edge_glow').onFinishChange((value) => outlinePass.edgeGlow = value)
    gui.add(params, 'edgeThickness').onFinishChange((value) => outlinePass.edgeThickness = value)
    gui.add(params, 'edgeStrength').onFinishChange((value) => outlinePass.edgeStrength  = value)
    gui.add(params, 'pulsePeriod').onFinishChange((value) => outlinePass.pulsePeriod = value)
    
    gui.addColor(params,'lightColor').onFinishChange((value) => a_light.color.setHex(value))
    gui.add(params,'lightIntensity').min(0).max(10).onFinishChange((value) => a_light.intensity = value)
    gui.add(a_light.position, "x", -100, 100, 0.01)
    gui.add(a_light.position, "y", -100, 100, 0.01)
    gui.add(a_light.position, "z", -100, 100, 0.01)
    
    gui.addColor(params,'foam_color').onFinishChange(
        (value) => {
            let color = new d.THREE.Color(value)
            ocean_uniforms.foamCol.value.set(color.r, color.g, color.b)
        }
    )
    let color = new d.THREE.Color(params.foam_color)
    ocean_uniforms.foamCol.value.set(color.r, color.g,color.b)
    gui.addColor(params,'water_color').onFinishChange(
        (value) => {
            let color = new d.THREE.Color(value)
            ocean_uniforms.waterCol.value.set(color.r, color.g, color.b)
        }
    )
    color = new d.THREE.Color(params.water_color)
    ocean_uniforms.waterCol.value.set(color.r, color.g,color.b)
    gui.addColor(params,'water2_color').onFinishChange(
        (value) => {
            let color = new d.THREE.Color(value)
            ocean_uniforms.water2Col.value.set(color.r, color.g, color.b)
        }
    )
    color = new d.THREE.Color(params.water2_color)
    ocean_uniforms.water2Col.value.set(color.r, color.g,color.b)
    gui.add(params, 'wave_speed').onFinishChange((value) => ocean_uniforms.speed.value = value)
    guiWrap.appendChild(gui.domElement);
    gui.open();
}


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
            InitGUI(d)
            InitializeShaders(threeData)
            InitializeHotspots(threeData)
            InitializeCursor(threeData)
            setupEnvironment()
            d.scene.getObjectByName('Eau').material = ocean_mat
            d.scene.getObjectByName('Eau001').material.color.setRGB(ocean_uniforms.waterCol)
            d.scene.getObjectByName('Eau002').material.color.setRGB(ocean_uniforms.waterCol)
            console.log(d.scene.getObjectByName('Eau'))
            animate()
        },
        (xhr) => {
        },
        (error) => {
            console.log('error : ' + error)
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
    
    const b_light  = new d.THREE.AmbientLight(0xffffff, 0.3)
    b_light.name = 'ambient_light'
    d.scene.add( b_light )

    a_light  = new d.THREE.DirectionalLight(0xffffff, 1.3)
    a_light.position.set(-100, 50, -8) // ~60º
    a_light.name = 'main_light'
    d.scene.add(a_light)

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
    delta = Math.min(delta, 0.03)
    updateVolume(delta)
    UpdateUniforms(delta)
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

//#region SHADERS

import { EffectComposer } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/OutlinePass.js';

//#region OCEAN
let ocean_mat
const ocean_uniforms = {
    iTime: {
        type: "f",
        value: 1.0
    },
    speed:{
        type: "f",
        value: 0.2
    },
    iResolution: {
        type: "v2",
        value: new THREE.Vector2(1,1)
    },
    waterCol: {
        type: "v3",
        value: new THREE.Vector3(0,0.4,0.7)
    },
    water2Col: {
        type: "v3",
        value: new THREE.Vector3(0,0.1,0.5)
    },
    foamCol: {
        type: "v3",
        value: new THREE.Vector3(0.8,0.95,0.95)
    }
};


const ocean_vert = 
    "attribute vec3 in_Position;\n" +
    "    varying vec2 fragCoord;\n" +
    "    varying vec2 vUv; \n" +
    "    void main()\n" +
    "    {\n" +
    "        vUv = uv;\n" +
    "        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );\n" +
    "        gl_Position = projectionMatrix * mvPosition;\n" +
    "        fragCoord = position.xz;\n" +
    "    }"
const ocean_frag = 
    "#define M_2PI 6.283185307\n" +
    "#define M_6PI 18.84955592\n" +
    "\n" +
    "    uniform float iTime;\n" +
    "    uniform float speed;\n" +
    "    uniform vec2 iResolution;\n" +
    "    uniform vec3 waterCol;\n" +
    "    uniform vec3 water2Col;\n" +
    "    uniform vec3 foamCol;\n" +
    "    varying vec2 fragCoord;\n" +
    "    varying vec2 vUv;\n" +
    "float circ(vec2 pos, vec2 c, float s)\n" +
    "{\n" +
    "    c = abs(pos - c);\n" +
    "    c = min(c, 1.0 - c);\n" +
    "    return smoothstep(0.0, 0.002, sqrt(s) - sqrt(dot(c, c))) * -1.0;\n" +
    "}\n" +
    "\n" +
    "// Foam pattern for the water constructed out of a series of circles\n" +
    "float waterlayer(vec2 uv)\n" +
    "{\n" +
    "    uv = mod(uv, 1.0); // Clamp to [0..1]\n" +
    "    float ret = 1.0;\n" +
    "    ret += circ(uv, vec2(0.37378, 0.277169), 0.0268181);\n" +
    "    ret += circ(uv, vec2(0.0317477, 0.540372), 0.0193742);\n" +
    "    ret += circ(uv, vec2(0.430044, 0.882218), 0.0232337);\n" +
    "    ret += circ(uv, vec2(0.641033, 0.695106), 0.0117864);\n" +
    "    ret += circ(uv, vec2(0.0146398, 0.0791346), 0.0299458);\n" +
    "    ret += circ(uv, vec2(0.43871, 0.394445), 0.0289087);\n" +
    "    ret += circ(uv, vec2(0.909446, 0.878141), 0.028466);\n" +
    "    ret += circ(uv, vec2(0.310149, 0.686637), 0.0128496);\n" +
    "    ret += circ(uv, vec2(0.928617, 0.195986), 0.0152041);\n" +
    "    ret += circ(uv, vec2(0.0438506, 0.868153), 0.0268601);\n" +
    "    ret += circ(uv, vec2(0.308619, 0.194937), 0.00806102);\n" +
    "    ret += circ(uv, vec2(0.349922, 0.449714), 0.00928667);\n" +
    "    ret += circ(uv, vec2(0.0449556, 0.953415), 0.023126);\n" +
    "    ret += circ(uv, vec2(0.117761, 0.503309), 0.0151272);\n" +
    "    ret += circ(uv, vec2(0.563517, 0.244991), 0.0292322);\n" +
    "    ret += circ(uv, vec2(0.566936, 0.954457), 0.00981141);\n" +
    "    ret += circ(uv, vec2(0.0489944, 0.200931), 0.0178746);\n" +
    "    ret += circ(uv, vec2(0.569297, 0.624893), 0.0132408);\n" +
    "    ret += circ(uv, vec2(0.298347, 0.710972), 0.0114426);\n" +
    "    ret += circ(uv, vec2(0.878141, 0.771279), 0.00322719);\n" +
    "    ret += circ(uv, vec2(0.150995, 0.376221), 0.00216157);\n" +
    "    ret += circ(uv, vec2(0.119673, 0.541984), 0.0124621);\n" +
    "    ret += circ(uv, vec2(0.629598, 0.295629), 0.0198736);\n" +
    "    ret += circ(uv, vec2(0.334357, 0.266278), 0.0187145);\n" +
    "    ret += circ(uv, vec2(0.918044, 0.968163), 0.0182928);\n" +
    "    ret += circ(uv, vec2(0.965445, 0.505026), 0.006348);\n" +
    "    ret += circ(uv, vec2(0.514847, 0.865444), 0.00623523);\n" +
    "    ret += circ(uv, vec2(0.710575, 0.0415131), 0.00322689);\n" +
    "    ret += circ(uv, vec2(0.71403, 0.576945), 0.0215641);\n" +
    "    ret += circ(uv, vec2(0.748873, 0.413325), 0.0110795);\n" +
    "    ret += circ(uv, vec2(0.0623365, 0.896713), 0.0236203);\n" +
    "    ret += circ(uv, vec2(0.980482, 0.473849), 0.00573439);\n" +
    "    ret += circ(uv, vec2(0.647463, 0.654349), 0.0188713);\n" +
    "    ret += circ(uv, vec2(0.651406, 0.981297), 0.00710875);\n" +
    "    ret += circ(uv, vec2(0.428928, 0.382426), 0.0298806);\n" +
    "    ret += circ(uv, vec2(0.811545, 0.62568), 0.00265539);\n" +
    "    ret += circ(uv, vec2(0.400787, 0.74162), 0.00486609);\n" +
    "    ret += circ(uv, vec2(0.331283, 0.418536), 0.00598028);\n" +
    "    ret += circ(uv, vec2(0.894762, 0.0657997), 0.00760375);\n" +
    "    ret += circ(uv, vec2(0.525104, 0.572233), 0.0141796);\n" +
    "    ret += circ(uv, vec2(0.431526, 0.911372), 0.0213234);\n" +
    "    ret += circ(uv, vec2(0.658212, 0.910553), 0.000741023);\n" +
    "    ret += circ(uv, vec2(0.514523, 0.243263), 0.0270685);\n" +
    "    ret += circ(uv, vec2(0.0249494, 0.252872), 0.00876653);\n" +
    "    ret += circ(uv, vec2(0.502214, 0.47269), 0.0234534);\n" +
    "    ret += circ(uv, vec2(0.693271, 0.431469), 0.0246533);\n" +
    "    ret += circ(uv, vec2(0.415, 0.884418), 0.0271696);\n" +
    "    ret += circ(uv, vec2(0.149073, 0.41204), 0.00497198);\n" +
    "    ret += circ(uv, vec2(0.533816, 0.897634), 0.00650833);\n" +
    "    ret += circ(uv, vec2(0.0409132, 0.83406), 0.0191398);\n" +
    "    ret += circ(uv, vec2(0.638585, 0.646019), 0.0206129);\n" +
    "    ret += circ(uv, vec2(0.660342, 0.966541), 0.0053511);\n" +
    "    ret += circ(uv, vec2(0.513783, 0.142233), 0.00471653);\n" +
    "    ret += circ(uv, vec2(0.124305, 0.644263), 0.00116724);\n" +
    "    ret += circ(uv, vec2(0.99871, 0.583864), 0.0107329);\n" +
    "    ret += circ(uv, vec2(0.894879, 0.233289), 0.00667092);\n" +
    "    ret += circ(uv, vec2(0.246286, 0.682766), 0.00411623);\n" +
    "    ret += circ(uv, vec2(0.0761895, 0.16327), 0.0145935);\n" +
    "    ret += circ(uv, vec2(0.949386, 0.802936), 0.0100873);\n" +
    "    ret += circ(uv, vec2(0.480122, 0.196554), 0.0110185);\n" +
    "    ret += circ(uv, vec2(0.896854, 0.803707), 0.013969);\n" +
    "    ret += circ(uv, vec2(0.292865, 0.762973), 0.00566413);\n" +
    "    ret += circ(uv, vec2(0.0995585, 0.117457), 0.00869407);\n" +
    "    ret += circ(uv, vec2(0.377713, 0.00335442), 0.0063147);\n" +
    "    ret += circ(uv, vec2(0.506365, 0.531118), 0.0144016);\n" +
    "    ret += circ(uv, vec2(0.408806, 0.894771), 0.0243923);\n" +
    "    ret += circ(uv, vec2(0.143579, 0.85138), 0.00418529);\n" +
    "    ret += circ(uv, vec2(0.0902811, 0.181775), 0.0108896);\n" +
    "    ret += circ(uv, vec2(0.780695, 0.394644), 0.00475475);\n" +
    "    ret += circ(uv, vec2(0.298036, 0.625531), 0.00325285);\n" +
    "    ret += circ(uv, vec2(0.218423, 0.714537), 0.00157212);\n" +
    "    ret += circ(uv, vec2(0.658836, 0.159556), 0.00225897);\n" +
    "    ret += circ(uv, vec2(0.987324, 0.146545), 0.0288391);\n" +
    "    ret += circ(uv, vec2(0.222646, 0.251694), 0.00092276);\n" +
    "    ret += circ(uv, vec2(0.159826, 0.528063), 0.00605293);\n" +
    "\treturn max(ret, 0.0);\n" +
    "}\n" +
    "\n" +
    "// Procedural texture generation for the water\n" +
    "vec3 water(vec2 uv, vec3 cdir)\n" +
    "{\n" +
    "    uv *= vec2(0.25);\n" +
    "    \n" +
    "\n" +
    "    // Parallax height distortion with two directional waves at\n" +
    "    // slightly different angles.\n" +
    "    vec2 a = 0.025 * cdir.xz / cdir.y; // Parallax offset\n" +
    "    float h = sin(uv.x + iTime*speed); // Height at UV\n" +
    "    uv += a * h;\n" +
    "    h = sin(0.841471 * uv.x - 0.540302 * uv.y + iTime*speed);\n" +
    "    uv += a * h;\n" +
    "\n" +
    "    \n" +
    "\n" +
    "    // Texture distortion\n" +
    "    float d1 = mod(uv.x + uv.y, M_2PI);\n" +
    "    float d2 = mod((uv.x + uv.y + 0.25) * 1.3, M_6PI);\n" +
    "    d1 = iTime * speed * 0.07 + d1;\n" +
    "    d2 = iTime * speed * 0.5 + d2;\n" +
    "    vec2 dist = vec2(\n" +
    "    \tsin(d1) * 0.15 + sin(d2) * 0.05,\n" +
    "    \tcos(d1) * 0.15 + cos(d2) * 0.05\n" +
    "    );\n" +
    "    \n" +
    "    vec3 ret = mix(waterCol, water2Col, waterlayer(uv + dist.xy));\n" +
    "    ret = mix(ret, foamCol, waterlayer(vec2(1.0) - uv - dist.yx));\n" +
    "    return ret;\n" +
    "}\n" +
    "\n" +
    "// Camera perspective based on [0..1] viewport\n" +
    "vec3 pixtoray(vec2 uv)\n" +
    "{\n" +
    "    vec3 pixpos;\n" +
    "    pixpos.xy = uv - 0.5;\n" +
    "    pixpos.y *= iResolution.y / iResolution.x; // Aspect correction\n" +
    "    pixpos.z = -0.6; // Focal length (Controls field of view)\n" +
    "    return normalize(pixpos);\n" +
    "}\n" +
    "\n" +
    "// Quaternion-vector multiplication\n" +
    "vec3 quatmul(vec4 q, vec3 v)\n" +
    "{\n" +
    "    vec3 qvec = q.xyz;\n" +
    "    vec3 uv = cross(qvec, v);\n" +
    "    vec3 uuv = cross(qvec, uv);\n" +
    "    uv *= (2.0 * q.w);\n" +
    "    uuv *= 2.0;\n" +
    "    return v + uv + uuv;\n" +
    "}\n" +
    "\n" +
    "void main()\n" +
    "{\n" +
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "\n" +
    "        // Camera stuff\n" +
    "        vec2 uv = (fragCoord.xy) / iResolution.xy;\n" +
    "        vec3 cpos = vec3(0.0, 20.0, 0.0); // Camera position\n" +
    "        vec3 cdir = pixtoray(uv);\n" +
    "        cdir = quatmul( // Tilt down slightly\n" +
    "            vec4(-0.6, 0.0, 0.0, 1), cdir);\n" +
    "\n" +
    "        // Ray-plane intersection\n" +
    "        const vec3 ocean = vec3(0.0, 1.0, 0.0);\n" +
    "        float dist = -dot(cpos, ocean) / dot(cdir, ocean);\n" +
    "        vec3 pos = cpos + dist * cdir;\n" +
    "\n" +
    "        vec3 wat = water(pos.xz, cdir);\n" +
    "        gl_FragColor.rgb += wat * vec3(1);\n" +
    "}\n"
//#endregion

//#region OUTLINE

let selectedObjects = []
let outlinePass
let outlinePassHighlight
let mouse
let aiming = false
let currentObject

const DebugRaycast = (clientX, clientY) => {
    mouse.x = (clientX / window.innerWidth) * 2 - 1
    mouse.y = -(clientY/window.innerHeight) * 2 + 1

    d.raycaster.setFromCamera(mouse,d.camera)
    const intersects = d.raycaster.intersectObjects(d.scene.children, true)
    console.log(intersects)
}

const RaycastOutline = (clientX, clientY) => {
    if (!IsNormal() && !IsRoom()) {
        return
    }
    mouse.x = (clientX / window.innerWidth) * 2 - 1
    mouse.y = -(clientY/window.innerHeight) * 2 + 1
    
    d.raycaster.setFromCamera(mouse,d.camera)
    
    if (!aiming) {
        const intersects = d.raycaster.intersectObjects(selectedObjects, true)

        if (intersects.length > 0) {
            AimAtObject(intersects[0].object)
        }
    }
    else {
        const intersects = d.raycaster.intersectObject(currentObject, true)
        if (intersects.length === 0) {
            StopAimAtObject()
        }
    }
}
const AddToSelectedObjects = (obj) => {
    selectedObjects.push(obj)
    outlinePass.selectedObjects = selectedObjects
}

const AimAtObject = (obj) => {
    if (aiming) {
        return
    }
    RoomMode()
    currentObject = obj
    
    selectedObjects = selectedObjects.filter((value) => value !== obj)
    outlinePass.selectedObjects = selectedObjects
    
    const target = []
    target.push(obj)
    outlinePassHighlight.selectedObjects = target
    aiming = true
}

const StopAimAtObject = () => {
    if (!aiming) {
        return
    }
    NormalMode()

    outlinePassHighlight.selectedObjects = []
    selectedObjects.push(currentObject)
    outlinePass.selectedObjects = selectedObjects
    
    aiming = false
}

//#endregion

const InitializeShaders = (d) => {
    mouse = new d.THREE.Vector2()
    ocean_mat = new THREE.ShaderMaterial({
        uniforms: ocean_uniforms,
        vertexShader: ocean_vert,
        fragmentShader: ocean_frag
    })
    // postprocessing

    d.composer = new EffectComposer( d.renderer );

    const renderPass = new RenderPass( d.scene, d.camera );
    d.composer.addPass( renderPass );

    outlinePass = new OutlinePass( new d.THREE.Vector2( window.innerWidth, window.innerHeight ), d.scene, d.camera );
    d.composer.addPass( outlinePass );

    outlinePassHighlight = new OutlinePass( new d.THREE.Vector2( window.innerWidth, window.innerHeight ), d.scene, d.camera );
    d.composer.addPass( outlinePassHighlight );
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load( 'https://lucas971.github.io/UEX/public/images/tri_pattern.jpg', function ( texture ) {

        outlinePass.patternTexture = texture;
        outlinePassHighlight.patternTexture = texture
        texture.wrapS = d.THREE.RepeatWrapping;
        texture.wrapT = d.THREE.RepeatWrapping;

    } );

    outlinePass.edgeThickness = 1
    outlinePass.edgeGlow = 0
    outlinePass.edgeStrength = 3
    outlinePass.pulsePeriod = 0
    outlinePass.visibleEdgeColor.setHex(0xffffff)
    outlinePass.hiddenEdgeColor.setHex(0x3c3c01)

    outlinePassHighlight.edgeThickness = 2
    outlinePassHighlight.edgeGlow = 2
    outlinePassHighlight.edgeStrength = 5
    outlinePassHighlight.pulsePeriod = 2
    outlinePassHighlight.visibleEdgeColor.setHex(0xffa705)
    outlinePassHighlight.hiddenEdgeColor.setHex(0x939329)
}

const UpdateUniforms = (delta) => {
    ocean_uniforms.iTime.value = ocean_uniforms.iTime.value + delta
}


//#endregion

//#region ENVIRONMENT
import {RGBELoader} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/RGBELoader.js'
const setupEnvironment = () => {
    
    getCubeMapTexture( 'https://lucas971.github.io/UEX/public/environment/venice_sunset_1k.hdr' ).then(( { envMap } ) => {

        d.scene.environment = envMap;
        d.scene.background = envMap;

    });

}

const getCubeMapTexture = ( path ) => {

    // no envmap
    if ( ! path ) return Promise.resolve( { envMap: null } );

    const pmremGenerator = new d.THREE.PMREMGenerator(d.renderer)
    pmremGenerator.compileEquirectangularShader()
    return new Promise( ( resolve, reject ) => {

        new RGBELoader()
            .setDataType( d.THREE.UnsignedByteType )
            .load( path, ( texture ) => {

                const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                pmremGenerator.dispose();

                resolve( { envMap } );

            }, undefined, reject );

    });

}

//#endregion

//#region TIMER

let hours, mins, msLeft, time;
const element = document.getElementById( 'countdown' );
const endTime = (+new Date) + 1000 * (60*1 + 0) + 500;
let isInitialized = false

const Initialized = () => {
    isInitialized = true
    ClosePopUp()
}

const ClosePopUp = () => {
    document.getElementById('pop-up-wrapper').style.display = 'none'
}

document.getElementById('yes-button').addEventListener('click', Initialized)
document.getElementById('no-button').addEventListener('click', ClosePopUp)

const twoDigits = ( n ) =>
{
    return (n <= 9 ? "0" + n : n);
}

const updateTimer = ( ) =>
{
    if (!isInitialized) {
        time = new Date( msLeft );
        setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        return
    }
    msLeft = endTime - (+new Date);
    if ( msLeft < 1000 ) {
        element.innerHTML = "FIN!";
        isInitialized = false
        document.getElementById('pop-up-wrapper').style.display = 'inherit'
        document.getElementById('pop-up-begin').style.display = 'none'
        document.getElementById('pop-up-end').style.display = 'inherit'
    } else {
        time = new Date( msLeft );
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
    }
    setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
}


//#endregion

//region TUTORIAL
const tutorialDiv = document.getElementById('tutorial-wrapper')
const tutorialLeft = document.getElementById('tutorial-left')
const tutorialRight = document.getElementById('tutorial-right')
const tutorialNumber = document.getElementById('tutorial-number')
const tutorialText = document.getElementById('tutorial-text')
const tutorialTexts = [
    'Bienvenue dans l\'Usine Extraordinaire ! La ville vient d\'ouvrir ses portes aux visiteurs.',
    'Pour vous déplacer, cliquez et tirez avec la souris. Essayez !',
    'Pour ouvrir des contenus, cliquez sur les icones sur la carte.',
    'Quand vous trouvez un contenu, votre progression est sauvegardée dans le cube, en haut à droite !',
    'Ici, c\'est l\'Agora, un lieu de présentation en direct !',
    'Certains bâtiments sont visitables !',
    'Bonne exploration à vous !'
]
const tutorialPos = [
    false,
    false,
    [-5,1.1,-2.5,1.2],
    false,
    [24,1.1,-1.4,1.2],
    [54,1.1,-40,0.8],
    [38,1.1,8,0.6],
]

let tutoIndex;
let InTutorial = false
const InitializeTutorial = () => {
    if (localStorage.tutorialDone) {
        return
    }
    InTutorial = true
    tutoIndex = 0
    tutorialDiv.style.display = 'flex'
    
    tutorialLeft.addEventListener('click', () => MoveTutorial(false))
    tutorialRight.addEventListener('click', () => MoveTutorial(true))
    tutorialLeft.style.pointerEvents = 'none'
}
const MoveTutorial = (right) => {
    if (right) {
        tutoIndex++
    } else {
        tutoIndex--
    }
    
    if (tutoIndex > tutorialTexts.length) {
        tutorialDiv.style.display = 'none'
        InTutorial = false
        return
    }
    UpdateTutorialView()
    if (tutorialPos[tutoIndex]) {
        tutorialLeft.style.pointerEvents = 'none'
        tutorialRight.style.pointerEvents = 'none'
        RequestTranslation(tutorialPos[tutoIndex][0], tutorialPos[tutoIndex][1], tutorialPos[tutoIndex][2], tutorialPos[tutoIndex][3])
    }
    
}

const UpdateTutorialView = () => {
    tutorialNumber.innerHTML = (tutoIndex + 1).toString()
    tutorialText.innerHTML = tutorialTexts[tutoIndex]
    
    tutorialRight.style.pointerEvents = 'all'
    tutorialLeft.style.pointerEvents = 'all'
    if (tutoIndex === 0) {
        tutorialLeft.style.pointerEvents = 'none'
    } 
    if (tutoIndex === 1 || tutoIndex === 2 || tutoIndex === 3) {
        tutorialRight.style.pointerEvents = 'none'
    }
}
const TutorialResume = () =>{
    tutorialLeft.style.pointerEvents = 'all'
    tutorialRight.style.pointerEvents = 'all'
    UpdateTutorialView()
}
//#endregion

//#region Quizz
const tripettos = []
let InitQuizzes = () => {
    tripettos[0] = document.getElementById("tripetto1")
    tripettos[1] = document.getElementById("tripetto2")
    tripettos[2] = document.getElementById("tripetto3")
    tripettos[3] = document.getElementById("tripetto4")
    tripettos[4] = document.getElementById("tripetto5")
    
    var tripetto1 = TripettoServices.init({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMXo1cE02VDFBWWF2NVVRN1p3dEYzbDEydms5cjNDRU90U1NML0lnMnM2bz0iLCJkZWZpbml0aW9uIjoiZGRodGI3bHZSQUsyUzEvKzZ2ZmwvWkYvbTNXYUVUL29Jb01UeG5CYW8wWT0iLCJ0eXBlIjoiY29sbGVjdCJ9.sChCPsyGKl09exdXUNJ2q1WgeVimLVie4-nWc0K2EJM"})

    TripettoAutoscroll.run({
        element: tripettos[0],
        definition: tripetto1.definition,
        styles: tripetto1.styles,
        l10n: tripetto1.l10n,
        locale: tripetto1.locale,
        translations: tripetto1.translations,
        attachments: tripetto1.attachments,
        onSubmit: tripetto1.onSubmit
    })

    var tripetto2 = TripettoServices.init({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMXo1cE02VDFBWWF2NVVRN1p3dEYzbDEydms5cjNDRU90U1NML0lnMnM2bz0iLCJkZWZpbml0aW9uIjoiZm5pOGxlc2RmRGRYMmZ0Q0c4Qjhuc2EzRHRCaStWaTZNY0xyd2V5NE9JRT0iLCJ0eXBlIjoiY29sbGVjdCJ9.IO231ZkcY7bpd0pbFoyiQ1sW4hjW1UjmPtOFC6X9sOg"})

    TripettoAutoscroll.run({
        element: tripettos[1],
        definition: tripetto2.definition,
        styles: tripetto2.styles,
        l10n: tripetto2.l10n,
        locale: tripetto2.locale,
        translations: tripetto2.translations,
        attachments: tripetto2.attachments,
        onSubmit: tripetto2.onSubmit
    })

    var tripetto3 = TripettoServices.init({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMXo1cE02VDFBWWF2NVVRN1p3dEYzbDEydms5cjNDRU90U1NML0lnMnM2bz0iLCJkZWZpbml0aW9uIjoiVGpzR0F4enNQTG5ZT25iSHkxTkVBc1h0aWFUN2JaeTBEaWVwaE5FWWUyZz0iLCJ0eXBlIjoiY29sbGVjdCJ9.8pI9N08xuFVLk1To5h3Qz4ryxLw5CQA0dFWwVFGup3o"})

    TripettoAutoscroll.run({
        element: tripettos[2],
        definition: tripetto3.definition,
        styles: tripetto3.styles,
        l10n: tripetto3.l10n,
        locale: tripetto3.locale,
        translations: tripetto3.translations,
        attachments: tripetto3.attachments,
        onSubmit: tripetto3.onSubmit
    })

    var tripetto4 = TripettoServices.init({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMXo1cE02VDFBWWF2NVVRN1p3dEYzbDEydms5cjNDRU90U1NML0lnMnM2bz0iLCJkZWZpbml0aW9uIjoiVW1HRlRyTzFxdFFtKy84dW9UZWZwUTRKZmN1aFZBSXo4enZnOVV0dFdPND0iLCJ0eXBlIjoiY29sbGVjdCJ9.e23-UQz0LL3t8cptvBiyKMX2CfpAq0550aOR5Okvgfo"})

    TripettoAutoscroll.run({
        element: tripettos[3],
        definition: tripetto4.definition,
        styles: tripetto4.styles,
        l10n: tripetto4.l10n,
        locale: tripetto4.locale,
        translations: tripetto4.translations,
        attachments: tripetto4.attachments,
        onSubmit: tripetto4.onSubmit
    })

    var tripetto5 = TripettoServices.init({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMXo1cE02VDFBWWF2NVVRN1p3dEYzbDEydms5cjNDRU90U1NML0lnMnM2bz0iLCJkZWZpbml0aW9uIjoiclpUSWJiSXJIeEV2YVJkTFI3K0JOZ3Q1TG5aekNwYUJUVUpDSFprTThScz0iLCJ0eXBlIjoiY29sbGVjdCJ9.O4zAq8Y7CxOcdaNvoEy7ihHcIVmc4hUqGyIt_o8i-9o"})

    TripettoAutoscroll.run({
        element: tripettos[4],
        definition: tripetto5.definition,
        styles: tripetto5.styles,
        l10n: tripetto5.l10n,
        locale: tripetto5.locale,
        translations: tripetto5.translations,
        attachments: tripetto5.attachments,
        onSubmit: tripetto5.onSubmit
    })
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
    clock.start()
    const scene = new THREE.Scene()

    const camera = null

    const renderer = new THREE.WebGLRenderer({antialias: true})
    const canvas = document.getElementById("canvas")
    renderer.physicallyCorrectLights = true
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setClearColor( 0xEDE89F )
    renderer.setPixelRatio( window.devicePixelRatio)
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

    const raycaster = new THREE.Raycaster();
    
    threeData = {THREE, loader, clock, scene, camera, renderer, canvas, raycaster}
    
    document.getElementsByClassName("menu-uex-div")[0].style.pointerEvents = 'none'
    document.getElementsByClassName("hamburger-div")[0].style.pointerEvents = 'all'
    document.getElementsByClassName("color-div-wrapper")[0].style.pointerEvents = 'all'
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
    if (stats !== null) {
        stats.update()
    }
    requestAnimationFrame( animate )
    if (activeScene === cityActiveScene) {
        UpdateCity(threeData)
    }
    threeData.composer.render()
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
    updateTimer()
    setup()
    InitializeTrophees()
    LoadCityScene()
    InitQuizzes()
}
main()

//#endregion