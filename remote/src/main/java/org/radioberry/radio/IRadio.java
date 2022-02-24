package org.radioberry.radio;

import org.radioberry.domain.DSP;
import org.radioberry.domain.Radio;

public interface IRadio {

  void start();

  void setRadioSettings(Radio radio);

  void setDSPSettings(DSP dsp);

  void processMicrophoneStream(short[] inputStream);

}
