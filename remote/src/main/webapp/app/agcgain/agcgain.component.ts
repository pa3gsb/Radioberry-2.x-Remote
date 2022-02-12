import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RadioberryService} from '../service/radioberry.service';
import {DSP} from "../model/radio";

@Component({
  selector: 'rb-agcgain',
  templateUrl: './agcgain.component.html',
  styleUrls: ['./agcgain.component.css']
})
export class AgcgainComponent implements OnInit , AfterViewInit {

  constructor(private radiocontrolService: RadioberryService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {

    let myKnob
    if (window.innerHeight < 500)
      myKnob = pureknob.createKnob(55, 55);
    else
      myKnob = pureknob.createKnob(80, 80);
    const dsp: DSP = this.radiocontrolService.getDSPState();
    myKnob.setValue(dsp.agc_gain);
    myKnob.setProperty('valMax',120);
    myKnob.setProperty('colorBG','rgba(0, 0, 0)');
    myKnob.setProperty('colorFG','rgba(255, 255, 255)');
    myKnob.setProperty('colorLabel','rgba(255, 255, 0)');
    myKnob.setProperty('needle',true);
    myKnob.setProperty('label','AGC-Level');

    const that = this;
    var listener = function(myKnob, value) {
      const dsp: DSP = that.radiocontrolService.getDSPState();
      dsp.agc_gain = value;
      that.radiocontrolService.updateDSPState(dsp);
    };
    myKnob.addListener(listener);

    let node = myKnob.node();
    let elem = document.getElementById('agcgain');
    elem.appendChild(node);
  }

}
