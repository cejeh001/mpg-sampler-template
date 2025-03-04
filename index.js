/*
Copyright © 2022 Jamie Forth

Modified version of code written by Simon Katan.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// GUI variables.
let logoFont;
const buttons = [];
const sliders = [];

// Sound variables.
let bpm = 120;
const minBpm = 30;
const maxBpm = 200;
const beatsPerBar = 4;
const numSteps = 16;

// Audio context variables.
let audioStarting = false;
let audioInitialised = false;

// Step sequencer variables.
let clock;
let playhead = -1;

// Global effects.

// Main output volume control.

// Track variables.
let click;
let beep;

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// Load images and fonts here.
function preload() {
    logoFont = loadFont('assets/spaceage.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight - 4);

    // Create the GUI controls.
    // Create buttons
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            buttons.push(new Button(
                300 + x * 120,  // x position
                200 + y * 120,  // y position
                100)            // button size
            )
        }
    }

    // Create sliders
    for (let i = 0; i < 3; i++) {
        sliders.push(new VSlider(60 + i * 60, 250, 30, 200));
    }

    // Set slider default values and callback functions.
    sliders[0].value = 1;
    sliders[0].onSlide = setMainVolume;


    // Step sequencer tracks.
    beep = new StepSeqTrack(
        'click',
        [
            0,0,0,0,
            1,1,1,0,
            0,0,0,0,
            1,0,1,1,
        ],
        buttons[1]
    );

    // Each track contains a pattern array, which by default contains 16 values
    // between 0 and 1. These values are used to create different rhythmic
    // patterns. Each value or 'step' represents 1/16th of a bar
    // (i.e. semiquavers). Four steps makes one beat. The default number of
    // steps is set by the `numSteps` global variable.
    click = new StepSeqTrack(
        'click',
        [
            1, 0, 1, 0,         // Beat 1
            0, 1, 0, 1,         // Beat 2
            1, 0, 1, 1,         // Beat 3
            0, 1, 0, 1          // Beat 4
        ],
        buttons[0]
    );

}

async function startAudio() {
    // Start initialisation.
    audioStarting = true;
    console.log('Audio starting');

    // We can only initialise the audio context in response to a user
    // event (e.g. mouse or key press).
    await Tone.start()
    console.log('Audio has started.');

    // Create our own sequencer.

    // We will use this clock, which runs in the audio thread, as a
    // very accurate metronome. It will call the `playNextStep()`
    // function at regular intervals (specified in Hz) passing the
    // argument `time`, which is the precise time that can be used for
    // sample accurate scheduling.
    clock = new Tone.Clock(playNextStep, (bpm / 60) * beatsPerBar);
    clock.start();


    // Create audio sample players and load audio samples.
    click.player = new Tone.Player('assets/click.mp3');
    click.player.toDestination();

    beep.player = new Tone.Player('assets/beep.mp3');
    beep.player.toDestination();


    // Wait until all samples are loaded.
    await Tone.loaded();
    console.log('All samples loaded');

    // Update audio context variables.
    audioInitialised = true;
    audioStarting = false;
}

function playNextStep(time) {
    // Move the playhead to the next position.
    playhead++;
    if (playhead >= numSteps) {
        // Set playhead back to zero to create a cycle of `numSteps`.
        playhead = 0;
    }

    // Trigger sounds.

    if (click.isPlaying) {
        if (click.pattern[playhead] > 0) {
            // Trigger sound at precise time.
            click.player.start(time);
        }
    }

    if (beep.isPlaying) {
        if (beep.pattern[playhead] > 0) {
            // Trigger sound at precise time.
            beep.player.start(time);
        }

    }
}

function ampToDb(amp, dBRange=-30) {
    // Map amplitude values between 0 and 1 to volume in decibels
    // between 0 and dBRange.
    if (dBRange >= 0) {
        console.error('dBRange should be negative!');
    }
    return map(amp, 0, 1, dBRange, 0);
}

// draw playhead
function drawPlayhead() {
    // Calculate the x position of the playhead based on the current step.
    let playheadX = map(playhead, 0, numSteps, 100, width - 100);

    // Draw a line to represent the playhead.
    stroke(255);
    strokeWeight(2);
    line(playheadX, 100, playheadX, height - 100);
}


// -----------------------------------------------------------------------------
// Draw
// -----------------------------------------------------------------------------

function draw() {
    background(0);

    if (!audioInitialised) {
        push();
        textAlign(CENTER);
        textFont('Arial');
        stroke(0);
        fill(255);
        textSize(32);
        text('Press any key to begin', width / 2, height / 2);
        pop();

        return;
    }

    textAlign(LEFT);
    stroke(0);
    fill('#ED225D');
    textFont(logoFont);
    textSize(70);
    text('MPG', 10, 80);

    // Visualise playback position.
    drawPlayhead();

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].draw();
    }
}

// -----------------------------------------------------------------------------
// Slider callback functions
// -----------------------------------------------------------------------------

function setMainVolume() {
    console.log(sliders[0].value);
}



// -----------------------------------------------------------------------------
// UI events
// -----------------------------------------------------------------------------

// Key events

function keyPressed() {
    if (!(audioInitialised || audioStarting)) {
        startAudio();
    }
}

// Mouse events

function mousePressed() {
    if (!audioInitialised) {
        // Disable mouse controls until audio samples are loaded.
        return;
    }

    // Work out if a button has been pressed.
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].isInside(mouseX, mouseY)) {
            buttons[i].press();
            break;
        }
    }
}

function mouseDragged() {
    if (!audioInitialised) {
        // Disable mouse controls until audio samples are loaded.
        return;
    }

    // Work out if a slider has been moved.
    for (let i = 0; i < sliders.length; i++) {
        if (sliders[i].isInside(mouseX, mouseY)) {
            sliders[i].slide(mouseY);
            break;
        }
    }
}
