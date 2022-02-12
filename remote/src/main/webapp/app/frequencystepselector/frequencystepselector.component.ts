import { Component, OnInit } from '@angular/core';
import {RadioberryService} from "../service/radioberry.service";
import {DSP, Radio} from "../model/radio";

@Component({
  selector: 'rb-frequencystepselector',
  templateUrl: './frequencystepselector.component.html',
  styleUrls: ['./frequencystepselector.component.css']
})
export class FrequencystepselectorComponent implements OnInit {

  step10: boolean  = false;
  step100: boolean  = false;
  step1000: boolean  = false;

  constructor(private radiocontrolService: RadioberryService) {
    this.updateButtons(radiocontrolService.getRadioState());
    this.radiocontrolService.radioUpdate.subscribe((radio: Radio) => {
      this.updateButtons(radio);
    });
  }

  ngOnInit(): void {
  }

  updateButtons(radio: Radio){
    this.step10  = false;
    this.step100 = false;
    this.step1000  = false;

    if (radio.frequencystep == 10) this.step10 = true;
    if (radio.frequencystep == 100) this.step100 = true;
    if (radio.frequencystep == 1000) this.step1000 = true;
  }

  stepChange(step: string) {
    let radio: Radio = this.radiocontrolService.getRadioState();
    radio.frequencystep = Number(step);
    this.radiocontrolService.updateRadioState(radio);
  }
}
