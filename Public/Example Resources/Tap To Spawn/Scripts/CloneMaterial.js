// CloneMaterial.js
// Version: 0.0.1
// Event: On Awake
// Description: Clone the material on the Mesh Visual component

// @input Component.MaterialMeshVisual meshVisual

if (!script.meshVisual) {
    print("ERROR: Please assign Mesh Visual to the script.");
    return;
}

script.meshVisual.mainMaterial = script.meshVisual.mainMaterial.clone();