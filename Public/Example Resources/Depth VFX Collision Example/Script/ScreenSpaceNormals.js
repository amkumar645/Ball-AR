// ScreenSpaceNormals.js
// Version 0.1.0
// Event: onAwake
// Create normals for selected objects based on their depth. Normals are rendered into the supplied Render Target and can be used for lighting or other effects in Material and VFX Editor.
// @input SceneObject[] objectsForNormalsGen
// @input SceneObject[] objectsForDepthTexture 
// @input bool advanced
// @ui {"widget":"group_start", "label":"Properties", "showIf" : "advanced"}
// @input bool enableBlur = false {"hint":"Blur the normal map."}
// @input float blurStrength = 4.0 {"showIf":"enableBlur","widget":"slider","min":0.0,"max":10.0,"step":0.01}

// @input Component.Camera camera {"hint":"The main render camera."}
// @input Asset.Texture normalsTarget {"hint":"Render target that will contain the screen space normals."}
// @input Asset.Texture screenTex {"label": "Screen Texture"}
// @input Asset.Material depthtoNormal {"label": "Depth to Normal"}
// @input Asset.Material blurMat {"label":"Blur Material", "showIf":"enableBlur"}
// @ui {"widget":"group_end"}

var depthLayer = LayerSet.makeUnique();
var normalLayer = LayerSet.makeUnique();

// Create a global array to hold cloned objects
// in case they need to be modified by another script
if (!global.ssn_clonedObj) {
    global.ssn_clonedObj = [];
}
script.ssn_maxRenderOrder = -100000;

initialize();

function initialize() {
    // Break when missing input
    if (!validateInputs()) { 
        return;
    }

    // Set up depth camera
    var depthCamera = global.scene.createSceneObject("DepthCam");
    depthCamera.setParent(script.camera.getSceneObject());
    var depthCameraComponent = depthCamera.copyComponent(script.camera);
    depthCameraComponent.renderLayer = depthLayer;
    depthCameraComponent.renderOrder = script.camera.renderOrder - 100;
    
    // Create depth texture
    depthCameraComponent.renderTarget.control.msaa = false;
    var depthStencilTexture = scene.createDepthStencilRenderTargetTexture();
    depthCameraComponent.depthStencilRenderTarget.depthClearOption = DepthClearOption.CustomValue;
    depthCameraComponent.depthStencilRenderTarget.targetTexture = depthStencilTexture;
    depthCameraComponent.depthStencilRenderTarget.clearDepth = 1.0;
    
    // Clone objects and assign to depthLayer
    // We need to do this in order for the depth target to be in sync with the final output target,
    // otherwise there is a 1 frame delay
    for (var i = 0; i < script.objectsForNormalsGen.length; i++) {
        // Skip if no scene object is assigned to this slot
        if (!script.objectsForNormalsGen[i]) {
            continue;
        } else {
            componentSearchAndClone(script.objectsForNormalsGen[i], depthLayer);
        }
    }

    // Set up normals pass
    createPostEffectForPass(script.depthtoNormal, normalLayer);
    var normalCamera = global.scene.createSceneObject("normalCam");
    normalCamera.setParent(script.camera.getSceneObject());
    script.normalCameraComponent = normalCamera.copyComponent(script.camera);
    script.normalCameraComponent.renderLayer = normalLayer;
    script.normalCameraComponent.renderTarget = script.normalsTarget;
    script.normalCameraComponent.renderOrder = depthCameraComponent.renderOrder + 1;

    script.depthtoNormal.mainPass.depthTexture = depthStencilTexture;
    script.depthtoNormal.mainPass.samplers.depthTexture.filtering = FilteringMode.Nearest;

    if (script.enableBlur) {
        setupBlurPasses(depthStencilTexture);
    }

    shareDepthTexture(depthStencilTexture);
}


