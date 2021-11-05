const normal = 0
const drag = 1

let cursor
let mode

export const InitializeCursor = (d) => {
    cursor = document.getElementById('custom-cursor')
    NormalMode()
    window.addEventListener('mousemove', MoveCursor)
}

export const IsNormal = () => {
    return mode === normal
}

export const IsDrag = () => {
    return mode === drag
}

const MoveCursor = (e) => {
    cursor.style.top = e.pageY+"px";
    cursor.style.left = (e.pageX-20)+"px"
}

export const NormalMode = () => {
    cursor.style.backgroundColor = "white"
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "all"
    }
    mode = normal
}

export const DragMode = () => {
    cursor.style.backgroundColor = "yellow"
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    mode = drag
}

