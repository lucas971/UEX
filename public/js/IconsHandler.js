//Manages the 2D icons sizes and positions on the screen

//#region IMPORTS

import {toScreenPosition} from './ScreenProjection.js'
import {loadJSON} from './JSONLoader.js'
import {RequestTransition} from "./CityCameraHandler.js";

//#endregion

//#region VARIABLES

//Array of icons struct. See ../iconsData.json for more information on the structure.
let icons

//The general content div from which enabling/disabling the pointer events.
let content

//Is the zoom animation playing?
let clickedLink = false

//#endregion

//#region API

//Creates the icons array from the json file and add the html images inside the Icons div.
export const InitializeIcons = (d) => {
    
    loadJSON("./iconsData.json",
        (data) => {
            icons = data["icons"]
            GenerateHtml(d)
        },
        (error) => {
        console.error(error)
        })
}

//Update the icons position on the screen using the 3D world space position of the building of interests.
export const UpdateIconsPosition = (d) => {
    d.camera.updateMatrixWorld()
    
    for (let i = 0; i < icons.length; i++) {
        const obj = d.scene.getObjectByName(icons[i].id)
        const toScreen = toScreenPosition(obj, d, icons[i].worldYMod)
        
        icons[i].image.style.left = `${toScreen.x - icons[i].width/2}px`
        icons[i].image.style.top = `${toScreen.y - icons[i].height/2}px`
    }
}

//#endregion

//#region HTML Generation

//Used at initialization to create the Image elements inside the icons div.
const GenerateHtml = (d) => {
    content = document.getElementById('content')
    
    const iconDiv = document.getElementById('icons')
    for (let i = 0; i< icons.length; i++) {
        icons[i].image = document.createElement('lottie-player')
        icons[i].image.classList.add("icon")
        icons[i].image.style.width = `${icons[i].width}px`
        icons[i].image.style.height = `${icons[i].height}px`
        icons[i].image.style.display = 'inherit'
        icons[i].image.draggable = false
        icons[i].image.autoplay = true
        icons[i].image.loop = true
        icons[i].image.mode="normal"
        icons[i].image.src = "lottie/icon.json"
        icons[i].image.addEventListener('click', () => LaunchHotspot(d.scene.getObjectByName(icons[i].id).position, i))
        iconDiv.appendChild(icons[i].image)
    }
}

//#endregion

//#region Hotspots

const LaunchHotspot = (pos, i) => {
    if (clickedLink) {
        return
    }
    clickedLink = true

    RequestTransition(pos, "hotspot/" + icons[i].type)
}

//#endregion