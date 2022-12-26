// SetRandomColorFromArray.js
// Version: 0.0.1
// Event: On Awake
// Description: Set random color and apply to the base color parameter of the materials

// @input Component.MaterialMeshVisual[] material
// @input vec4[] randomColors = {1,1,1,1} {"widget":"color"}

if (script.randomColors.length == 0) {
    return;
}

var curColor = getRandomColorFromArray();

for (var i = 0; i < script.material.length; i++) {
    if (!isNull(script.material[i])) {
        script.material[i].mainPass.baseColor = curColor;
    }
}

function getRandomColorFromArray() {
    var ind = Math.floor(Math.random() * script.randomColors.length);
    return script.randomColors[ind];
}