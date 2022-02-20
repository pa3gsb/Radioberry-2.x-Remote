import {Component, HostListener, OnInit} from '@angular/core';
import {WebsocketService} from './service/websocket.service';
import {Router} from '@angular/router';
import {Audio, Spectrum} from './model/radio';
import {interval} from 'rxjs';
import {environment} from '../environments/environment';

@Component({
  selector: 'rb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  styleExp = "none";

  constructor(private router: Router, private websocket: WebsocketService) {}


  ngOnInit() {
    if (environment.production) {
      //const secondsCounter = interval(20000);
      //secondsCounter.subscribe(n => {
      //  let json = JSON.stringify({"message": "keep alive" });
      //  this.websocket.sendWebsocketData(json)});
    } else {
      const secondsCounter = interval(500);
      secondsCounter.subscribe((n) => {
        const spectrum: Spectrum = new Spectrum();
        for (let i = 0; i < 1280; i++) {
          //let tsd : SpectrumTestData = new SpectrumTestData();
          let tsd: Number = new Number();
          if ( i > 400 && i < 600) {tsd = (Math.random() * 5.0 + 60) * -1.0;} else {
            tsd = (Math.random() * 5.0 + 110) * - 1.0}
          spectrum.spectrum.push(tsd);
        }
        this.websocket.sendWebsocketData(spectrum);
      });
      const soundcounter = interval(50);
      //8000 sample/sec. (400/0.05)
      soundcounter.subscribe((n) => {
        const audio: Audio = new Audio();
        for (let i = 0; i < 400; i++) {
          let tsd: Number = new Number();
          tsd = Math.random() * 2 - 1; //white noise...
          audio.audio.push(tsd);
        }
        this.websocket.sendWebsocketData(audio);
      });
    }
  }

  w3_open() {
    this.styleExp = "block";
  }

  w3_close() {
    this.styleExp = "none";
  }

  navigate(s: string) {
    this.w3_close();
    this.router.navigate([s])
  }
}
