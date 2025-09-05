/**
 * FrogFrogFrog
 * Pippin Barr
 * 
 * In progress game about catching flies as a frog.
 */

"use strict";

const frog = {
    // Will set position in setup based on canvas size
    x: undefined,
    y: undefined,
    // Size is the diameter of the circle
    size: 140,
    // The frog's tongue has it's own position and size...
    tongue: {
        // Position of the tip of the tongue
        x: undefined,
        y: undefined,
        // Size of the tip of the tongue (and the line joining it to the frog)
        size: 20,
        // How fast the tongue moves (out or in)
        speed: 15,
        // What is the tongue currently doing
        // idle; outbound; inbound
        state: "idle"
    }
};

const fly = {
    // Position (will be defined in setup)
    x: undefined,
    y: undefined,
    // Size is the diameter of the circle
    size: 15,
    // Speed the fly moves left to right
    speed: 5,
    // Flapping wings
    wingMaxSize: 15, // How long is a wing at most
    wingAngle: 0, // Use in sine function to vary the wing size over time
    wingSpeed: 1.2
};

/**
 * Create a canvas to draw on
*/
function setup() {
    // Create a 640x480 canvas
    createCanvas(640, 480);

    // Reset the frog to defaults
    resetFrog();

    // Reset the fly to its starting point
    resetFly();
}

/**
 * Draw the frog where the mouse is and draw a fly
*/
function draw() {
    drawBackground();
    updateFrog();
    updateFly();
    checkCatch();
    displayFly();
    displayFrog();
    // Leaving this out for now, I don't like the effect enough
    // until it proves itself further.
    // displayLightMask();
}

/**
 * Draws the background. For now it's just blue, but it would be
 * nice if it has, like, clouds and moving water or something.
 */
function drawBackground() {
    // Fill the background blue
    background(110, 150, 250);
}

/**
 * Move the frog based on the mouse's x position
 */
function updateFrog() {
    // Update the frog's position to the mouse's x
    frog.x = mouseX;

    // Update the tongue's x position to the frog's
    frog.tongue.x = frog.x;

    switch (frog.tongue.state) {
        case "idle":
            break;
        case "outbound":
            // Subtract the speed so it goes up
            frog.tongue.y = frog.tongue.y - frog.tongue.speed;
            // Check if it hit the top and "bounce" if so
            if (frog.tongue.y <= 0) {
                frog.tongue.state = "inbound";
            }
            break;
        case "inbound":
            // Add the speed so it goes down
            frog.tongue.y = frog.tongue.y + frog.tongue.speed;
            // Check if it returned to the frog and stop if so
            if (frog.tongue.state === "inbound" && frog.tongue.y >= frog.y) {
                // Make tongue idle
                frog.tongue.state = "idle";
                // And position it exactly on the frog
                frog.tongue.y = frog.y;
            }
            break;
    }
}

/**
 * Checks if the tongue touches the fly and handles that
 */
function checkCatch() {
    // Check if the tongue tip overlaps the fly
    // Get the distance between the tongue tip and frog
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if there's an overlap
    if (d <= frog.tongue.size / 2 + fly.size / 2) {
        // Reset the fly (as if a new one comes in)
        resetFly();
        // Send the tongue back to the frog
        frog.tongue.state = "inbound";
    }
}

/**
 * Draw the frog on the canvas
 * A frog is a green circle with a tongue and eyes
 */
function displayFrog() {
    // Draw the tongue first, since it should
    // go behind the frog....
    push();
    // Tongue tip first
    fill(250, 140, 120);
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    // Tongue line second
    stroke(250, 140, 120);
    strokeWeight(frog.tongue.size);
    line(frog.x, frog.y, frog.tongue.x, frog.tongue.y);
    pop();

    // Draw the frog at its position
    // Just a green circle for now
    push();
    fill(110, 250, 140);
    noStroke();
    ellipse(frog.x, frog.y, frog.size);
    pop();

    // Eyes
    drawFrogEye(frog.x - frog.size / 3, frog.y - frog.size / 3);
    drawFrogEye(frog.x + frog.size / 3, frog.y - frog.size / 3);
}

/**
 * Draws a frog's eye at the specified position. The eye will follow the fly.
 * 
 * @param {float} x x-position of the eye
 * @param {float} y y-position of the eye
 */
function drawFrogEye(x, y) {
    // Calculate the angle to rotate the eye based on where the fly is
    // Uses trigonometry! I knew that would come in handy one day!
    const eyeAngle = atan((x - fly.x) / (y - fly.y))

    push();
    translate(x, y);
    rotate(-eyeAngle);
    noStroke();
    fill(255); // White of the eyes
    ellipse(0, 0, frog.size / 4);
    fill(0); // Pupil
    ellipse(0, -frog.size / 15, frog.size / 8);
    pop();
    // I should really do a better job on the numbers here though, ugly stuff
}

/**
 * Reset the frog to its default position and tongue state
 */
function resetFrog() {
    // Position the frog in the bottom center
    // We will set its x based on the mouse every frame
    frog.x = width / 2;
    frog.y = height;
    // Position the tongue relative to the frog
    frog.tongue.x = frog.x;
    frog.tongue.y = frog.y;
    // Reset the state back to in the mouth
    frog.tongue.state = "idle";
}

/**
 * Move the fly linearly across the canvas, left to right
 */
function updateFly() {
    // Update the fly's position by adding its speed to its position
    fly.x = fly.x + fly.speed;

    // Make the fly return to the left when it reaches the right side
    // and reset its y to be random (but higher than the frog obviously)
    if (fly.x >= width) {
        resetFly();
    }

    // Increase the angle used to control the fly's wings
    fly.wingAngle += fly.wingSpeed;
}

/**
 * Moves the fly back to its starting point at a random height
 * A function so 
 */
function resetFly() {
    // Back to the left
    fly.x = 0;
    // Random in the top half of the canvas
    fly.y = random(0, height / 2);
}

/**
 * Draw the fly on the canvas
 */
function displayFly() {
    // Calculate the size of the wings based on the wing angle using sine
    // map it to a number between 0 and max size
    const wingSize = map(sin(fly.wingAngle), -1, 1, 0, fly.wingMaxSize);

    // Wings
    push();
    stroke(0);
    fill(255);
    ellipse(fly.x, fly.y - fly.size / 2, fly.size / 1.5, wingSize);
    ellipse(fly.x, fly.y + fly.size / 2, fly.size / 1.5, wingSize);
    pop();

    // Body is a black circle
    push();
    fill(0, 0, 0);
    noStroke();
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Covers the canvas in black and masks out a "light" 
 * on the frog's tongue. Kind of stupid.
 */
function displayLightMask() {
    push();
    // This is how you clip with a mask apparently
    // It calls a function to define the shape of the mask
    // And in this case I'm inverting it so that I want
    // the *inverse* of the circle to be black
    clip(lightMask, { invert: true });
    fill(0, 200);
    rect(0, 0, width, height);
    pop()
}

/**
 * Defines the mask (an ellipse centered on the frog's tongue)
 */
function lightMask() {
    ellipse(frog.tongue.x, frog.tongue.y, 250, 250);
}

/**
 * On click, send the tongue out if it's not already
 */
function mousePressed() {
    // Check if the tongue is idle (in the mouth)
    if (frog.tongue.state === "idle") {
        // If so, launch it by changing its state
        frog.tongue.state = "outbound";
    }
}