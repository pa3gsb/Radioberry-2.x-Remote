const SMOOTHING_FACTOR = 0.8;

class WorkletProcessor extends AudioWorkletProcessor {

  _level;
  _updateIntervalInMS;
  _nextUpdateFrame;

  constructor() {
    super();
    this._level = 0;
    this._updateIntervalInMS = 25;
    this._nextUpdateFrame = this._updateIntervalInMS;
    //this.port.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    console.log(`[Processor:Received] ${event.data.message}`);
  }

  get intervalInFrames () {
    return this._updateIntervalInMS / 1000 * sampleRate;
  }

  process(inputs, outputs, parameters) {

    let input = inputs[0];
    let output = outputs[0];

    // calc mic level
    if (input.length > 0) {
      const samples = input[0];
      let sum = 0;
      let rms = 0;
      // Calculated the squared-sum.
      for (let i = 0; i < samples.length; ++i) sum += samples[i] * samples[i];
      // Calculate the RMS level and update the volume.
      rms = Math.sqrt(sum / samples.length);
      this._level = Math.max(rms, this._level * SMOOTHING_FACTOR);

      // Each input or output may have multiple channels. Get the first channel.
      let inputChannel0 = input[0];
      let outputChannel0 = output[0];

      // Update and sync the volume property with the main thread.
      this._nextUpdateFrame -= samples.length;
      if (this._nextUpdateFrame < 0) {
        this._nextUpdateFrame += this.intervalInFrames;
        this.port.postMessage({level: this._level, inputBuffer: inputChannel0});
      }  else {
        this.port.postMessage({inputBuffer: inputChannel0});
      }
    }



    // this.port.postMessage({
    //   inputBuffer: inputChannel0
    // });

    // this.port.postMessage({
    //   inputBuffer: inputChannel0,
    //   outputBuffer: outputChannel0
    // });
    return true;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
