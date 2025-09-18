/**
 * FrogFrogFrog
 * Pippin Barr
 * 
 * Game about catching flies as a frog.
 * 
 * The frog is at the bottom centre and you shoot its tongue to a 
 * specific destination with a click/touch. If it hits the fly
 * the fly gets eaten and on you go forever.
 * 
 * There are no consequences for anything yet which is kind of chill
 * but probably should change.
 */

"use strict";

const frog = {
    // Is the frog being moved right now?
    dragging: false,
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
        speed: 0.05,
        // What is the tongue currently doing
        // idle; outbound; inbound
        state: "idle",
        // Starting point we will be lerping from...
        start: {
            x: undefined,
            y: undefined
        },
        // Target
        target: {
            x: undefined,
            y: undefined
        }
    }
};

const fly = {
    // Position (will be defined in setup)
    x: undefined,
    y: undefined,
    // Size is the diameter of the circle
    size: 15,
    // Times for the perlin noise to allow us to get some organic
    // movement for the fly on the screen
    // Will be set by resetFly() in setup()
    tx: undefined,
    ty: undefined,
    // How erratically the fly moves (this will be used to change the time variables
    // for the Perlin noise). The bigger the number there more random-looking
    // the movement
    buzziness: 0.02,
    // Flapping wings
    wingMaxSize: 15, // How long is a wing at most
    wingAngle: 0, // Use in sine function to vary the wing size over time
    wingSpeed: 1.2,
    // Was it caught this time?
    caught: false
};

// A place to store our sound effects
const sounds = {
    buzzing: undefined,
    atmosphere: undefined,
    slurp: undefined,
    swallow: undefined,
};

// This variable will hold the appropriate action verb based on whether
// the user is using touch or not (in though)
let actionVerb = "click"; // Can be "click" or "touch"

// Current state (so we can have a title at least for now)
let state = "title"; // Can be: "title" or "simulation"

/**
 * Load our sounds
 */
function preload() {
    // MP3s for the longer two
    sounds.atmosphere = loadSound("assets/sounds/pond.mp3");
    sounds.buzzing = loadSound("assets/sounds/fly.mp3");
    // WAVs for the shorter two
    sounds.slurp = loadSound("assets/sounds/slurp.wav");
    sounds.swallow = loadSound("assets/sounds/swallow.wav");
}

/**
 * Create a canvas to draw on
*/
function setup() {
    // Create a 480x640 canvas (trying for portrait for mobile)
    createCanvas(480, 640);

    // Reset the frog to defaults
    resetFrog();

    // Reset the fly to its starting point
    resetFly();

    // Determine the action verb
    // Found this idea here: https://gist.github.com/esedic/39a16a7521d42ae205203e3d40dc19f5
    // But it's pretty common
    // Basically you're checking if the window (the browser) "knows about"
    // checking for touches, if it does, then it's at least pretty likely
    // that touch is available
    if ('ontouchstart' in window) {
        actionVerb = "touch";
    }

    // Play atmosphere (won't start until there's user input though)
    sounds.atmosphere.loop();
    sounds.buzzing.loop();
}

/**
 * Draw the title or simulation state
*/
function draw() {
    if (state === "title") {
        title();
    }
    else if (state === "simulation") {
        simulation();
    }
}

/**
 * Displays the title
 */
function title() {
    // A green
    background(100, 240, 80);

    // The title
    push();
    textSize(64);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(40, 80, 30);
    text("frogfrogfrog", width / 2, height / 2);
    pop();

    // The instruction to click to begin
    push();
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(40, 80, 30);
    text(`- ${actionVerb} to begin -`, width / 2, 3 * height / 4);
    pop();
}

/**
 * Runs the simulation (I'm refusing to call it a game, because it's
 * just so realistic)
 */
