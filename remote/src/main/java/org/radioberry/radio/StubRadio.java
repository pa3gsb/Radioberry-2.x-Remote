package org.radioberry.radio;

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

    frequency = (int) radio.getFrequency();
    int f1 = frequency - vfo;

    System.out.println("vfo = " + vfo + "  frequency tone = " + frequency + " (freq-vf0) f1 =" + f1);
  }

  @Override
  void handleModulatedTxStream(float[] outlsamples, float[] outrsamples) {
    //do nothing..the stub does not handle a tx stream.
  }

  @Override
  void handleDeModulatedRxStream(float[] outlsamples, float[] outrsamples) {
    // no need to do some action; this is a stub; so no actual radio.
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
        for (int i = 0; i < 1024; i ++)  { this.processStreamRxIQ(inlsamples[i], inrsamples[i]); }

        actual = actual + 1024;
      }
    }
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
