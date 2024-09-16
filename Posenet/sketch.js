let capture;
let posenet;
let singlePose, skeleton;
let specs, smoke;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent('video-container'); // Place the canvas inside the video-container div
    
    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);

    specs = loadImage('images/spects.png');
    smoke = loadImage('images/cigar.png');
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('Model has loaded');
}

function draw() {
    image(capture, 0, 0);

    if (singlePose) {
        // Draw keypoints
        for (let i = 0; i < singlePose.keypoints.length; i++) {
            fill(255, 0, 0);
            ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 10);
        }

        // Draw skeleton
        stroke(255, 255, 255);
        strokeWeight(5);
        for (let j = 0; j < skeleton.length; j++) {
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);
        }

        // Calculate specs position and size
        let leftEye = singlePose.leftEye;
        let rightEye = singlePose.rightEye;
        let nose = singlePose.nose;

        let eyeDistance = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
        let specsWidth = eyeDistance * 3.5;
        let specsHeight = (specs.height / specs.width) * specsWidth;

        // Calculate rotation angle based on the eyes
        let angle = atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

        // Draw specs with rotation
        push();
        translate(nose.x, nose.y);
        rotate(angle);
        imageMode(CENTER);
        image(specs, 0, 0, specsWidth, specsHeight);  // Center the specs
        pop();

        // Calculate cigar position and size
        let cigarWidth = eyeDistance;
        let cigarHeight = (smoke.height / smoke.width) * cigarWidth;

        // Draw cigar with rotation
        push();
        translate(nose.x-eyeDistance*0.5, nose.y + eyeDistance);  // Adjust vertical position for cigar
        rotate(angle-90);
        imageMode(CENTER);
        image(smoke, 0, 0, cigarWidth, cigarHeight);
        pop();
    }
}
