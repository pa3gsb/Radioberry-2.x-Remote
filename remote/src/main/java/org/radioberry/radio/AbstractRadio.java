package org.radioberry.radio;

import org.openhpsdr.dsp.Wdsp;
import org.radioberry.domain.*;
import org.radioberry.radio.websocket.RadioClients;
import org.radioberry.service.audio.LocalAudio;
import org.radioberry.utility.Configuration;
import org.radioberry.utility.Log;
import org.radioberry.utility.RingBuffer;

import javax.inject.Inject;
import java.io.File;

public abstract class AbstractRadio implements IRadio, IStreamRxIQ {

  @Inject
  SpectrumStream spectrumStream;

  @Inject
  MeterStream meterStream;

  @Inject
  private LocalAudio localAudio;

  @Inject
  RadioClients radioClients;

  Radio radioDomain;

  private RingBuffer<Integer> micSampleRingbuffer = new RingBuffer(9600); //1200 (0.2)

  Wdsp wdsp = Wdsp.getInstance();

  public AbstractRadio() {
    radioDomain = new Radio();
    handleWisdom();
    setupReceiver();
    setupTransmitter();
    setSpectrumAnalyzer();
    setupMicrophoneStream();
  }

  private void handleWisdom() {
    // need to check if wisdom file differs???
    String bits = "x86";
    if (System.getProperty("os.arch") != null && System.getProperty("os.arch").endsWith("64")) {
      bits = "x64";
    }
    String wdspPath = File.separator + ".radioberry" + File.separator + bits + File.separator;
    String wisdomDirectory = System.getProperty("user.home") + wdspPath;
    File file = new File(wisdomDirectory);
    file.mkdirs();

    wdsp.WDSPwisdom(wisdomDirectory);
  }

  void setActiveChannel(Radio radio) {
    if (radio.isTransmit()) {
      wdsp.SetChannelState(Channel.RX, 0, 1);
      wdsp.SetChannelState(Channel.TX, 1, 0);
    } else {
      // stop transmitting
      wdsp.SetChannelState(Channel.TX, 0, 1);
      wdsp.SetChannelState(Channel.RX, 1, 0);
    }
  }

  private void setupReceiver() {
    // setup receiver
    wdsp.OpenChannel(Channel.RX, Configuration.buffersize,
      Configuration.fftsize, (int) Configuration.samplerate,
      (int) Configuration.dsprate, 48000,
      0/* rx */, 1/* RUNNING */, 0.010, 0.025, 0.0, 0.010, 0);

    wdsp.RXASetNC(Channel.RX, 4096);
    wdsp.SetRXAMode(Channel.RX, Settings.LSB);
    wdsp.RXASetPassband(Channel.RX, Settings.filterLow[Settings.LSB], Settings.filterHigh[Settings.LSB]);
    setAGC(Channel.RX, Settings.AGC_SLOW);
    wdsp.SetRXAAGCTop(Channel.RX, 65);
    wdsp.SetRXAAMDSBMode(Channel.RX, 0);

    wdsp.SetRXAEMNRRun(Channel.RX, Configuration.NB2 ? 1 : 0);
    wdsp.SetRXAEMNRgainMethod(Channel.RX, Configuration.NB2_GAIN);
    wdsp.SetRXAEMNRnpeMethod(Channel.RX, Configuration.NB2_NPE);
    wdsp.SetRXAEMNRaeRun(Channel.RX, Configuration.NB2_AE ? 1 : 0);
    wdsp.SetRXAEMNRPosition(Channel.RX, Configuration.NB2_POSITION);
    wdsp.SetRXAANRRun(Channel.RX, Configuration.NR ? 1 : 0);
    wdsp.SetRXAANFRun(Channel.RX, Configuration.ANF ? 1 : 0);
  }

