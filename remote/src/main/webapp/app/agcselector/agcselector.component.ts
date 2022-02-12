import { Component, OnInit } from '@angular/core';
import {DSP} from "../model/radio";
import {RadioberryService} from "../service/radioberry.service";

@Component({
  selector: 'rb-agcselector',
  templateUrl: './agcselector.component.html',
  styleUrls: ['./agcselector.component.css']
})
export class AgcselectorComponent implements OnInit {

  off: boolean = false;
  slow: boolean = false;
  long: boolean = false;
  medium: boolean = false;
  fast: boolean = false;

  constructor(private radiocontrolService: RadioberryService) {
    this.updateButtons(radiocontrolService.getDSPState());
    this.radiocontrolService.dspUpdate.subscribe(
      (dsp: DSP) => {
        this.updateButtons(dsp);
      }
    );

  }

  ngOnInit() {
  }

  agcChange(mode: string) {
    let dsp: DSP = this.radiocontrolService.getDSPState()
    dsp.agc_mode = DSP.getAGCMode(mode);
    this.radiocontrolService.updateDSPState(dsp);
  }

  updateButtons(dsp:DSP){
    this.off = false
    this.slow = false;
    this.long = false;
    this.medium = false;
    this.fast = false;

    if (dsp.agc_mode === 0) this.off = true;
    if (dsp.agc_mode === 1) this.long = true;
    if (dsp.agc_mode === 2) this.slow = true;
    if (dsp.agc_mode === 3) this.medium = true;
    if (dsp.agc_mode === 4) this.fast = true;
  }

}
