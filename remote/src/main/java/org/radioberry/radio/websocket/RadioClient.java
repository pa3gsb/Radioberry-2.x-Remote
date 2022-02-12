package org.radioberry.radio.websocket;

import org.radioberry.domain.Message;

public class RadioClient {

  RadioWebsocketHandler radioWebsocketHandler;

  public RadioClient(RadioWebsocketHandler radioWebsocketHandler) {
    this.radioWebsocketHandler = radioWebsocketHandler;
  }

  public void spectrumStream(float[] samples){
    radioWebsocketHandler.sendMessage(getSpectrumJSONStream(samples));
  }

  public void audioStream(float[] audioSamples){
      radioWebsocketHandler.sendMessage(getAudioJSONStream(audioSamples));
  }

  public void meterStream(int signal) {
    radioWebsocketHandler.sendMessage(getSignalJSONStream(signal));
  }

  private Message getSignalJSONStream(int signalLevel) {
    Message message = new Message();
    message.setSignal(signalLevel);
    return  message;
  }

  private Message getAudioJSONStream(float[] audioSamples) {
    Message message = new Message();
    message.setAudio(audioSamples);
    return  message;
  }

  private Message getSpectrumJSONStream(float[] Spectrumsamples) {
    Message message = new Message();
    message.setSpectrum(Spectrumsamples);
    return  message;
  }
}
