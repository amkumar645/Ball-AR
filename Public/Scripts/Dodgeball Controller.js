// -----JS CODE-----
// @input SceneObject sphere
// @input Component.DeviceTracking deviceTracking
// @input Component.Camera camera
// @input SceneObject head
// @input SceneObject hips
// @input SceneObject leftHand
// @input SceneObject rightHand
// @input SceneObject leftShoulder
// @input SceneObject rightShoulder
// @input SceneObject spine
// @input SceneObject neck
// @input SceneObject spine1
// @input SceneObject spine2
// @input SceneObject leftArm
// @input SceneObject rightArm
// @input SceneObject leftForearm
// @input SceneObject rightForearm
// @input SceneObject leftLeg
// @input SceneObject rightLeg
// @input SceneObject leftUpLeg
// @input SceneObject rightUpLeg
// @input SceneObject leftFoot
// @input SceneObject rightFoot
// @input Component.Text text
// @input Component.Image titleImage
// @input Component.Image instructionsImage
// @input Component.Image gotBallImage
// @input Component.Image noBallImage
// @input Component.Image backAtStartImage
// @input Component.Image beginningSurfaceImage
// @input Component.Image opponentHitImage
// @input Component.Image victoryImage

// Global variables
// True if ball in motion
global.ballInMotion = false;
// True if user has ball
global.userHasBall = true;
// Direction ball is traveling
global.direction = new vec3(0, 0, 0);
// Speed of ball
global.speed = 20;
// Collision distance
global.collisionDistance = 20;
// Amount of times raycast says there is no surface
global.noSurfaceCount = 0;
// Amount of times user has tried to get ball back
global.ballBackCount = 0;
// Threshold until user gets ball back
global.ballBackThreshold = 4;
// Current instructions set
global.instructionNum = 0;
// Current score
global.score = 0;
// Current surfaces hit
global.currentScore = 0;
// Start position 
global.startPosition = new vec3(0, 0, 0)

// Image setting
var currColor = script.instructionsImage.mainPass.baseColor;
script.instructionsImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.gotBallImage.mainPass.baseColor;
script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.noBallImage.mainPass.baseColor;
script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.backAtStartImage.mainPass.baseColor;
script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.beginningSurfaceImage.mainPass.baseColor;
script.beginningSurfaceImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.opponentHitImage.mainPass.baseColor;
script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
var currColor = script.victoryImage.mainPass.baseColor;
script.victoryImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
// Ball starts with user so don't show it
script.sphere.getTransform().setWorldScale(new vec3(0, 0, 0));

// Scale all body spheres to be smaller
script.head.getTransform().setWorldScale(new vec3(0, 0, 0));
script.hips.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftHand.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightHand.getTransform().setWorldScale(new vec3(0, 0, 0));
script.spine.getTransform().setWorldScale(new vec3(0, 0, 0));
script.neck.getTransform().setWorldScale(new vec3(0, 0, 0));
script.spine1.getTransform().setWorldScale(new vec3(0, 0, 0));
script.spine2.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftArm.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightArm.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftForearm.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightForearm.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftLeg.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightLeg.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftUpLeg.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightUpLeg.getTransform().setWorldScale(new vec3(0, 0, 0));
script.leftFoot.getTransform().setWorldScale(new vec3(0, 0, 0));
script.rightFoot.getTransform().setWorldScale(new vec3(0, 0, 0));

