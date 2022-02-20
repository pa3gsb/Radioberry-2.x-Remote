import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from "../service/websocket.service";
import {RadioberryService} from "../service/radioberry.service";
import {Radio} from "../model/radio";

@Component({
  selector: 'rb-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.css']
})
export class VolumeComponent implements OnInit{

  @Input() startknop = "block";

  private audioOn: number = 0;
  private player: any;

  constructor(private radiocontrolService: RadioberryService, private websocket: WebsocketService) {
    websocket.getWebsocketData().subscribe(
      (backend_data) => {
        if (backend_data.audio) this.playWebAudio(backend_data),
          // Called whenever there is a message from the server
          (err) => console.log(err);
      },
      // Called if WebSocket API signals some kind of error
      () => console.log('websocket complete')
      // Called when connection is closed (for whatever reason)
    );

    radiocontrolService.radioUpdate.subscribe(
      (radio :Radio) => {
        this.audioOn = radio.transmit ? 0: 1;
      });
  }

  ngOnInit() {
    console.log("ng on init volume");
  }

  playWebAudio(data: any): void {
    if (this.audioOn) this.player.feed(data.audio);
  }

  streamAudio() {
    this.startknop = "none";

    if (this.player === undefined) {
      this.player = new PCMPlayer({
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 100
      });

      this.player.volume(60); // volume set by device
      this.audioOn = 1;
    }
  }
}
