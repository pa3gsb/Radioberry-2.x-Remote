import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../service/websocket.service';

@Component({
  selector: 'rb-hfspectrum',
  templateUrl: './hfspectrum.component.html',
  styleUrls: ['./hfspectrum.component.css']
})
export class HfspectrumComponent implements AfterViewInit {


  @ViewChild('hfspectrum', {static: false}) hfspectrum: ElementRef;
  public context: CanvasRenderingContext2D;

  constructor(private websocket: WebsocketService) {
    websocket.getWebsocketData().subscribe(
      (backend_data) => {
        if (backend_data.spectrum) this.showReceivedSpectrum(backend_data),
          // Called whenever there is a message from the server
          (err) => console.log(err);
      },
      // Called if WebSocket API signals some kind of error
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
    );
  }

  showReceivedSpectrum(data: any): void {
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;

    let width = this.context.canvas.width * 0.8;
    let width_offset = this.context.canvas.width * 0.1;
    let height = this.context.canvas.height * 0.6;

    console.log("height "+height);

    let height_offset = this.context.canvas.height * 0.2;

    // here we are drawing the received spectrum.
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    //spectrum -40dBm till -140dBm; showing 100dBm dynamic range...
    //we need to bring signal levels to spectrum drawing; taking into account sizing.
    let heightper10dB = height / 100;
    let dataArray = new Float32Array(1280);
    for (let i = 0; i < 1280; i++) {
      dataArray[i] = ((parseFloat(data.spectrum[i]) * -1.0)- 40) *  heightper10dB;
    }
    const bufferLength = 1280;
    const sliceWidth = width * 1.0 / bufferLength;
    this.context.strokeStyle = 'rgba(0, 0, 0)'
    this.context.lineWidth = 1;
    this.context.moveTo(width_offset, height_offset + dataArray[0]);
    this.context.beginPath();
    for (let i = 1; i < bufferLength; i++) {
      this.context.lineTo(width_offset + (sliceWidth * i) , height_offset + dataArray[i]);
    }
    this.context.stroke();
  }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement> this.hfspectrum.nativeElement).getContext('2d');

    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;

    // here we are drawing the received spectrum; initialize here.
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }
}
