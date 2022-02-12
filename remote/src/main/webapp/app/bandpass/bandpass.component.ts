import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../service/websocket.service';
import {RadioberryService} from '../service/radioberry.service';
import {DSP, Mode} from "../model/radio";

@Component({
  selector: 'rb-bandpass',
  templateUrl: './bandpass.component.html',
  styleUrls: ['./bandpass.component.css']
})
export class BandpassComponent implements OnInit, AfterViewInit {

  private bw: number = 100;
  private bw_l: number;
  private md: boolean = false;
  private freqBin: number;

  @ViewChild('bandpass', {static: false}) bandpass: ElementRef;
  public bandpassContext: CanvasRenderingContext2D;

  constructor(private radioberryService: RadioberryService) {
    this.radioberryService.dspUpdate.subscribe(
      (dsp: DSP) => {
        this.drawPassBand();
      }
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onMousedown(event) {
    if (event.pageX + this.bandpassContext.canvas.offsetLeft > this.bw_l && event.pageX + this.bandpassContext.canvas.offsetLeft < this.bw_l + 100) {
      console.log('down');
      this.md = true;
    }
  }
// shift within spectrum; todo
  // @HostListener('mousemove', ['$event'])
  // onMousemove(event) {
  //   if (this.md) {
  //     this.bw_l = event.pageX + this.bandpassContext.canvas.offsetLeft;
  //     if ((this.bw_l > window.innerWidth * 0.1) && ((this.bw_l + 100) < (window.innerWidth * 0.9))) {
  //       this.drawPassBand();
  //       console.log(this.bw_l);
  //       console.log('freq ' + this.freqBin * (this.bw_l - (this.bandpassContext.canvas.width * 0.1)));
  //     }
  //   }
  // }

  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    this.md = false;
  }

  ngOnInit() {
  }

  clear(): void {
    this.bandpassContext.clearRect(0, 0, this.bandpassContext.canvas.width, this.bandpassContext.canvas.height);
  }

  drawPassBand(): void {
    this.clear();
    let height = this.bandpassContext.canvas.height * 0.6;
    let height_offset = this.bandpassContext.canvas.height * 0.2;
    this.bandpassContext.fillStyle = 'rgba(255, 255, 255, 0.4)';

    let bw_l: number;
    let dsp: DSP = this.radioberryService.getDSPState();
    if (DSP.getModePass(dsp.mode) === -1) bw_l = this.bw_l - this.bw; else bw_l = this.bw_l;

    this.bandpassContext.fillRect(bw_l, height_offset, this.bw, height);
    this.bandpassContext.beginPath();
    this.bandpassContext.moveTo(1, 2);
  }

  ngAfterViewInit(): void {
    this.bandpassContext = (<HTMLCanvasElement>this.bandpass.nativeElement).getContext('2d');
    this.bandpassContext.canvas.width = window.innerWidth;
    this.bandpassContext.canvas.height = window.innerHeight;
    this.bw_l = this.bandpassContext.canvas.width / 2;
    this.drawPassBand();
    this.freqBin = this.radioberryService.getDSPState().samplingrate / (this.bandpassContext.canvas.width * 0.8);
    console.log(this.bandpassContext.canvas.width * 0.8);
    console.log('hz / pixel ' + this.freqBin);
  }
}
