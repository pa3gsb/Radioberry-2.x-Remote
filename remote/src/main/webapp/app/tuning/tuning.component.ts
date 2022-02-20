import { Component, OnInit } from '@angular/core';
import {RadioberryService} from "../service/radioberry.service";
import {Radio} from "../model/radio";

@Component({
  selector: 'rb-tuning',
  templateUrl: './tuning.component.html',
  styleUrls: ['./tuning.component.css']
})
export class TuningComponent implements OnInit {

  private radio: Radio;
  private freq: number = 3630000;
  private freqstep: number = 10;
  toggle: boolean = true;
  private stepped:boolean = false;
  interval1;
  interval2;
  interval3;
  interval4;

  frequency: string = "3.630.000";

  constructor(private radiocontrolService: RadioberryService) {
      this.radio = radiocontrolService.getRadioState();
      if (this.radio !== undefined) {
            this.freq = this.radio.frequency;
            this.updateFrequencyDisplay();
      }
      radiocontrolService.radioUpdate.subscribe(
        (radio :Radio) => {
          console.log('radio change received ' + radio.frequency + ' ' + this.freq);
          if (radio.frequency != this.freq) {
            this.freq = radio.frequency;
            this.updateFrequencyDisplay();
          }
        }
      );
  }

  ngOnInit(): void {
  }

  searchDown(){
    console.log("search down");
  }
  searchUp() {console.log("search up");

  }

  freqDecr(){
    if (this.toggle) {
      console.log("ddecr")
      this.interval1 = setInterval(() => {
        if (this.freqstep < 1000) this.freqstep = this.freqstep * 10;
      },1000);
      this.interval2 = setInterval(() => {
        this.stepped = true;
        this.freq = this.freq - this.freqstep;
        this.freq = Math.ceil(this.freq/this.freqstep)*this.freqstep;
        this.updateFrequencyDisplay();
      },100);
      this.toggle = false;
    } else {
      console.log("udecr")
      this.toggle = true;
      clearInterval(this.interval1);
      clearInterval(this.interval2);
      if (this.stepped) this.freq = this.freq - this.freqstep;
      this.updateFrequencyDisplay();
      this.freqstep = 10;
    }
  }

  freqIncr(){
    if (this.toggle) {
      console.log("dincr")
      this.interval3 = setInterval(() => {
        if (this.freqstep < 1000) this.freqstep = this.freqstep * 10;
      },1000);
      this.interval4 = setInterval(() => {
        this.stepped = true;
        this.freq = this.freq + this.freqstep;
        this.freq = Math.ceil(this.freq/this.freqstep)*this.freqstep;
        this.updateFrequencyDisplay();
      },100);
      this.toggle = false;
    } else {
      console.log("uincr")
      this.toggle = true;
      clearInterval(this.interval3);
      clearInterval(this.interval4);
      if (this.stepped) this.freq = this.freq + this.freqstep;
      this.updateFrequencyDisplay();
      this.freqstep = 10;
    }
  }

  updateFrequencyDisplay(): void {
    let strFreq = numeral(this.freq).format('0,0');
    strFreq = strFreq.replace(/,/g, '.');
    strFreq = strFreq.padStart(10, ' ');

    this.frequency = strFreq;
    this.radiocontrolService.getRadioState().frequency = this.freq;
    this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
  }

}
