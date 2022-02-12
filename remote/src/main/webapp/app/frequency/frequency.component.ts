import {Component, OnInit} from '@angular/core';
import {Radio} from '../model/radio';
import {RadioberryService} from '../service/radioberry.service';

@Component({
  selector: 'rb-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {

  private radio: Radio;
  private display: any;
  private rotation: any = 0.0;
  private freq: number;

  constructor(private radiocontrolService: RadioberryService) {
    this.radio = radiocontrolService.getRadioState();
    radiocontrolService.radioUpdate.subscribe(
      (radio :Radio) => {
          console.log('radio change received ' + radio.frequency + ' ' + this.freq);
          if (radio.frequency != this.freq) {
            this.freq = radio.frequency;
            this.updateRXFrequencyDisplay();
          }
      }
    );
  }

  ngOnInit() {
    this.display = new SegmentDisplay('vfo');
    this.display.pattern = '##.###.###';
    this.display.displayAngle = 6;
    this.display.digitHeight = 20;
    this.display.digitWidth = 14;
    this.display.digitDistance = 2.5;
    this.display.segmentWidth = 2;
    this.display.segmentDistance = 0.3;
    this.display.segmentCount = 7;
    this.display.cornerType = 1;
    this.display.colorOn = 'lightgreen';
    this.display.colorOff = 'grey';
    this.display.draw();
    this.freq = this.radiocontrolService.getRadioState().frequency;
    const that = this;
    this.updateRXFrequencyDisplay();
    this.tuneToRXFrequency();
    const dial = JogDial(document.getElementById('radioberry_dial'), {
      debug: false,
      touchMode: 'knob',  // knob | wheel
      knobSize: '26%',
      wheelSize: '80%',
      zIndex: 9999,
      degreeStartAt: 0,
      minDegree: null,  // (null) infinity
      maxDegree: null   // (null) infinity
    });
    dial.on('mousemove', function(event) {
      let l_rotation = event.target.rotation;
      that.freq = that.freq + (l_rotation - that.rotation) * that.radio.frequencystep;
      that.freq = Math.ceil(that.freq/that.radio.frequencystep)*that.radio.frequencystep;
      that.rotation = event.target.rotation;
      that.updateRXFrequencyDisplay();
      that.tuneToRXFrequency();
    });
    dial.on("mouseup", function(event) {
      //console.log(event.target.rotation);
    });
  }

  tuneToRXFrequency(): void {
    let strFreq = numeral(this.freq).format('0,0');
    this.radiocontrolService.getRadioState().frequency = this.freq;
    this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
  }

  updateRXFrequencyDisplay(): void {
    let strFreq = numeral(this.freq).format('0,0');
    strFreq = strFreq.replace(/,/g, '.');
    strFreq = strFreq.padStart(10, ' ');
    this.display.setValue(strFreq);
  }
}