function simulation() {
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
 * Move the frog based on the mouse's/finger's x position
 */
function updateFrog() {

    switch (frog.tongue.state) {
        // If the tongue is idle it just follows the frog
        case "idle":
            frog.tongue.x = frog.x;
            frog.tongue.y = frog.y;
            break;

        // If the tongue is outbound it needs to move toward its target
        // and come back it it reaches it
        case "outbound":
            // Movement
            moveTongue();

            // Check if it hit the destination and head back
            if (frog.tongue.progress >= 1) {
                retractTongue();
            }
            break;

        // If the tongue in in bound it needs to move toward the
        // frog's body as a target
        case "inbound":
            // Update the target to the current frog position
            // So that it lerps to the correct location given that the
            // frog can move around
            frog.tongue.target.x = frog.x;
            frog.tongue.target.y = frog.y;
            // Move the tongue
            moveTongue();

            // Check if it returned to the frog and stop if so
            if (frog.tongue.progress >= 1) {
                resetTongue();
                // If there was a fly caught, then swallow
                if (fly.caught) {
                    fly.caught = false;
                    sounds.swallow.play();
                }
            }
            break;
    }
}

/**
 * Move the tongue position by interpolating between it's starting and target
 * positions.
 */
function moveTongue() {
    frog.tongue.progress += frog.tongue.speed;
    frog.tongue.x = lerp(frog.tongue.start.x, frog.tongue.target.x, frog.tongue.progress);
    frog.tongue.y = lerp(frog.tongue.start.y, frog.tongue.target.y, frog.tongue.progress);
}

/**
 * Set things up to retract the tongue back into the mouth
 */
function retractTongue() {
    // Don't retract the tongue if it's already coming back!
    if (frog.tongue.state === "inbound") {
        return;
    }

    // This is what it takes to send the tongue back these days!
    // Change the state
    frog.tongue.state = "inbound";
    // Set its starting point to where it just reached
    // Actually I wonder if this is the cleanest approach, seems weird
    frog.tongue.start.x = frog.tongue.target.x;
    frog.tongue.start.y = frog.tongue.target.y;
    // We're going back to target wherever the frog is
    frog.tongue.target.x = frog.x;
    frog.tongue.target.y = frog.y;
    // And we haven't made any progress yet because we just started
    frog.tongue.progress = 0;
}

/**
 * Set the tongue back to sweet nothing (in the frog's mouth)
 */
function resetTongue() {
    // Make tongue idle
    frog.tongue.state = "idle";
    // Reset progress
    frog.tongue.progress = 0;
    // And position it exactly on the frog
    frog.tongue.x = frog.x;
    frog.tongue.y = frog.y;
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
        // Set the fly as caught
        fly.caught = true;
        // Reset the fly (as if a new one comes in)
        resetFly();
        // Send the tongue back to the frog
        retractTongue();
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
    // Translate the "pen" to the location of the eye
    translate(x, y);
    // Rotate by the correct angle
    rotate(-eyeAngle);
    // And then draw the eye there
    noStroke();
    fill(255); // White of the eyes
    ellipse(0, 0, frog.size / 4);
    fill(0); // Pupil is offset from the centre by a bit
    ellipse(0, -frog.size / 15, frog.size / 8); // Yeah those hardcoded numbers are bad
    pop();
    // I should really do a better job on the numbers here though, ugly stuff
}

/**
 * Reset the frog to its default position and tongue state
 */
function resetFrog() {
    // Position the frog in the bottom center
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
    // Update the fly's time variable (to cause noise() to return the
    // next organically related value
    fly.tx += fly.buzziness;
    fly.ty += fly.buzziness;
    // Update the fly's position by adding its speed to its position
    fly.x = map(noise(fly.tx), 0, 1, 0, width);
    fly.y = map(noise(fly.ty), 0, 1, 0, height);

    // Note the fly never leaves the screen because the map() function is 
    // forcing its x and y to be on the canvas

    // Increase the angle used to control the fly's wings
    fly.wingAngle += fly.wingSpeed;
}

/**
 * Moves the fly back to its starting point at a random height
 * A function so 
 */
function resetFly() {
    // Set random time values to move the fly somewhere
    fly.tx = random(0, 100);
    fly.ty = random(0, 100);
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
    // Width is slightly elongated to make it more... fly-ish
    ellipse(fly.x, fly.y, fly.size * 1.5, fly.size);
    pop();
}

/**
 * On click, send the tongue out if it's not already
 * Towards the location of the click/touch
 */
function mousePressed() {
    // Handle audio
    userStartAudio();

    // Handle the different states
    if (state === "title") {
        state = "simulation";
    }
    else if (state === "simulation") {
        // Check if the tongue is idle (otherwise it can't shoot out)
        if (frog.tongue.state === "idle") {
            // Sound
            sounds.slurp.play();
            // Set the tongue's starting position (in the frog)
            frog.tongue.start.x = frog.x;
            frog.tongue.start.y = frog.y;
            // Set the tongue's target position (we will lerp to it I guess?)
            frog.tongue.target.x = mouseX;
            frog.tongue.target.y = mouseY;
            // Set the tongue's progress (nothin)
            frog.tongue.progress = 0;
            // Launch
            frog.tongue.state = "outbound";
        }
    }
}

/**
 * Nothing for now
 */
function mouseReleased() {
    // frog.dragging = false;
}


/**
 * Below are things that are not part of the program right now.
 * I technically should delete them but I'm keeping them around
 * superstitiously in case I want to refer to them later.
 */


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