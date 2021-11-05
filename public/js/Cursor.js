const normal = 0
const drag = 1

let cursor
let grab
let mode

export const InitializeCursor = (d) => {
    cursor = document.getElementById('custom-cursor')
    grab = document.getElementById('custom-grab')
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
    cursor.style.top = e.pageY+"px";
    cursor.style.left = (e.pageX-20)+"px"
    grab.style.top = e.pageY+"px";
    grab.style.left = (e.pageX-20)+"px"
}

export const NormalMode = () => {
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "all"
    }
    cursor.style.display = "inherit"
    grab.style.display = "none"
    mode = normal
}

export const DragMode = () => {
    let interactibles = document.getElementsByClassName('interactible');
    for (let i = 0; i < interactibles.length; i++) {
        interactibles[i].style.pointerEvents = "none"
    }
    cursor.style.display = "none"
    grab.style.display = "inherit"
    mode = drag
}