function validateInputs() {
    if (!script.camera) {
        print("ERROR: Make sure Camera is set.");
        return false;
    }

    if (!Camera.depthStencilRenderTargetSupported()) {      
        print("ERROR: Device does not support depth stencil render targets.");
        return false;
    }

    if (script.shareDepthTexture == true) {
        for (var i = 0; i < script.objectsForDepthTexture.length; i++) {   
            if (!script.objectsForDepthTexture[i]) {
                print("ERROR: Make sure to select objects for depth texture in each input, remove empty input slot if there's any.");
            }
        }
        if (script.objectsForDepthTexture.length == 0) {
            print("ERROR: Please assign at least one scene object for depth texture.");
        }
    }

    for (var j = 0; j < script.objectsForNormalsGen.length; j++) {   
        if (!script.objectsForNormalsGen[j]) {
            print("ERROR: Make sure to select scene objects for normal generation in each input, remove empty input slot if there's any.");
        }
    }
    if (script.objectsForNormalsGen.length == 0) {
        print("ERROR: Please assign at least one scene object for normal generation.");
    }

    if (!script.normalsTarget) {
        print("ERROR: Make sure Normal render target is set.");
        return false;
    }
    if (!script.depthtoNormal) {
        print("ERROR: Make sure Depth to Normal material is set");
        return false;
    }
    if (script.enableBlur) {
        if (!script.blurMat) {
            print("ERROR: Make sure Bilateral Blur material is set");
            return false;
        }
    }    
    return true;
}

// Configure blur materials and create blur passes
function setupBlurPasses(depthStencilTexture) {
    script.blurMat.mainPass.baseTex = script.screenTex;
    script.blurMat.mainPass.samplers.baseTex.wrapU = WrapMode.ClampToEdge;
    script.blurMat.mainPass.samplers.baseTex.wrapV = WrapMode.ClampToEdge;
    script.blurMat.mainPass.depthTex = depthStencilTexture;
    script.blurMat.mainPass.samplers.depthTex.filtering = FilteringMode.Nearest;
    script.blurMat.mainPass.blurDirection = new vec2 (0.0, script.blurStrength);

    var blurMatH = script.blurMat.clone();
    blurMatH.mainPass.blurDirection = new vec2 (script.blurStrength,0.0);
    
    // Do the blur
    createPostEffectForPass(blurMatH, normalLayer);
    createPostEffectForPass(script.blurMat, normalLayer);
}

// Assign the depth stencil render target to materials and vfx assets with a sampler named 'depthTexture'
function shareDepthTexture(depthStencilTexture) {
    for (var i = 0; i < script.objectsForDepthTexture.length; i++) {
        if (script.objectsForDepthTexture[i]) {
            
            // Check for MaterialMeshVisuals
            var meshVisuals = script.objectsForDepthTexture[i].getComponents("Component.MaterialMeshVisual");
            for (var j = 0; j < meshVisuals.length; j++) {
                for (var k = 0; k < meshVisuals[j].getMaterialsCount(); k++) {
                    meshVisuals[j].getMaterial(k).mainPass.depthTexture = depthStencilTexture;
                    if (meshVisuals[j].getMaterial(k).mainPass.depthTexture) {    
                        meshVisuals[j].getMaterial(k).mainPass.samplers.depthTexture.filtering = FilteringMode.Nearest;
                    }
                }
            }
            
            // Check for VFXComponents
            var vfx = script.objectsForDepthTexture[i].getComponents("Component.VFXComponent");
            for (j = 0; j < vfx.length; j++) {
                if (vfx[j].asset) {
                    vfx[j].asset.properties.depthTexture = depthStencilTexture;
                    if (vfx[j].asset.properties.depthTexture) {
                        vfx[j].asset.simulations.allPasses[0].samplers.depthTexture.filtering = FilteringMode.Nearest;
                    }
                }
            }
                    
        }
    }
}


