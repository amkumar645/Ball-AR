// HintManager.js
// Version: 0.0.1
// Event: Frame Update
// Description: Show and hide the hint object with two triggerResponses which one is disabling scene object
// and another one uses tween to show and hide the hint

// @input SceneObject hint
// @input int mode = 0 {"widget":"combobox", "values":[{"label":"Depth Texture", "value":0}, {"label":"World Mesh", "value":1}]}
// @input Asset.Texture depthTexture {"showIf":"mode", "showIfValue":"0"}
// @input Asset.RenderMesh worldMesh {"showIf":"mode", "showIfValue":"1"}
// @ui {"widget":"separator"}
// @input int triggerResponse {"widget":"combobox", "values":[{"label":"Disable/Enable Hint object on Depth", "value":0}, {"label":"Run tween based on Depth", "value":1}]}
// @ui {"widget":"group_start", "label":"Tween Name", "showIf" : "triggerResponse", "showIfValue" : "1"}
// @input string onDepth
// @input string onNoDepth
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Behavior Custom Trigger"}
// @input string onDepthBehavior {"label":"On Depth"}
// @input string onNoDepthBehavior {"label":"On No Depth"}
// @ui {"widget":"group_end"}

if (script.mode == 0 && !script.depthTexture) {
    print("ERROR: Please make sure to set a Depth Texture on the script.");
    return;
}

if (script.mode == 1 && !script.worldMesh) {
    print("ERROR: Please make sure to set a World Mesh on the script.");
    return;
}

if (!script.hint) {
    print("ERROR: Please make sure to add the hint object on the script.");
    return;
}

var curMode = script.mode;
var hasUsedDepth = false;
var isDepthDisappear = false;

function updateLookAroundHint() {
    if (hasUsedDepth) {
        disappearHint();
    } else {
        appearHint();
    }
}

function onUpdate() {
    hasUsedDepth = depthAvailable();
    updateLookAroundHint();
}

function disappearHint() {
    if (isDepthDisappear) {
        return;
    }
    switch (script.triggerResponse) {
        case 0:
            script.hint.enabled = false;
            break;
        case 1:
            global.tweenManager.startTween(script.hint, script.onDepth);
            break;
    }

    sendCustomTriggerToBehavior(script.onDepthBehavior);
    isDepthDisappear = true;
}

function appearHint() {
    if (!isDepthDisappear) {
        return;
    }

    switch (script.triggerResponse) {
        case 0:
            script.hint.enabled = true;
            break;
        case 1:
            global.tweenManager.startTween(script.hint, script.onNoDepth);
            break;
    }
    sendCustomTriggerToBehavior(script.onNoDepthBehavior);
    isDepthDisappear = false;
}

function depthAvailable() {
    return curMode == 0 ?
        (script.depthTexture.getWidth() > 1) :
        (scene.getCameraType() == "back" && script.worldMesh.control.getLoadStatus() == 2 && script.worldMesh.control.faceCount > 0);
}

function sendCustomTriggerToBehavior(name) {
    if (global.behaviorSystem) {
        global.behaviorSystem.sendCustomTrigger(name);
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);