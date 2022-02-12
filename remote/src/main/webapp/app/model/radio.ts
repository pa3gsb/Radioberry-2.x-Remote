export class Mode {
  mode: string;
  code: number;
  pass: number;
}

export class AGCMode {
  mode: string;
  code: number;
}

const Modes: Array<Mode> = [
  {mode: 'LSB', code: 0, pass: -1},
  {mode: 'USB', code: 1, pass: 1},
  {mode: 'DSB', code: 2, pass: 2},
  {mode: 'CWL', code: 3, pass: -1},
  {mode: 'CWU', code: 4, pass: 1},
  {mode: 'FM', code: 5, pass: 2},
  {mode: 'AM', code: 6, pass: 2},
  {mode: 'DIGU', code: 7, pass: 1},
  {mode: 'SPEC', code: 8, pass: 2},
  {mode: 'DIGL', code: 9, pass: -1},
  {mode: 'SAM', code: 10, pass: 2},
  {mode: 'DRM', code: 11, pass: 2}];

const agcmode: Array<AGCMode> = [
  {mode: 'OFF', code: 0},
  {mode: 'LONG', code: 1},
  {mode: 'SLOW', code: 2},
  {mode: 'MED', code: 3},
  {mode: 'FAST', code: 4}];

export class Radio {
  frequency: number = 1395000;
  frequencystep: number = 100;
  volume: number = 10;
  rf_gain: number = 19;
  transmit: boolean = false;
}

export class DSP {

  samplingrate: number = 48000;

  mode: number = Modes[0].code;

  agc_gain: number = 70;

  agc_mode: number = agcmode[4].code;

  static getModePass(findMode: number): number {
    let foundMode = Modes.find(mode => mode.code === findMode)
    return foundMode.pass;
  }

  static getModeMode(findMode: string):number {
    let foundMode = Modes.find(mode => mode.mode === findMode)
    return foundMode.code;
  }

  static getAGCMode(findMode: string):number {
    let foundAgcMode = agcmode.find(agcmode => agcmode.mode === findMode)
    return foundAgcMode.code;
  }

}

export class Spectrum {
  spectrum: Array<Number> = [];
}

export class Audio {
  audio: Array<Number> = [];
}

export class Microphone {
  mic: Array<Number> = [];

  // set micArray(value: Int16Array) {
  //   this._mic = value;
  // }
  //
  // get micArray(): Int16Array {
  //   return this._mic;
  // }
}
