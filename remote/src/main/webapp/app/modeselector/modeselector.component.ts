import {Component, OnInit} from '@angular/core';
import {RadioberryService} from "../service/radioberry.service";
import {NgModel} from "@angular/forms";
import {DSP, Mode, Radio} from "../model/radio";

@Component({
  selector: 'rb-modeselector',
  templateUrl: './modeselector.component.html',
  styleUrls: ['./modeselector.component.css']
})
export class ModeselectorComponent implements OnInit {

  lsb: boolean = false;
  usb: boolean = false;

  constructor(private radiocontrolService: RadioberryService) {
    this.updateButtons(radiocontrolService.getDSPState());
    this.radiocontrolService.dspUpdate.subscribe(
      (dsp: DSP) => {
       this.updateButtons(dsp);
      }
    );
  }

  ngOnInit() {
    this.radiocontrolService.getDSPState().mode
  }

  modeChange(mode: string) {
    let dsp: DSP = this.radiocontrolService.getDSPState()
    dsp.mode = DSP.getModeMode(mode)
    this.radiocontrolService.updateDSPState(dsp);
  }

  updateButtons(dsp:DSP){
    if (dsp.mode === 0) this.lsb = true; else this.lsb = false;
    if (dsp.mode === 1) this.usb = true; else this.usb = false;
  }
}
