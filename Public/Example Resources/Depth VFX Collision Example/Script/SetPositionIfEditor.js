// SetPositionIfEditor.js
// Version: 0.0.1
// Event: On Awake
// Description: Set this object position if the current device is editor
// This script is mainly to make sure the template looks good in the editor

// @input vec3 desiredPosition
var isEditor = global.deviceInfoSystem.isEditor();
var thisTrans = script.getSceneObject().getTransform();

if (isEditor) {
    thisTrans.setWorldPosition(script.desiredPosition);
}