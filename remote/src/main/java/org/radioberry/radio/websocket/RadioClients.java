package org.radioberry.radio.websocket;

import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
@Startup
public class RadioClients {

  private Map<RadioClient, RadioWebsocketHandler> radios = new HashMap<RadioClient, RadioWebsocketHandler>();

  public List<RadioClient> getRadios() {
    List<RadioClient> list = new ArrayList<RadioClient>(radios.keySet());

    return list;
  }

  public synchronized void addRadioClient(
    RadioWebsocketHandler radioWebSocketHandler) {
    RadioClient radioClient = new RadioClient(radioWebSocketHandler);
    radios.put(radioClient, radioWebSocketHandler);

    System.out.println("#tuned radios = " + radios.size());
  }

  public synchronized void removeRadioClient(RadioWebsocketHandler radioWebSocketHandler) {
    for (RadioClient r : radios.keySet()) {
      if (radios.get(r).equals(radioWebSocketHandler)) {
        radios.remove(r);
      }
    }
    radios.remove(radioWebSocketHandler);

    System.out.println("#tuned radios = " + radios.size());
  }

  public synchronized void audioStream(float[] audioSamples) {
    try {
      for (RadioClient radioClient : this.getRadios()) {
        radioClient.audioStream(audioSamples);
      }
    }
    catch (Exception ex) {System.out.println("Error in sending message: audiostream \n");}
  }

  public synchronized void spectrumStream(float[] spectrumSamples) {
    try {
      for (RadioClient radioClient : this.getRadios()) {
        radioClient.spectrumStream(spectrumSamples);
      }
    }
    catch (Exception ex) {System.out.println("Error in sending message spectrumstream \n");}
  }

  public synchronized void meterStream(int signal) {
    try {
      for (RadioClient radioClient : this.getRadios()) {
        radioClient.meterStream(signal);
      }
    }
    catch (Exception ex) {System.out.println("Error in sending message meterstream \n");}
  }
}
