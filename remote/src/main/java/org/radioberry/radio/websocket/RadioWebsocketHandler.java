package org.radioberry.radio.websocket;

import org.radioberry.domain.Message;
import org.radioberry.radio.WebRadio;

import javax.inject.Inject;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint(value = "/sdr/",  decoders = MessageDecoder.class,  encoders = MessageEncoder.class)
public class RadioWebsocketHandler {

  @Inject
  private RadioClients radioClients;

  @Inject
  private WebRadio radio;

  private Session session;

  @OnOpen
  public void onOpen(Session session) throws IOException {
    // Get session and WebSocket connection
    this.session = session;
    radioClients.addRadioClient(this);
  }

  @OnMessage
  public void onMessage(Session session, Message message) throws IOException {
    radio.getRadio().processMicrophoneStream(message.getMic());
  }

  @OnClose
  public void onClose(Session session) throws IOException {
    // WebSocket connection closes
    try {
      radioClients.removeRadioClient(this);
      this.session = null;
    } catch (Exception ex) {
      System.out.println("websocket close problem. sweep under the carpet!");
    }
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    // Do error handling here
  }

  public void sendMessage(Message message) {
    try {
      if (session.isOpen()) {
        this.session.getBasicRemote().sendObject(message);
      }
    } catch (IOException | EncodeException e) {
      System.out.println("websocket send message problem.");
      e.printStackTrace();
    }
  }

}
