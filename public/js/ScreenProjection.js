//Auxiliary function allowing to project 3D objects into the 2D screen space.
export const toScreenPosition = (obj, d) => {
    const vector = new d.THREE.Vector3();

    const widthHalf = d.canvas.clientWidth/2
    const heightHalf = d.canvas.clientHeight/2

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.set(vector.x, vector.y, vector.z)
    vector.project(d.camera);

    vector.normX = vector.x
    vector.normY = vector.y
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y,
        normX: vector.normX,
        normY: vector.normY
    };
};