export const easeInOutCirc = (x) => {
    return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

export const easeInOutSine = (x) => {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export const easeInCube = (x) => {
    return x * x * x;
}

export const easeOutQuad = (x) => {
    return 1 - (1 - x) * (1 - x);
}