// Functions to show different things at different times
function showBackAtStart() {
    var currColor = script.gotBallImage.mainPass.baseColor;
    script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.noBallImage.mainPass.baseColor;
    script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.backAtStartImage.mainPass.baseColor;
    script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
    var currColor = script.opponentHitImage.mainPass.baseColor;
    script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
}
function showGotBall() {
    var currColor = script.gotBallImage.mainPass.baseColor;
    script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
    var currColor = script.noBallImage.mainPass.baseColor;
    script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.backAtStartImage.mainPass.baseColor;
    script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.opponentHitImage.mainPass.baseColor;
    script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
}
function showNoBall() {
    var currColor = script.gotBallImage.mainPass.baseColor;
    script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.noBallImage.mainPass.baseColor;
    script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
    var currColor = script.backAtStartImage.mainPass.baseColor;
    script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.opponentHitImage.mainPass.baseColor;
    script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
}
function showOpponentHit() {
    var currColor = script.gotBallImage.mainPass.baseColor;
    script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.noBallImage.mainPass.baseColor;
    script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.backAtStartImage.mainPass.baseColor;
    script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.opponentHitImage.mainPass.baseColor;
    script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
}
function showVictory() {
    var currColor = script.gotBallImage.mainPass.baseColor;
    script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.noBallImage.mainPass.baseColor;
    script.noBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.backAtStartImage.mainPass.baseColor;
    script.backAtStartImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.opponentHitImage.mainPass.baseColor;
    script.opponentHitImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 0 );
    var currColor = script.victoryImage.mainPass.baseColor;
    script.victoryImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
}


// Function for ball movement and surface collision
function moveBall() {
    if (global.speed == 0) {
        global.ballInMotion = false;
        return;
    }
//    Get start and end position based on camera/tap
    var startPos = script.sphere.getTransform().getWorldPosition();
    var endPos = startPos.add(global.direction);
//    Check if hitting body part
    if (checkBodyCollision()) {
//        Stop tween and stop ball motion
        global.tweenManager.stopTween(script.sphere, "sphere_move");
        global.ballInMotion = false;
        showOpponentHit();
        global.ballBackCount = 0;
        global.score += global.currentScore;
        script.text.text = "Current Score: " + global.score;
        global.currentScore = 0;
        if (global.score >= 10) {
            script.text.text = ""
            showVictory();
            return;
        }
        script.sphere.getTransform().setWorldPosition(global.startPosition);
        return;
    }
//    Get hit on surface world mesh
    var surfaceHit = script.deviceTracking.raycastWorldMesh(startPos, endPos);
    if (surfaceHit.length > 0 && surfaceHit[0].position.distance(startPos) < global.collisionDistance) {
        //        If surface then not going infinitely into the distance
        global.noSurfaceCount = 0;
        //        End Tween if at surface
        global.tweenManager.stopTween(script.sphere, "sphere_move");
        //        Start Tween again with new angle and smaller speed
        global.speed = global.speed - 5;
        //        Edit current surface hit count by 1
        global.currentScore++;
        global.direction = global.direction.reflect(surfaceHit[0].normal);
        //        Interpolate direction to go towards body for ease of game
        if (script.spine1) {
            bodyPos = script.spine1.getTransform().getWorldPosition();
            bodyDirection = bodyPos.sub(script.sphere.getTransform().getWorldPosition());
            global.direction = global.direction.normalize().uniformScale(0.5).add(bodyDirection.normalize().uniformScale(0.5))
        } 
        global.direction = global.direction.normalize().uniformScale(global.speed);
        global.tweenManager.startTween(script.sphere, "sphere_move", moveBall);
        return;
    }
    if (surfaceHit.length == 0) {
//        If going into space indefinitely, stop it
        if (global.noSurfaceCount > 200) {
            global.tweenManager.stopTween(script.sphere, "sphere_move");
            global.ballInMotion = false;
//            Reset ball to starting position
            script.sphere.getTransform().setWorldPosition(global.startPosition);
            showBackAtStart();
            return;
        }
//        Keep track in case it is going infinitely into distance
        global.noSurfaceCount = global.noSurfaceCount + 1;
//        End Tween and set ballThrown to true
        global.tweenManager.setEndValue(script.sphere, "sphere_move", endPos);
        global.tweenManager.startTween(script.sphere, "sphere_move", moveBall);
        return;
    }
//    Move ball with tween
    global.tweenManager.setEndValue(script.sphere, "sphere_move", endPos);
    global.tweenManager.startTween(script.sphere, "sphere_move", moveBall);
}

