// DepthStencil.js
// Version: 0.0.1
// Event: Select on the script
// Description: Create depth stencil and apply it to the camera and vfx

// @input Component.Camera camera
// @input Component.VFXComponent vfx
// @input Asset.Material depthNormalMat

if (!script.camera) {
    print("ERROR: Please set the Camera to the script.");
    return;
}
if (!script.vfx) {
    print("ERROR: Please set the VFX component to the script.");
    return;
}
if (!script.vfx.asset) {
    print("ERROR: Please make sure VFX component contains VFX asset.");
    return;
}
if (!script.depthNormalMat) {
    print("ERROR: Please make sure to add the Depth Normal material from the Resources panel to the script.");
    return;
}
if (script.camera.supportedColorRenderTargetCount > 1) {
    var depthStencilTexture = scene.createDepthStencilRenderTargetTexture();
    script.camera.renderTarget.control.msaa = false;
    script.camera.depthStencilRenderTarget.depthClearOption = DepthClearOption.CustomValue;
    script.camera.depthStencilRenderTarget.targetTexture = depthStencilTexture;
    script.camera.depthStencilRenderTarget.clearDepth = 1.0;
    script.vfx.asset.properties.depthTexture = depthStencilTexture;
    script.depthNormalMat.mainPass.depthTexture = depthStencilTexture;
} else {
    print("ERROR: Depth stencil not supported.");
}