import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SpectrumComponent} from './spectrum/spectrum.component';
import {BandselectorComponent} from './bandselector/bandselector.component';
import {ModeselectorComponent} from './modeselector/modeselector.component';
import {VolumeComponent} from './volume/volume.component';
import {AgcselectorComponent} from './agcselector/agcselector.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FrequencyComponent} from './frequency/frequency.component';
import {BandpassComponent} from './bandpass/bandpass.component';
import {HfspectrumComponent} from './hfspectrum/hfspectrum.component';
import {BackgroundComponent} from './background/background.component';
import {RfgainComponent} from './rfgain/rfgain.component';
import {AgcgainComponent} from './agcgain/agcgain.component';
import {RadioberryComponent} from './radioberry/radioberry.component';
import {FormsModule} from "@angular/forms";
import { FrequencystepselectorComponent } from './frequencystepselector/frequencystepselector.component';
import { MicrophoneComponent } from './microphone/microphone.component';
import { MeterComponent } from './meter/meter.component';
import { TuningComponent } from './tuning/tuning.component';

@NgModule({
  declarations: [
    AppComponent,
    SpectrumComponent,
    BandselectorComponent,
    ModeselectorComponent,
    VolumeComponent,
    AgcselectorComponent,
    FrequencyComponent,
    BandpassComponent,
    HfspectrumComponent,
    BackgroundComponent,
    RfgainComponent,
    AgcgainComponent,
    RadioberryComponent,
    FrequencystepselectorComponent,
    MicrophoneComponent,
    MeterComponent,
    TuningComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
