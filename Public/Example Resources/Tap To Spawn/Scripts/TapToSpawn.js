// TapToSpawn.js
// Version: 0.0.1
// Event: On Awake
// Description: Tap to spawn prefab on the world mesh

// @input Component.DeviceTracking deviceTracking
// @input Asset.ObjectPrefab prefab

if (!script.deviceTracking) {
    print("ERROR: Please set the device tracking to the script.");
    return;
}

if (!script.prefab) {
    print("ERROR: Please assign a prefab to the object that you want to be spawned.");
    return;
}

function onTouch(eventData) {
    var touchPos = eventData.getTapPosition();
    spawnObject(touchPos);
}

function spawnObject(screenPos) {
    var results = script.deviceTracking.hitTestWorldMesh(screenPos);

    if (results.length > 0) {
        var point = results[0].position;
        var normal = results[0].normal;

        var newObj = script.prefab.instantiate(null);
        newObj.getTransform().setWorldPosition(point);

        var up = vec3.up();
        var forwardDir = up.projectOnPlane(normal);
        var rot = quat.lookAt(forwardDir, normal);

        newObj.getTransform().setWorldRotation(rot);
    }
}

script.api.spawnObject = spawnObject;
script.createEvent("TapEvent").bind(onTouch);