  private void setupTransmitter() {
    // setup transmitter
    Log.info("AbstractRadio", "OpenChannel (TX): buffersize=" + Configuration.buffersize + " fftsize=" + Configuration.fftsize + " samperate=" + Configuration.samplerate + " dsprate=" + Configuration.dsprate);
    wdsp.OpenChannel(Channel.TX, Configuration.buffersize, Configuration.fftsize,
      (int) Configuration.tx_samplerate, (int) Configuration.dsprate, 48000,
      1/*tx*/, 0/*NOT RUNNING*/, 0.010, 0.025, 0.0, 0.010, 0);
    wdsp.TXASetNC(Channel.TX, 1024);
    wdsp.SetTXAPanelRun(Channel.TX, 1);
    wdsp.SetTXAPanelGain1(Channel.TX, 5.0);
    wdsp.SetTXAMode(Channel.TX, Settings.LSB);
    wdsp.SetTXABandpassFreqs(Channel.TX, Settings.filterLow[Settings.LSB], Settings.filterHigh[Settings.LSB]);
    wdsp.SetTXAEQRun(Channel.TX, 1);
    wdsp.SetTXAEQWintype(Channel.TX, 0);
    // equalizer values; i do send 6000 Hz samples / sec
    // without the equalizer...there is to much low in the spectrum... fixed setup.
    double[] freqs = new double[11];
    double[] gains = new double[11];
    freqs[0] = 0.0;
    freqs[1] = 32.0;
    freqs[2] = 63.0;
    freqs[3] = 125.0;
    freqs[4] = 250.0;
    freqs[5] = 500.0;
    freqs[6] = 1000.0;
    freqs[7] = 2000.0;
    freqs[8] = 4000.0;
    freqs[9] = 8000.0;
    freqs[10] = 16000.0;
    gains[0] = 0.0;
    gains[1] = -4.0;
    gains[2] = -3.0;
    gains[3] = -2.0;
    gains[4] = 0.0;
    gains[5] = 7.0;
    gains[6] = 12.0;
    gains[7] = 12.0;
    gains[8] = 12.0;
    gains[9] = 12.0;
    gains[10] = 12.0;
    wdsp.SetTXAEQProfile(Channel.TX, 10, freqs, gains);
  }

  @Override
  public void setDSPSettings(DSP dsp) {

    System.out.println("setDSPSettings" + dsp.toString());

    //rx
    wdsp.SetRXAAGCTop(Channel.RX, dsp.getAgc_gain());
    wdsp.SetRXAMode(Channel.RX, dsp.getMode());
    setAGC(Channel.RX, dsp.getAgc_mode());
    wdsp.RXASetPassband(Channel.RX, dsp.getFilterLow(), dsp.getFilterHigh());
    wdsp.SetRXAShiftFreq(Channel.RX, dsp.getShift());

    //tx
    wdsp.SetTXAMode(Channel.TX, dsp.getMode());
    wdsp.SetTXABandpassFreqs(Channel.TX, dsp.getFilterLow(), dsp.getFilterHigh());
    wdsp.TXASetMP(Channel.TX, 0);
    wdsp.SetTXABandpassWindow(Channel.TX, 1);
  }

  private void setAGC(int channel, int agc) {
    wdsp.SetRXAAGCMode(channel, agc);
    switch (agc) {
      case Settings.AGC_LONG:
        wdsp.SetRXAAGCAttack(channel, 2);
        wdsp.SetRXAAGCHang(channel, 2000);
        wdsp.SetRXAAGCDecay(channel, 2000);
        break;
      case Settings.AGC_SLOW:
        wdsp.SetRXAAGCAttack(channel, 2);
        wdsp.SetRXAAGCHang(channel, 1000);
        wdsp.SetRXAAGCDecay(channel, 500);
        break;
      case Settings.AGC_MEDIUM:
        wdsp.SetRXAAGCAttack(channel, 2);
        wdsp.SetRXAAGCHang(channel, 0);
        wdsp.SetRXAAGCDecay(channel, 250);
        break;
      case Settings.AGC_FAST:
        wdsp.SetRXAAGCAttack(channel, 2);
        wdsp.SetRXAAGCHang(channel, 0);
        wdsp.SetRXAAGCDecay(channel, 50);
        break;
    }
  }

  public void stop() {
    wdsp.DestroyAnalyzer(Display.RX);
    wdsp.SetChannelState(Channel.TX, 0, 0);
    wdsp.CloseChannel(Channel.TX);
    wdsp.SetChannelState(Channel.RX, 0, 0);
    wdsp.CloseChannel(Channel.RX);
  }

  private void setSpectrumAnalyzer() {

    int[] error = new int[1];
    int[] success = new int[1];

    Log.info("Radio", "XCreateAnalyzer; create rx spectrum");

    // rx spectrum
    wdsp.XCreateAnalyzer(Display.RX, success, 262144, 1, 1, "");
    if (success[0] != 0) {
      Log.info("Radio", "XCreateAnalyzer Display.RX failed:" + success[0]);
    }
    int flp[] = {0};
    double KEEP_TIME = 0.1;
    int fft_size = 8192;
    int window_type = 4;
    double tau = 0.001 * 120.0;
    int MAX_AV_FRAMES = 60;
    int display_average = Math.max(2, (int) Math.min((double) MAX_AV_FRAMES, (double) Configuration.fps * tau));
    double avb = Math.exp(-1.0 / (Configuration.fps * tau));
    int calibration_data_set = 0;
    double span_min_freq = 0.0;
    double span_max_freq = 0.0;

    int max_w = fft_size + (int) Math.min(KEEP_TIME * (double) Configuration.fps, KEEP_TIME * (double) fft_size * (double) Configuration.fps);

    wdsp.SetAnalyzer(
      Display.RX, 1, 1, 1, flp, fft_size, Configuration.buffersize,
      window_type, 14.0, 2048, 0, 0, 0, 1280, 1,
      0, 0, 0, max_w
    );
  }

