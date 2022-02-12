import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DSP, Radio} from '../model/radio';

@Injectable({
  providedIn: 'root'
})
export class RadioberryService {

  private radioState: Radio;
  private dspState: DSP;
  private baseurl: string = '/remote/rest/sdr/';
  private localstorage: boolean = true;

  @Output()
  radioUpdate: EventEmitter<Radio> = new EventEmitter();
  @Output()
  dspUpdate: EventEmitter<DSP> = new EventEmitter();

  constructor(private http: HttpClient) {
    try {
      this.radioState = JSON.parse(localStorage.getItem('radiostate'));
      if (this.radioState === null) {
        this.radioState = new Radio();
        localStorage.setItem('radiostate', JSON.stringify(this.radioState));
      }
      this.dspState = JSON.parse(localStorage.getItem('dspstate'));
      if (this.dspState === null) {
        this.dspState = new DSP();
        localStorage.setItem('dspstate', JSON.stringify(this.dspState));
      }
    } catch (e) {
      console.error('Radioberry web app reports localStorage is not supported', e);
      // using class defaults.
      this.radioState = new Radio();
      this.dspState = new DSP();
      this.localstorage = false;
    }
  }

  getRadioState(): Radio {
    return this.radioState;
  }

  getDSPState(): DSP {
    return this.dspState;
  }

  updateRadioState(radio: Radio): void {
    if (this.localstorage) {
      localStorage.setItem('radiostate', JSON.stringify(radio));
    }
    this.http.post<Radio>(this.baseurl + 'radio', radio).subscribe();

    this.radioUpdate.emit(radio);
  }

  updateDSPState(dsp: DSP): void {
    if (this.localstorage) {
      localStorage.setItem('dspstate', JSON.stringify(dsp));
    }
    this.http.post<DSP>(this.baseurl + 'dsp', dsp).subscribe();

    this.dspUpdate.emit(dsp);
  }

}
