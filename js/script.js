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
    size: 140
};

const fly = {
    // Position (this will need to change for the fly to move)
    x: 0,
    y: 200,
    // Size is the diameter of the circle
    size: 15,
    // Speed the fly moves left to right
    speed: 5
};

/**
 * Create a canvas to draw on
*/
function setup() {
    // Create a 640x480 canvas
    createCanvas(640, 480);

    // Position the frog in the bottom center
    // We will set its x based on the mouse every frame
    frog.x = width / 2;
    frog.y = height;
}

/**
 * Draw the frog where the mouse is and draw a fly
*/
function draw() {
    drawBackground();
    updateFrog();
    updateFly();
    displayFly();
    displayFrog();
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
}

/**
 * Draw the frog on the canvas
 */
function displayFrog() {
    // Draw the frog at its position
    // Just a green circle for now
    push();
    fill(110, 250, 140);
    noStroke();
    ellipse(frog.x, frog.y, frog.size);
    pop();
}

/**
 * Move the fly linearly across the canvas, left to right
 */
function updateFly() {
    // Update the fly's position by adding its speed to its position
    fly.x = fly.x + fly.speed;

    // Make the fly return to the left when it reaches the right side
    if (fly.x >= width) {
        fly.x = 0;
    }
}

/**
 * Draw the fly on the canvas
 */
function displayFly() {
    // Draw the fly somewhere just to see it for now
    // Just a black circle
    push();
    fill(0, 0, 0);
    noStroke();
    ellipse(fly.x, fly.y, fly.size);
    pop();
}