// Function to execute tap functionality
function onTapped(eventData)
{   
    if (global.score >= 10) {
        showVictory();
        return;
    }
    if (global.instructionNum < 3) {
        if (global.instructionNum == 0) {
            script.titleImage.mainPass.baseColor = new vec4( 0, 0, 0, 0 );
            global.instructionNum++;
            var currColor = script.instructionsImage.mainPass.baseColor;
            script.instructionsImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
        }
        else if (global.instructionNum == 1) {
            script.instructionsImage.mainPass.baseColor = new vec4( 0, 0, 0, 0 );
            global.instructionNum++;
            var currColor = script.beginningSurfaceImage.mainPass.baseColor;
            script.beginningSurfaceImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
        }
        else if (global.instructionNum == 2) {
            script.beginningSurfaceImage.mainPass.baseColor = new vec4( 0, 0, 0, 0 );
            global.instructionNum++;
            var currColor = script.gotBallImage.mainPass.baseColor;
            script.gotBallImage.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, 1 );
            global.startPosition = script.camera.getTransform().getWorldPosition();
        }

        return;
    }
    if (!global.ballInMotion) {
        if (global.userHasBall) {
            global.currentScore = 1;
            showGotBall();
    //        Get screen tap info
            var tapPos = eventData.getTapPosition();          
    //        Use hitTestWorldMesh to get camera direction and direction of ball throw
            global.speed = 20
            global.noSurfaceCount = 0;
            var results = script.deviceTracking.hitTestWorldMesh(tapPos);
            if (results.length > 0) {
                var point = results[0].position;
                var normal = results[0].normal;
                //        Camera position
                var cameraPos = script.camera.getTransform().getWorldPosition();
                script.sphere.getTransform().setWorldPosition(cameraPos);
                global.direction = point.sub(cameraPos).normalize();
                global.direction = global.direction.uniformScale(global.speed);
                global.ballInMotion = true;
                global.userHasBall = false;
                //                Make ball disappear on tap
                script.sphere.getTransform().setWorldScale(new vec3(2, 2, 2));
                moveBall();
                showNoBall();
            }
        }
//        If user does not have ball
        else {
//            Camera and ball position
            var cameraPos = script.camera.getTransform().getWorldPosition();
            var ballPos = script.sphere.getTransform().getWorldPosition();
            if (cameraPos.distance(ballPos) <= 300) {
                script.sphere.getTransform().setWorldPosition(cameraPos);
                global.userHasBall = true;
                showGotBall();
//                Make ball disappear on tap
                script.sphere.getTransform().setWorldScale(new vec3(0, 0, 0));
                global.ballBackCount = 0;
                global.currentScore = 0;
            }
//            If not close to ball when tap and hasn't tapped enough
            else if (global.ballBackCount < global.ballBackThreshold) {
                showNoBall();
                global.ballBackCount += 1;
            }
//            If not close but has tapped enough times
            else {
                showBackAtStart();
                global.ballBackCount = 0;
                script.sphere.getTransform().setWorldPosition(global.startPosition);
            }
        }
    }
    else {
        showNoBall();
    }
}
// Create tap event
var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTapped);

