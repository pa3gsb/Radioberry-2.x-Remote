package org.radioberry.domain;

public class Radio {

  float frequency = 3630000;
  int frequencystep = 100;
  int volume = 10;
  int rf_gain = 31; //actual 31-12 = 19
  boolean transmit = false;

  public float getFrequency() {
    return frequency;
  }

  public void setFrequency(float frequency) {
    this.frequency = frequency;
  }

  public int getFrequencystep() {
    return frequencystep;
  }

  public void setFrequencystep(int frequencystep) {
    this.frequencystep = frequencystep;
  }

  public int getVolume() {
    return volume;
  }

  public void setVolume(int volume) {
    this.volume = volume;
  }

  public int getRf_gain() {
    return rf_gain;
  }

  public void setRf_gain(int rf_gain) {
    this.rf_gain = rf_gain;
  }

  public boolean isTransmit() {
    return transmit;
  }

  public boolean isReceive() {
    return !transmit;
  }

  public void setTransmit(boolean transmit) {
    this.transmit = transmit;
  }

  @Override
  public String toString() {
    return "Radio{" +
      "frequency=" + frequency +
      ", frequencystep=" + frequencystep +
      ", volume=" + volume +
      ", rf_gain=" + rf_gain +
      ", transmit=" + transmit +
      '}';
  }

}
