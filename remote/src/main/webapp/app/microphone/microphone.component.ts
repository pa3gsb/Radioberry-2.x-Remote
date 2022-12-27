import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../service/websocket.service";
import {Microphone, Radio} from "../model/radio";
import {RadioberryService} from "../service/radioberry.service";

@Component({
  selector: 'rb-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.css']
})
export class MicrophoneComponent implements OnInit {

  transmit: boolean = false;

  private decimationCount: number = 0;

  private audioSource: MediaStreamAudioSourceNode;
  private audioAnalyser?: AnalyserNode;
  private audioworkletNode: AudioWorkletNode;

  constructor(private radiocontrolService: RadioberryService, private websocket: WebsocketService) {
  }

  ngOnInit(): void {
  }

  start() {
    const radio: Radio = this.radiocontrolService.getRadioState();
    if (!this.transmit) this.startMicStream(); else this.stopMicStream();
    this.transmit = !this.transmit;
    radio.transmit = this.transmit;
    this.radiocontrolService.updateRadioState(radio);
    MicrophoneComponent.displayMicLevel(0.0);
  }

  startMicStream() {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        const audioContext = this.createAudioContext(stream);
        let audioNode;
        this.initializeWorklet(audioContext)
          .then((node) => {
            audioNode = node;
            this.audioSource.connect(audioNode);
            audioNode.connect(audioContext.destination);
          });
      })
      .catch((error) => console.log('error', error));
  }

  private async initializeWorklet(audioContext: AudioContext): Promise<AudioWorkletNode> {
    return await audioContext.audioWorklet.addModule(".\\assets\\js-libs\\WebAudio\\worklet-processor.js").then(() => {
      this.audioworkletNode = new AudioWorkletNode(audioContext, 'worklet-processor');
      this.audioworkletNode.port.onmessage = (event) => {

        if (event.data.level !== undefined) MicrophoneComponent.displayMicLevel(event.data.level);

        const microphone: Microphone = new Microphone();
        // create a low-pass filter with a cutoff frequency of 16 kHz
        const lowPassFilter = audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 8000;
        for (let i = 0; i < event.data.inputBuffer.length; i++) {
          // create an array to hold the input audio sample
          const inputSampleArray = new Float32Array([event.data.inputBuffer[i]]);
          // create an array to hold the output audio sample
          const outputSampleArray = new Float32Array(event.data.inputBuffer.length);
          // create an array to hold the output phase response
          const phaseResponseArray = new Float32Array(event.data.inputBuffer.length);
          // calculate the frequency response of the filter at the input frequency
          lowPassFilter.getFrequencyResponse(inputSampleArray, outputSampleArray, phaseResponseArray);
          // decimate the filtered audio data by only keeping every 8th sample
          if (this.decimationCount % 8 == 0) {
            let tsd: any = new Number();
            tsd = outputSampleArray[0];
            tsd = 32767.0 * tsd;
            tsd = (tsd << 16) >> 16;
            microphone.mic.push(tsd);
          }
          this.decimationCount++;
        }
        this.websocket.sendWebsocketData(microphone);
      };
      return Promise.resolve(this.audioworkletNode);
    });
  }


  stopMicStream(): void {
    this.audioSource.disconnect();
    this.audioworkletNode.port.close();
  }

  static average(arr: Uint8Array): number {
    return arr.reduce((prev, current) => prev + current, 0) / arr.length;
  }

  private createAudioContext(stream: MediaStream): AudioContext | undefined {
    const audioContext = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)() as AudioContext;
    this.audioSource = audioContext.createMediaStreamSource(stream);
    this.audioAnalyser = audioContext.createAnalyser();
    this.audioSource.connect(this.audioAnalyser);
    //this.audioSource.connect(audioContext.destination);
    return audioContext;
  }

  static ledColor = ["#064dac", "#064dac", "#064dac", "#06ac5b", "#15ac06", "#4bac06", "#80ac06", "#acaa06", "#ac8b06", "#ac5506"];

  static displayMicLevel(vol): void {
    let leds = Array.from(document.getElementsByClassName('led') as HTMLCollectionOf<HTMLElement>)
    for (var i = 0; i < leds.length; i++) {
      leds[i].style.boxShadow = "-2px -2px 4px 0px #a7a7a73d, 2px 2px 4px 0px #0a0a0e5e";
      leds[i].style.height = "25px";
    }
    let range = leds.slice(0, Math.round(vol * 100.0));
    for (var i = 0; i < range.length; i++) {
      range[i].style.boxShadow = `5px 2px 5px 0px #0a0a0e5e inset, -2px -2px 1px 0px #a7a7a73d inset, -2px -2px 30px 0px ${MicrophoneComponent.ledColor[i]} inset`;
      range[i].style.height = "25px"
    }
  }

}
