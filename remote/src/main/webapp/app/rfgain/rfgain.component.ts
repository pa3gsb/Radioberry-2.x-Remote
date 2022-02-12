import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RadioberryService} from '../service/radioberry.service';
import {DSP, Radio} from "../model/radio";

@Component({
  selector: 'rb-rfgain',
  templateUrl: `./rfgain.component.html`,
  styleUrls: ['./rfgain.component.css']
})
export class RfgainComponent implements OnInit, AfterViewInit  {

  constructor(private radiocontrolService: RadioberryService) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    let myKnob
    if (window.innerHeight < 500)
      myKnob = pureknob.createKnob(55, 55);
    else
      myKnob = pureknob.createKnob(80, 80);
    const radio: Radio = this.radiocontrolService.getRadioState();
    myKnob.setProperty('valMin',-12);
    myKnob.setProperty('valMax',48);
    myKnob.setValue(radio.rf_gain-12);
    myKnob.setProperty('colorBG','rgba(0, 0, 0)');
    myKnob.setProperty('colorFG','rgba(255, 255, 255)');
    myKnob.setProperty('colorLabel','rgba(255, 255, 0)');
    myKnob.setProperty('needle',true);
    myKnob.setProperty('label','RF-Gain');

    const that = this;
    var listener = function(myKnob, value) {
      const radio: Radio = that.radiocontrolService.getRadioState();
      radio.rf_gain = (value +  12);
      that.radiocontrolService.updateRadioState(radio);
    };
    myKnob.addListener(listener);

    let node = myKnob.node();
    let elem = document.getElementById('rfgain');
    elem.appendChild(node);
  }

}
