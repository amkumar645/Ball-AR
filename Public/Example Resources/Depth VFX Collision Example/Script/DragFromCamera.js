// DragFromCamera.js
// Version: 0.0.1
// Event: On Awake
// Description: Allow user to drag object around the screen

// @input Component.Camera camera
// @input Component.InteractionComponent interaction


if (!script.camera) {
    print("ERROR: Please set the Camera to the script.");
    return;
}
if (!script.interaction) {
    print("ERROR: Please set the Interaction component to the script.");
    return;
}


var selfObj = script.getSceneObject();
var selfTransform = script.getTransform();

/** @type {InteractionComponent} */
var interaction = script.interaction;
if (interaction == null) {
    interaction = selfObj.getComponent("Component.InteractionComponent");
    if (interaction == null) {
        interaction = selfObj.createComponent("Component.InteractionComponent");
    }
}

/** @type {Camera} */
var cam = script.camera;
var camTransform = cam.getTransform();

var isDragging = false;

var initDistance = -1;

/** @type {quat} */
var initRotation;

/** @type {vec2} */
var initTouchOffset = vec2.zero();

/** @type {vec3} */
var offsetPosition;


/**
 * 
 * @param {vec2} screenPos 
 */
function updateDragPos(screenPos) {
    var adjustedPos = screenPos.add(initTouchOffset);

    var worldPos = cam.screenSpaceToWorldSpace(adjustedPos, initDistance);
    offsetPosition = camTransform.getInvertedWorldTransform().multiplyPoint(worldPos);
}

function cleanUpEvents() {
    global.TouchHelper.onTouchEnd.removeCallback(onGlobalTouchEnd);
    global.TouchHelper.onTouchMove.removeCallback(onGlobalTouchMove);
}

/**
 * 
 * @param {TouchStartEventArgs} eventArgs 
 */
function onLocalTouchStart(eventArgs) {
    if (isNull(global._draggedFromCameraObject)) {
        var objectCenterPos = cam.worldSpaceToScreenSpace(selfTransform.getWorldPosition());
        var touchPos = eventArgs.position;
        initTouchOffset = objectCenterPos.sub(touchPos);

        initDistance = camTransform.getWorldPosition().distance(selfTransform.getWorldPosition()) - cam.near;

        var oParent = selfObj.hasParent() ? selfObj.getParent() : null;
        var worldTransform = selfTransform.getWorldTransform();

        selfObj.setParent(cam.getSceneObject());
        selfTransform.setWorldTransform(worldTransform);

        initRotation = selfTransform.getLocalRotation();
        if (oParent == null) {
            selfObj.removeParent();
        } else {
            selfObj.setParent(oParent);
        }

        selfTransform.setWorldTransform(worldTransform);

        updateDragPos(eventArgs.position);

        isDragging = true;
        global._draggedFromCameraObject = selfObj;
    }
}

function checkIfDestroyed() {
    if (isNull(selfObj)) {
        cleanUpEvents();
        return true;
    }
}

/**
 * 
 * @param {TouchMoveEvent} eventArgs 
 */
function onGlobalTouchMove(eventArgs) {
    if (!checkIfDestroyed() && isDragging) {
        updateDragPos(eventArgs.getTouchPosition());
    }
}

/**
 * 
 * @param {TouchEndEvent} eventArgs 
 */
function onGlobalTouchEnd(eventArgs) {
    if (!checkIfDestroyed() && isDragging) {
        isDragging = false;
        global._draggedFromCameraObject = null;
    }
}

function onUpdate() {
    if (isDragging) {
        var oParent = selfObj.hasParent() ? selfObj.getParent() : null;
        selfObj.setParent(cam.getSceneObject());
        selfTransform.setLocalRotation(initRotation);
        selfTransform.setLocalPosition(offsetPosition);

        var worldMat = selfTransform.getWorldTransform();

        if (oParent == null) {
            selfObj.removeParent();
        } else {
            selfObj.setParent(oParent);
        }

        selfTransform.setWorldTransform(worldMat);
    }
}

interaction.onTouchStart.add(onLocalTouchStart);
global.TouchHelper.onTouchMove.addCallback(onGlobalTouchMove);
global.TouchHelper.onTouchEnd.addCallback(onGlobalTouchEnd);

script.createEvent("UpdateEvent").bind(onUpdate);