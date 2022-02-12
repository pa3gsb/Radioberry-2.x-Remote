import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'rb-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements AfterViewInit  {

  @ViewChild('radio', {static: false}) background: ElementRef;
  public radio: CanvasRenderingContext2D;

  constructor() { }

  ngAfterViewInit(): void {
    this.radio = (<HTMLCanvasElement> this.background.nativeElement).getContext('2d');

    const image = new Image();
    image.onload = () => {
      this.radio.drawImage(image, 0, 0, image.width, image.height, 0, 0, window.innerWidth, window.innerHeight);
    };
    image.src = './assets/image/radioberry.jpg';

    this.radio.canvas.width = window.innerWidth;
    this.radio.canvas.height = window.innerHeight;
  }

}