// Search for a render mesh visual component in a given scene object,
// clone the scene object it's attached to, and add to the depth prepass layer.
// Also duplicate the material and disable the color mask to avoid fragment shader cost
function componentSearchAndClone(meshVisualObject, layer) {
    var objects = [];
    getComponentRecursive(meshVisualObject, "Component.RenderMeshVisual", objects);
    
    var animMixers = [];
    var clonedObject;
    var newObjMat;
    var i;
    var j;
    
    for (i = 0; i < objects.length; i++) {
        
        var targetObject = objects[i].getSceneObject();  
        var animMixerObj = parentComponentSearch(targetObject, "Component.AnimationMixer");
        
        // If an animation mixer is a parent of this object, take a different path
        // This is because animations can have scale operations that would otherwise be applied recursively        
        if (animMixerObj) {
            var foundMatchingMixer = false;
            for (j = 0; j < animMixers.length; j++) {
                if (animMixerObj == animMixers[j]) { 
                    foundMatchingMixer = true;
                }
            }
            if (!foundMatchingMixer) {
                animMixers.push(animMixerObj);
            }
            continue;
        }
        
        clonedObject = targetObject.copyWholeHierarchy(targetObject);
        clonedObject.name = "ssn_" + clonedObject.name;
        clonedObject.getTransform().setLocalPosition(new vec3(0, 0, 0));
        clonedObject.getTransform().setLocalRotation(quat.quatIdentity());
        clonedObject.getTransform().setLocalScale(new vec3(1, 1, 1));
        
        newObjMat = objects[i].mainMaterial.clone();
        newObjMat.mainPass.colorMask = new vec4b(false,false,false,false);            
        clonedObject.getComponent("Component.RenderMeshVisual").mainMaterial = newObjMat;
        clonedObject.layer = layer;
                
        global.ssn_clonedObj.push(clonedObject);
    }
    
    // Get all the MeshVisual children of a cloned AnimationMixer hierarchy and add those to the depth layer
    for (i = 0; i < animMixers.length; i++) {
        
        clonedObject = animMixers[i].copyWholeHierarchy(animMixers[i]);
        clonedObject.name = "ssn_" + clonedObject.name;
        
        clonedObject.getTransform().setLocalPosition(new vec3(0, 0, 0));
        clonedObject.getTransform().setLocalRotation(quat.quatIdentity());
        clonedObject.getTransform().setLocalScale(new vec3(1, 1, 1));
                
        var animObjects = [];
        getComponentRecursive(clonedObject, "Component.RenderMeshVisual", animObjects);

        for (j = 0; j < animObjects.length; j++) {
            newObjMat = animObjects[j].mainMaterial.clone();
            newObjMat.mainPass.colorMask = new vec4b(false,false,false,false);            
            animObjects[j].mainMaterial = newObjMat;
            animObjects[j].getSceneObject().layer = layer;
        }

        global.ssn_clonedObj.push(clonedObject);
    }
}

function getComponentRecursive(rootObject, component, objects) {
    var comps = [];
    comps = rootObject.getComponents(component);
    for (var j = 0; j < comps.length; j++) {
        objects.push(comps[j]);
    }
    for (var i = 0; i < rootObject.getChildrenCount(); i++) {
        var children = rootObject.getChild(i);
        getComponentRecursive(children, component, objects);
    }
}

// Walk up the hierarchy and return a scene object if a given component is found
function parentComponentSearch(srcObj, component) {
    var foundObj = srcObj;
    if (foundObj.getComponent(component)) {
        return foundObj;
    } else {
        if (foundObj.hasParent()) {
            return parentComponentSearch(foundObj.getParent(), component);
        } else {
            return null;
        }
    }
}

function createPostEffectForPass(material, layer) {
    var meshSceneObj = scene.createSceneObject("");
    meshSceneObj.layer = layer;
    meshSceneObj.renderOrder = script.ssn_maxRenderOrder;
    script.ssn_maxRenderOrder++;
    meshSceneObj.createComponent("PostEffectVisual").mainMaterial = material;
    return meshSceneObj;
}