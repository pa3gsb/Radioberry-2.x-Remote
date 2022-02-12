import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'rb-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.css']
})
export class SpectrumComponent implements AfterViewInit {

  private bw_l: number;
  private bw_r: number;
  private md: boolean = false;

  @ViewChild('spectrum', {static: false}) spectrum: ElementRef;
  public context: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement> this.spectrum.nativeElement).getContext('2d');

    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;

    let width = this.context.canvas.width * 0.8;
    let width_offset = this.context.canvas.width * 0.1;
    let height = this.context.canvas.height * 0.6;
    let height_offset = this.context.canvas.height * 0.2;

    // here we are drawing the spectrum raster view.
    //no background.
    //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    //this.context.fillStyle = 'rgba(0, 0, 0)';
    //this.context.fillRect(width_offset, height_offset, width, height);

    // horizontal raster
    this.context.strokeStyle = 'lightgrey';
    this.context.lineWidth = 0.2;
    this.context.beginPath();

    //spectrum -40dBm till -140dBm; showing 100dBm dynamic range...
    let p: number = 40;
    let i: number;
    for (i = height_offset; i < (height + height_offset); i += (height/10)) {
      this.context.moveTo(width_offset, i);
      this.context.lineTo(width + width_offset, i);
      this.context.fillStyle = 'lightgrey';
      this.context.font = 'bold 13px sans-serif';
      this.context.fillText('-' + p, width_offset, i);
      p += 10;
    }
    this.context.stroke();

    // vertical raster
    this.context.beginPath();
    for (i = width_offset; i < (width + width_offset); i += 20) {
      this.context.moveTo(i, height_offset);
      this.context.lineTo(i, height + height_offset);
    }
    this.context.stroke();
  }
}
