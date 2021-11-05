const normal = 0
const drag = 1

let cursor
let mode

export const InitializeCursor = (d) => {
    cursor = document.getElementById('custom-cursor')
    NormalMode()
    window.addEventListener('mousemove', MoveCursor)
    window.addEventListener('mouseout', HideCursor)
    window.addEventListener('mouseleave', HideCursor)
    window.addEventListener('mouseover', ShowCursor)
}

export const IsNormal = () => {
    return mode === normal
}

export const IsDrag = () => {
    return mode === drag
}

const HideCursor = (e) => {
    cursor.style.display = "none"
}

const ShowCursor = (e) => {
    console.log('test')
    cursor.style.display = "inherit"
    
}
const MoveCursor = (e) => {
    cursor.style.top = e.pageY+"px";
    cursor.style.left = (e.pageX-20)+"px"
}

export const NormalMode = () => {
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "all"
    }
    cursor.src = "images/Cursor.png"
    mode = normal
}

export const DragMode = () => {
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    cursor.src = "images/Grab.png"
    mode = drag
}

