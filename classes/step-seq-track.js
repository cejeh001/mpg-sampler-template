class StepSeqTrack {
    constructor(name, pattern, button) {
        if (pattern.length != numSteps) {
            console.error(`Pattern length "${name}" should be ${numSteps}.`);
        }
        this.name = name;
        this.pattern = pattern;
        this.button = button;
        this.isPlaying = false;

        // Set button label to this.name.
        this.button.label = this.name;

        // Set button callback to update this.isPlaying.
        this.button.onPressed = (playback) => {
            this.isPlaying = playback;
        }
    }

}
