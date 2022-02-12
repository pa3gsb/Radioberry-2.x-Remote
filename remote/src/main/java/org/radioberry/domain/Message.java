package org.radioberry.domain;

public class Message {
  private float[] spectrum;
  private float[] audio;
  private short[] mic;
  private int signal;

  private String message;

  public float[] getSpectrum() {
    return spectrum;
  }
  public void setSpectrum(float[] spectrum) {
    this.spectrum = spectrum;
  }

  public float[] getAudio() {
    return audio;
  }
  public void setAudio(float[] audio) {
    this.audio = audio;
  }

  public short[] getMic() {
    return mic;
  }

  public void setMic(short[] mic) {
    this.mic = mic;
  }

  public int getSignal() {
    return signal;
  }

  public void setSignal(int signal) {
    this.signal = signal;
  }

  public String getMessage() {
    return message;
  }
  public void setMessage(String message) {
    this.message = message;
  }
}
