import { Component, OnInit } from '@angular/core';
import {RadioberryService} from '../service/radioberry.service';
import {DSP} from "../model/radio";

@Component({
  selector: 'rb-bandselector',
  templateUrl: './bandselector.component.html',
  styleUrls: ['./bandselector.component.css']
})
export class BandselectorComponent implements OnInit {

  b160: boolean = false;
  b80: boolean = false;
  b40: boolean = false;
  b30: boolean = false;
  b20: boolean = false;
  b10: boolean = false;

  constructor(private radiocontrolService: RadioberryService) {}

  ngOnInit() {
  }

  bandChange(band: string): void {

    this.b160 = false;
    this.b80 = false;
    this.b40 = false;
    this.b30 = false;
    this.b20 = false;
    this.b10 = false;

    switch(band) {
      case '160':
        this.radiocontrolService.getRadioState().frequency = 1638000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b160 = true;
        return;
      case '80':
        this.radiocontrolService.getRadioState().frequency = 3630000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b80 = true;
        return;
      case '40':
        this.radiocontrolService.getRadioState().frequency = 7100000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b40 = true;
        return;
      case '30':
        this.radiocontrolService.getRadioState().frequency = 10100000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b30 = true;
        return;
      case '20':
        this.radiocontrolService.getRadioState().frequency = 14250000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b20 = true;
        return;
      case '10':
        this.radiocontrolService.getRadioState().frequency = 28300000;
        this.radiocontrolService.updateRadioState(this.radiocontrolService.getRadioState());
        this.b10 = true;
        return;
      default:
        return;
    }
  }

}