// Function to check if ball is colliding with a person at given moment
function checkBodyCollision() {
    //    Check bounding box of head, forearm, leg
    headPos = script.head.getTransform().getWorldPosition();
    leftForearmPos = script.leftForearm.getTransform().getWorldPosition();
    rightForearmPos = script.rightForearm.getTransform().getWorldPosition();
    leftLegPos = script.leftLeg.getTransform().getWorldPosition();
    rightLegPos = script.rightLeg.getTransform().getWorldPosition();
//    Bounding Box values
    maxX = Math.max(headPos.x, leftForearmPos.x, rightForearmPos.x, leftLegPos.x, rightLegPos.x) + global.collisionDistance * 0.5;
    minX = Math.min(headPos.x, leftForearmPos.x, rightForearmPos.x, leftLegPos.x, rightLegPos.x) - global.collisionDistance * 0.5;
    maxY = Math.max(headPos.y, leftForearmPos.y, rightForearmPos.y, leftLegPos.y, rightLegPos.y) + global.collisionDistance * 0.5;
    minY = Math.min(headPos.y, leftForearmPos.y, rightForearmPos.y, leftLegPos.y, rightLegPos.y) - global.collisionDistance * 0.5;
    maxZ = Math.max(headPos.z, leftForearmPos.z, rightForearmPos.z, leftLegPos.z, rightLegPos.z) + global.collisionDistance * 0.5;
    minZ = Math.min(headPos.z, leftForearmPos.z, rightForearmPos.z, leftLegPos.z, rightLegPos.z) - global.collisionDistance * 0.5;
//    Check if ball colliding
    ballPos = script.sphere.getTransform().getWorldPosition();
//    global.textLogger.clear();
//    global.logToScreen(ballPos);
//    global.logToScreen("X: " + minX + " - " + maxX)
//    global.logToScreen("Y: " + minY + " - " + maxY)
//    global.logToScreen("Z: " + minZ + " - " + maxZ)
    if (ballPos.x < minX || ballPos.x > maxX) return false;
    if (ballPos.y < minY || ballPos.y > maxY) return false;
    if (ballPos.z < minZ || ballPos.z > maxZ) return false;
    return true;
//    Check each body part separately
//    if (checkHeadCollision()) {
//        return true;
//    }
//    else if (checkLeftArmCollision()) {
//        return true;
//    }
//    else if (checkRightArmCollision()) {
//        return true;
//    }
//    else if (checkChestCollision()) {
//        return true;
//    }
//    else if (checkLeftLegCollision()) {
//        return true;
//    }
//    else if (checkRightLegCollision()) {
//        return true;
//    }
//    return false;
}

