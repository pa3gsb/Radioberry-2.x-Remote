package org.radioberry.domain;

public class DSP {

  int samplingrate = 48000;

  int mode = Settings.LSB;
  int agc_mode = Settings.AGC_SLOW;

  int agc_gain = 85;
  int filterLow = Settings.filterLow[mode];
  int filterHigh = Settings.filterHigh[mode];

  double shift = 0.0;

  @Override
  public String toString() {
    return "DSP{" +
      "samplingrate=" + samplingrate +
      ", mode=" + mode +
      ", agc_mode=" + agc_mode +
      ", agc_gain=" + agc_gain +
      ", filterLow=" + filterLow +
      ", filterHigh=" + filterHigh +
      ", shift=" + shift +
      '}';
  }

  public int getSamplingrate() {
    return samplingrate;
  }

  public void setSamplingrate(int samplingrate) {
    this.samplingrate = samplingrate;
  }

  public int getAgc_gain() {
    return agc_gain;
  }

  public void setAgc_gain(int agc_gain) {
    this.agc_gain = agc_gain;
  }

  public double getShift() {
    return shift;
  }

  public void setShift(double shift) {
    this.shift = shift;
  }

  public int getAgc_mode() {
    return agc_mode;
  }

  public void setAgc_mode(int agc_mode) {
    this.agc_mode = agc_mode;
  }

  public int getFilterLow() {
    return filterLow;
  }

  public void setFilterLow(int filterLow) {
    this.filterLow = filterLow;
  }

  public int getFilterHigh() {
    return filterHigh;
  }

  public void setFilterHigh(int filterHigh) {
    this.filterHigh = filterHigh;
  }

  public int getMode() {
    return mode;
  }

  public void setMode(int mode) {
    this.mode = mode;
    this.setFilterLow(Settings.filterLow[mode]);
    this.setFilterHigh(Settings.filterHigh[mode]);
  }

}

