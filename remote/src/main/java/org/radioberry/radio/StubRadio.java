package org.radioberry.radio;

import org.openhpsdr.protocol.Protocol1_Processor;
import org.radioberry.domain.Channel;
import org.radioberry.domain.Display;
import org.radioberry.domain.Radio;
import org.radioberry.radio.websocket.RadioClients;
import org.radioberry.utility.Configuration;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import javax.inject.Inject;
import java.util.Date;

@ApplicationScoped
@Alternative
public class StubRadio extends AbstractRadio implements Runnable {

  @Inject
  RadioClients radioClients;

  @Inject
  private Protocol1_Processor protocol1Handler; //for stub not required?

  @PostConstruct
  public void afterCreate() {
    System.out.println("StubRadio bean created");
  }

  private final static int SAMPLES = 1024;
  private final static int BANDWIDTH = 48000;
  private final static double TIMESTEP = (1.0 / BANDWIDTH);
  private double timebase = 0.0;
  double amplitude;
  private int vfo = 3629000;
  private int frequency = 3630000;
  private float[] outlsamples;
  private float[] outrsamples;

  private int[] error = new int[1];
  private volatile Thread thread;

  // Local audio output
  private byte[] audiooutput = new byte[1024 * 4]; // 2 channels of shorts
  private int audiooutputindex = 0;

  public StubRadio() {
    outlsamples = new float[Configuration.buffersize];
    outrsamples = new float[Configuration.buffersize];
  }

  public void start() {
    if (thread == null) {
      thread = new Thread(this);
      thread.setPriority(Thread.MAX_PRIORITY);
      thread.start();
    }
    //spectrumStream.setTimer();
    meterStream.setMeterTimer();
  }

  public void stop() {
    thread = null;
  }

  @Override
  public void run() {
    while (thread == Thread.currentThread()) {
      runStubRadio();
    }
  }

  @Override
  public void setRadioSettings(Radio radio) {

    setActiveChannel(radio);
    protocol1Handler.setRadioSettings(radio);

    frequency = (int) radio.getFrequency();
    int f1 = frequency - vfo;

    System.out.println("vfo = " + vfo + "  frequency tone = " + frequency + " (freq-vf0) f1 =" + f1);
  }

  @Override
  void handleModulatedTxStream(float[] outlsamples, float[] outrsamples) {
    //do nothing..the stub does not handle a tx stream.
  }

  private void runStubRadio() {
    float[] inlsamples = new float[SAMPLES];
    float[] inrsamples = new float[SAMPLES];

    int index = 0;
    int amplitudeDB = -73;
    amplitude = 1 / Math.pow(Math.sqrt(10), -(double) amplitudeDB / 10);
    System.out.println("Output generator -73dBm (S9)  = " + amplitude);

    long start = new Date().getTime();
    double actual = 0.0;
    double required = 0.0;

    float[] audioBuffer = new float[2000];
    int audioIndex = 0;

    while (thread == Thread.currentThread()) {
      long now = new Date().getTime();
      required = ((now - start) / 1000.0) * 48000;
      if (actual - required < 0.0) {

        generateTone(inlsamples, inrsamples);

        // DSP demodulation
        wdsp.fexchange2(Channel.RX, inlsamples, inrsamples, outlsamples, outrsamples, error);

        // 48000 samples => 8000 samples ; simple decimation (no filter)
        for (int j = 0; j < Configuration.buffersize; j++) {
          if (index % 6 == 0) {
            audioBuffer[audioIndex++] = outlsamples[j]; //* 32767.0F);
            if (audioIndex == 2000) {
              radioClients.audioStream(audioBuffer);
              audioBuffer = new float[2000];
              audioIndex = 0;
            }
          }
          index++;
        }
        index = index % 6;

       wdsp.Spectrum(Display.RX, 0, 0, convertFloatsToDoubles(inrsamples), convertFloatsToDoubles(inlsamples));

        actual = actual + 1024;
      }
    }
  }

  private double[] convertFloatsToDoubles(float[] input)
  {
    if (input == null)
    {
      return null; // Or throw an exception - your choice
    }
    double[] output = new double[input.length];
    for (int i = 0; i < input.length; i++)
    {
      output[i] = input[i];
    }
    return output;
  }

  private void generateTone(float[] inlsamples, float[] inrsamples) {
    int f1 = (int) frequency - vfo;
    int idx = 0;

    int amplitudeDB = -80;
    float noiseAmplitude = (float) (1 / Math.pow(Math.sqrt(10), -(double) amplitudeDB / 10));

    while (idx < SAMPLES) {
      double angle1 = f1 * 2 * Math.PI * timebase;
      inlsamples[idx] = noiseAmplitude * (2 * (float) Math.random() - 1);
      inrsamples[idx] = noiseAmplitude * (2 * (float) Math.random() - 1);
      inlsamples[idx] += (float) (((float) Math.sin(angle1) * amplitude));
      inrsamples[idx] += (float) (((float) Math.cos(angle1) * amplitude));
      idx++;
      timebase += TIMESTEP;
    }
  }
}

// End of source.