//// Helper functions for each individual body part
//// Head Collision
//function checkHeadCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    headPos = script.head.getTransform().getWorldPosition();
//    if (headPos.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    return false;
//}
//// Arm collisions
//function checkLeftArmCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    arm = script.leftArm.getTransform().getWorldPosition();
//    hand = script.leftHand.getTransform().getWorldPosition();
//    forearm = script.leftForearm.getTransform().getWorldPosition();
////    Get vectors of forearm and other half of arm
//    forearmVec = forearm.sub(hand)
//    backarmVec = arm.sub(forearm)
////    Get vectors of ball to forearm and backarm
//    ballForearm = ballPos.sub(hand)
//    ballBackarm = ballPos.sub(forearm)
////    Calculate projections onto forearm and backarm
//    forearmClosest = forearmVec.uniformScale(ballForearm.mult(forearmVec) / forearmVec.lengthSquared) 
//    backarmClosest = backarmVec.uniformScale(ballBackarm.mult(backarmVec) / backarmVec.lengthSquared)
////    Check distance to this linear approximation
////    If forearmClosest in line segment and close to ball, consider this a collision
//    if (forearmClosest.distance(hand) < forearmVec.length && forearmClosest.distance(forearm) < forearmVec.length) {
//        if (forearmClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }        
//    }
////    If backarmClosest in line segment and close to ball, consider this a collision
//    else if (backarmClosest.distance(forearm) < backarmVec.length && backarmClosest.distance(arm) < backarmVec.length) {
//        if (backarmClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }
//    }
////    Otherwise no left arm collision
//    return false;
//}
//function checkRightArmCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    arm = script.rightArm.getTransform().getWorldPosition();
//    hand = script.rightHand.getTransform().getWorldPosition();
//    forearm = script.rightForearm.getTransform().getWorldPosition();
////    Get vectors of forearm and other half of arm
//    forearmVec = forearm.sub(hand)
//    backarmVec = arm.sub(forearm)
////    Get vectors of ball to forearm and backarm
//    ballForearm = ballPos.sub(hand)
//    ballBackarm = ballPos.sub(forearm)
////    Calculate projections onto forearm and backarm
//    forearmClosest = forearmVec.uniformScale(ballForearm.mult(forearmVec) / forearmVec.lengthSquared) 
//    backarmClosest = backarmVec.uniformScale(ballBackarm.mult(backarmVec) / backarmVec.lengthSquared)
////    Check distance to this linear approximation
////    If forearmClosest in line segment and close to ball, consider this a collision
//    if (forearmClosest.distance(hand) < forearmVec.length && forearmClosest.distance(forearm) < forearmVec.length) {
//        if (forearmClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }        
//    }
////    If backarmClosest in line segment and close to ball, consider this a collision
//    else if (backarmClosest.distance(forearm) < backarmVec.length && backarmClosest.distance(arm) < backarmVec.length) {
//        if (backarmClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }
//    }
////    Otherwise no right arm collision
//    return false;
//}
//// Chest Collision
//function checkChestCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    neckPos = script.head.getTransform().getWorldPosition();
//    spinePos2 = script.spine2.getTransform().getWorldPosition();
//    spinePos1 = script.spine1.getTransform().getWorldPosition();
//    spinePos = script.spine.getTransform().getWorldPosition();
//    hipsPos = script.spine.getTransform().getWorldPosition();
//    if (neckPos.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    if (spinePos2.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    if (spinePos1.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    if (spinePos.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    if (hipsPos.distance(ballPos) < global.collisionDistance * 1.5) {
//        return true;
//    }
//    return false;
//}
//// Leg collisions
//function checkLeftLegCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    upLeg = script.leftUpLeg.getTransform().getWorldPosition();
//    foot = script.leftFoot.getTransform().getWorldPosition();
//    knee = script.leftLeg.getTransform().getWorldPosition();
////    Get vectors of upper leg and bottom half of leg
//    upLegVec = upLeg.sub(knee)
//    bottomLegVec = knee.sub(foot)
////    Get vectors of ball to upLeg and bottomLeg
//    ballUpLeg = ballPos.sub(upLeg)
//    ballBottomLeg = ballPos.sub(foot)
////    Calculate projections onto upper leg and lower leg
//    ballUpLegClosest = upLegVec.uniformScale(ballUpLeg.mult(upLegVec) / upLegVec.lengthSquared) 
//    ballBottomLegClosest = bottomLegVec.uniformScale(ballBottomLeg.mult(bottomLegVec) / bottomLegVec.lengthSquared)
////    Check distance to this linear approximation
////    If ballUpLegClosest in line segment and close to ball, consider this a collision
//    if (ballUpLegClosest.distance(upLeg) < upLegVec.length && ballUpLegClosest.distance(knee) < upLegVec.length) {
//        if (ballUpLegClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }        
//    }
////    If ballBottomLegClosest in line segment and close to ball, consider this a collision
//    else if (ballBottomLegClosest.distance(knee) < bottomLegVec.length && ballBottomLegClosest.distance(foot) < bottomLegVec.length) {
//        if (ballBottomLegClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }
//    }
////    Otherwise no left leg collision
//    return false;
//}
//function checkRightLegCollision() {
//    ballPos = script.sphere.getTransform().getWorldPosition();
//    upLeg = script.rightUpLeg.getTransform().getWorldPosition();
//    foot = script.rightFoot.getTransform().getWorldPosition();
//    knee = script.rightLeg.getTransform().getWorldPosition();
////    Get vectors of upper leg and bottom half of leg
//    upLegVec = upLeg.sub(knee)
//    bottomLegVec = knee.sub(foot)
////    Get vectors of ball to upLeg and bottomLeg
//    ballUpLeg = ballPos.sub(upLeg)
//    ballBottomLeg = ballPos.sub(foot)
////    Calculate projections onto upper leg and lower leg
//    ballUpLegClosest = upLegVec.uniformScale(ballUpLeg.mult(upLegVec) / upLegVec.lengthSquared) 
//    ballBottomLegClosest = bottomLegVec.uniformScale(ballBottomLeg.mult(bottomLegVec) / bottomLegVec.lengthSquared)
////    Check distance to this linear approximation
////    If ballUpLegClosest in line segment and close to ball, consider this a collision
//    if (ballUpLegClosest.distance(upLeg) < upLegVec.length && ballUpLegClosest.distance(knee) < upLegVec.length) {
//        if (ballUpLegClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }        
//    }
////    If ballBottomLegClosest in line segment and close to ball, consider this a collision
//    else if (ballBottomLegClosest.distance(knee) < bottomLegVec.length && ballBottomLegClosest.distance(foot) < bottomLegVec.length) {
//        if (ballBottomLegClosest.distance(ballPos) < global.collisionDistance * 1.5) {
//            return true;
//        }
//    }
////    Otherwise no left leg collision
//    return false;
//}