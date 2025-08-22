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
    // Fill the background blue
    background(110, 150, 250);

    // Update the frog's position to the mouse's x
    frog.x = mouseX;

    // Draw the fly somewhere just to see it for now
    push();
    fill(0, 0, 0);
    noStroke();
    ellipse(fly.x, fly.y, fly.size);
    pop();

    // Draw the frog at its position
    push();
    fill(110, 250, 140);
    noStroke();
    ellipse(frog.x, frog.y, frog.size);
    pop();
}