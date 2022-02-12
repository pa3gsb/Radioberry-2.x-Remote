import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../service/websocket.service";

@Component({
  selector: 'rb-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.css']
})
export class MeterComponent implements OnInit {

  signal:number = -73;

  constructor(private websocket: WebsocketService) {
    websocket.getWebsocketData().subscribe(
      (backend_data) => {
        if (backend_data.signal) this.setSignal(backend_data) ,
          // Called whenever there is a message from the server
          (err) => console.log(err);
      },
      // Called if WebSocket API signals some kind of error
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
    );
  }

  setSignal(data: any): void {
    this.signal = data.signal;
  }

  ngOnInit(): void {
  }

}
