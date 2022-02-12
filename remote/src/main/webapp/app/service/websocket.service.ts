import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private radioberryWebSocket: WebSocketSubject<any>;

  constructor() {
    if (environment.production) {
      var host = document.location.host;
      var pathname = document.location.pathname;
      this.radioberryWebSocket = webSocket("wss://" + host + pathname + "sdr/");
    } else {
      //this.radioberryWebSocket = webSocket('wss://echo.websocket.org');
      this.radioberryWebSocket = webSocket('wss://connect.websocket.in/v3/1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self');
    }
  }

  getWebsocketData(): Observable<any> {
    return this.radioberryWebSocket.asObservable();
  }

  sendWebsocketData(message: any): void {
    this.radioberryWebSocket.next(message);
  }
}
