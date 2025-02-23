### MPG Sampler

- Type of assessment: Summative programming assignment
- You choose the **BEST THREE ASSIGNMENTS** to hand-in for grading.
- Learning outcomes assessed: All
- Weighting: 20%
- Need to pass this assessment to pass module: No

#### Overview

The MPG is Goldsmiths’ very own cheap rip off version of the popular
Akai MPC sampler. If you don’t know what an MPC is then watch
[this](https://www.youtube.com/watch?v=QoVOiT5Qs0c) (Ignore the
chocolate bit!)

Currently the MPG is a bare template implemented as a p5.js
sketch. Look at the `index.html` file to see what files are
loaded. The main sketch file is called `index.js`. Look at the files
in the `./classes` folder to see what other classes are used by this
programme.

Apply the things you have learned so far in this module to turn this
code into an awesome step-sequencer app.

#### Tasks

1. Controlling click. [1 mark]
   - Run the code and try it out.
   - When you press the button at the top left of the grid, you should
     hear a very fast repeating sound.
   - The pattern for this sound is stored in a `StepSeqTrack` object
     assigned to the variable `click`.
   - Find the class definition for `StepSeqTrack` and look at the
     constructor parameters and what properties are available.
   - Find where `click` is initialised in `index.js` and replace some
     of the 1s with 0s in the pattern array so that the click sound
     plays once every beat (i.e. once every 4 steps).
   - Experiment with other patterns and find one that you like.

2. Add a display counter visualisation. [2 mark]
   - The UI could be improved by visualising the `playhead` position.
   - The sequencer is driven by a high accuracy audio-rate clock,
     initialised in `startAudio()`. Find where this is initialised in
     `index.js`.
   - This clock calls `playNextStep()` at regular intervals based on
     the global beats-per-minute variable.
   - Find the definition of `playNextStep()`. Can you see how
     `playhead` is used to step through the step-sequencer pattern
     values each time it is called?
   - Visualise `playhead` by drawing to the canvas.
   - Hint: A simple option could be use `text()` to draw the
     `playhead` number somewhere on the canvas. A more exciting
     solution could involve visualising the `playhead` position using
     shapes and colour to create an effective animation.

3. Add the beep sound [2 marks]
   - Based on the code that initialises the variable `click`, create a
     new global variable called `beep` and initialise it in `setup()`
     as a new `StepSeqTrack` object.
   - You will want to give this track a new name and new
     pattern. Connect this track to the second button by passing
     `buttons[1]` as the third parameter of the constructor.
   - Next we need to create a new `Tone.Player()` object to play back
     the beep sound. Find where `click.player` is assigned in
     `startAudio()`. Note we are assigning the new player object to a
     property of our `click` object. Copy and modify this code to
     create a `beep.player` object that loads the sample
     `assets/beep.mp3`.
   - Connect `beep.player` to your speakers and test you can trigger
     the sound manually in the console with: `beep.player.start()`.
   - Finally we need to trigger the beep sound automatically. Look how
     this works for the `click` sound inside the `playNextStep()`
     function. Copy and adapt this code to trigger the beep sound
     given `beep.pattern` and the `playhead` position.
   - For accurate scheduling it is essential that you pass the `time`
     parameter to the `start()` method: `beep.player.start(time)`.
   - Test your `beep` pattern. You should be able to turn it on and
     off using the top centre button. Try playing with the 0s and 1s
     in `beep.pattern` array to create a rhythm that you like.
   - Hint: You can even live code different patterns by changing the
     value of `beep.pattern = […]` in the console.

4. Add your own sound [2 marks]
   - Find a very short audio sample to work with. Perhaps a bass drum.
   - e.g. download a sample from freesounds.org and edit it in
     Audacity.
   - Follow the same process as above to add your new sound. This one
     should be turned on and off by using the top right-hand button.

5. Volume slider [1 mark]
   - The slider on the far left would make a perfect main volume
     control for the output of the MPG.
   - Create a global variable called `mainOut` and initialise it in
     `startAudio()` as a new `Tone.Volume(0)` object, *before* your
     player objects. Zero here means 0 dB (unity signal gain).
   - Connect `mainOut` to your speakers.
   - Disconnect your players from the speakers and instead connect
     them to `mainOut`: ```[player] → [mainOut] → [speakers]```
   - Hint: Look up the definition of the
     [`Player.connect()`](https://tonejs.github.io/docs/15.0.4/classes/Player.html#connect)
     method in the Tone.js documentation. You only need to provide the
     first argument here – the object you want to connect the player
     to.
   - Make sure you have removed all calls to
     `Tone.Player.toDestination()`, as the players should not be
     connected to the speakers directly – only `mainOut` should be
     connected to the speakers. You are building your own mixer!
   - Finally add a line of code to `setMainVolume()` to assign the
     value of the slider to `mainOut.volume.value`. Don’t forget that
     volume in Tone.js assumes decibels. The slider gives you values
     between zero and one (see the console when you move it), you need
     to convert this to a reasonable decibels range.
   - Hint: Checkout the `ampToDb()` function defined in
     `index.js`. Try calling this function in the console giving
     different amplitude value arguments to make sure you understand
     how it works. You can optionally provide a second argument to
     change the default dB range.
   - Test that when you change the slider the volume of all of your
     sounds changes. When the slider is at the bottom there should be
     no sound.

6. Hi-hat with volume control [2 marks]
   - As before adapt the code to play the sample `hat.mp3`.
   - This time it should be controlled by the first button on the
     middle row of buttons.
   - Once the sound is working change the 0s and 1s in your hi-hat
     beat pattern to float values between 0.0 and 1.0. We will use
     these values to control the volume of the individual sound
     events.
   - In the `playNextStep()` function modify the hi-hat trigger `if`
     statement so that it sets the value of `hihat.player.volume`
     parameter at the correct sample-accurate time using
     [`setValueAtTime()`](https://tonejs.github.io/docs/15.0.4/classes/Param.html#setValueAtTime).
   - `setValueAtTime()` takes two arguments:
     - `value` (should be a decibel value based on the numbers in the
       pattern array)
     - `time` (the time to apply the volume change – use the `time`
       argument passed into `playNextStep()` from the clock).
   - Check that the hi-hats now change volume throughout the pattern.
   - Hint: Don’t forget to convert the float values between 0 and 1 to
     suitable decibel values using `ampToDb()`!

7. Be creative [10 marks]
   - These few steps have got you started but now you need to finish
     the job. Assign samples and functions to the remaining buttons
     and sliders.

Show off as many of the techniques that you have learnt as
possible. For example you could:

   - adjust the playback rates of the samples
   - pitch-shift some sounds based on the pattern array values
   - add controllable delays to some sounds
   - make one slider adjust the tempo of the step sequencer
     (i.e. change the value of `clock.frequency.value`)
   - reverse some samples using an `if` statement conditional on
     pattern array or `random()` values (see
     [`Player.reverse`](https://tonejs.github.io/docs/15.0.4/classes/Player.html#reverse))
   - use the `random()` or `sin()` functions to create variation.

NB. Musical style and taste are up to you, but make sure that the
techniques applied are appropriate for the samples you’ve used.

7. Zip the whole folder to submit.
   - Make sure we can run your code with what you’ve
     submitted. Include the libraries and samples. Don’t miss anything
     out!
   - Make sure you comment your code thoroughly!
   - Make sure your samples are small. The upper limit for your
     uploaded files is 100MB.
