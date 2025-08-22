/**
 * FrogFrogFrog
 * Pippin Barr
 * 
 * In progress game about catching flies as a frog.
 */

"use strict";

/**
 * Create a canvas to draw on
*/
function setup() {
    // Create a 640x480 canvas
    createCanvas(640, 480);
}

/**
 * Draw the frog where the mouse is and draw a fly
*/
function draw() {
    // Fill the background blue
    background(110, 150, 250);

    // Draw the fly somewhere just to see it for now
    push();
    fill(0, 0, 0);
    noStroke();
    ellipse(200, 200, 15, 15);
    pop();

    // Draw the frog at the mouse position
    // (I'll need to make a frog variable for this in a sec)
    push();
    fill(110, 250, 140);
    noStroke();
    ellipse(mouseX, mouseY, 140, 140);
    pop();
}