  // radio input stream.
  private float[] inlsamples;
  private float[] inrsamples;
  private int index = 0;

  private float[] outlsamples;
  private float[] outrsamples;

  private float[] outrxlsamples;
  private float[] outrxrsamples;

  private byte[] audiooutput = new byte[1024 * 4];
  private int audiooutputindex = 0;

  void setupMicrophoneStream() {
    inlsamples = new float[Configuration.buffersize];
    inrsamples = new float[Configuration.buffersize];
    outrxlsamples = new float[Configuration.buffersize];
    outrxrsamples = new float[Configuration.buffersize];
    outlsamples = new float[Configuration.buffersize];// * 8 if upsampling
    outrsamples = new float[Configuration.buffersize];// * 8 if upsampling

    index = 0;
  }

//  long time1 = 0;
//  long time2 = 0;
//  long count = 0;

  @Override
  public void processMicrophoneStream(short[] inputStream) {

//    count = count + inputStream.length;
//    if (count >= 6000) {
//      time2 = System.currentTimeMillis();
//      System.out.println("time for  " + count + "  samples = " + Long.valueOf(time2 - time1).toString());
//      time1 = System.currentTimeMillis();
//      count = 0;
//    }

    for (int i = 0; i < inputStream.length; i++) {
      if (micSampleRingbuffer.size() < micSampleRingbuffer.capacity()) {
        try {
          micSampleRingbuffer.add(Integer.valueOf(inputStream[i]));
        } catch (InterruptedException ex) {
        }
      } else System.out.println("mic sample not added");
    }
  }

  //    countiq++;
//    if (countiq >= 48000) {
  long counttx = 0;
  long notadded = 0;

  int txIndex = 0;

  private void processStreamTX() {


    //if (txIndex % 8 == 0) {

    //  txIndex = 0;

    Integer micSample = 0;
    if (micSampleRingbuffer.size() > 0) {
      try {
        micSample = micSampleRingbuffer.remove();
      } catch (InterruptedException ex) {
      }
    } else notadded++;

    counttx++;
    if (counttx >= 48000) {
      System.out.println("#" + notadded + " mic samples not in buffer; adding silence for 48000 samples");
      notadded = 0;
      counttx = 0;
    }

    inlsamples[index] = (float) micSample / 32767.0F * Configuration.micgain; // convert 16 bit samples to -1.0 .. +1.0
    inrsamples[index] = (float) micSample / 32767.0F * Configuration.micgain;
    index++;
    if (index == inlsamples.length) {
      int[] error = new int[1];
      wdsp.fexchange2(Channel.TX, inlsamples, inrsamples, outlsamples, outrsamples, error);
      if (error[0] != 0) {
        Log.info("processStreamTX", "fexchange2 returned " + error[0]);
      }

      handleModulatedTxStream(outlsamples, outrsamples);
      index = 0;
    }
    // }

    //txIndex++;
  }

  abstract void handleModulatedTxStream(float[] outlsamples, float[] outrsamples);

  private final float[] sampleI = new float[Configuration.buffersize];
  private final float[] sampleQ = new float[Configuration.buffersize];
  private Integer iqOffset = 0;

  int rxIndex = 0;
  int audioIndex = 0;

  float[] audioBuffer = new float[2000];


//  long timeiq1 = 0;
//  long timeiq2 = 0;
//  long countiq = 0;


  @Override
  public void processStreamRxIQ(float sampleI, float sampleQ) {

//    countiq++;
//    if (countiq >= 48000) {
//      timeiq2 = System.currentTimeMillis();
//      System.out.println("IQ timing  " + countiq + "  samples = " + Long.valueOf(timeiq2 - timeiq1).toString());
//      timeiq1 = System.currentTimeMillis();
//      countiq = 0;
//    }

    int[] error = new int[1];

    this.sampleI[iqOffset] = sampleI;
    this.sampleQ[iqOffset] = sampleQ;

    if (radioDomain.isReceive()) {
      iqOffset++;
      if (iqOffset == Configuration.buffersize) {

        wdsp.fexchange2(Channel.RX, this.sampleI, this.sampleQ, outrxlsamples, outrxrsamples, error);

        // 48000 samples => 8000 samples ; simple decimation (no filter)
        for (int j = 0; j < Configuration.buffersize; j++) {
          if (rxIndex % 6 == 0) {
            audioBuffer[audioIndex++] = outrxlsamples[j];
            if (audioIndex == 2000) {
              radioClients.audioStream(audioBuffer);
              audioBuffer = new float[2000];
              audioIndex = 0;
            }
          }
          rxIndex++;
        }
        rxIndex = rxIndex % 6;

        iqOffset = 0;

        handleDeModulatedRxStream(outrxlsamples, outrxrsamples);
      }
    } else {
      processStreamTX();
    }
  }

  abstract void handleDeModulatedRxStream(float[] outlsamples, float[] outrsamples);
}
