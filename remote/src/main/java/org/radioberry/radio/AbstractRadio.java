package org.radioberry.radio;

import org.openhpsdr.dsp.Wdsp;
import org.radioberry.domain.*;
import org.radioberry.service.audio.LocalAudio;
import org.radioberry.utility.Configuration;
import org.radioberry.utility.Log;

import javax.inject.Inject;
import java.io.File;
import java.util.Date;

public abstract class AbstractRadio implements IRadio {

  @Inject
  SpectrumStream spectrumStream;

  @Inject
  MeterStream meterStream;

  @Inject
  private LocalAudio localAudio;

  Wdsp wdsp = Wdsp.getInstance();

  public AbstractRadio() {
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
    String wisdomDirectory=System.getProperty("user.home") + wdspPath;
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
    wdsp.SetTXAPanelRun(Channel.TX,1);
    wdsp.SetTXAPanelGain1(Channel.TX, 5.0);
    wdsp.SetTXAMode(Channel.TX, Settings.LSB);
    wdsp.SetTXABandpassFreqs(Channel.TX, Settings.filterLow[Settings.LSB], Settings.filterHigh[Settings.LSB]);
    wdsp.SetTXAEQRun(Channel.TX, 1);
    wdsp.SetTXAEQWintype (Channel.TX, 0);
    // equalizer values; i do send 6000 Hz ...
    // without the equalizer...there is to much low in the spectrum... fixed setup.
    double[] freqs = new double[11];
    double[] gains = new double[11];
    freqs[0] = 0.0;
    freqs[1] = 32.0; freqs[2] = 63.0; freqs[3] = 125.0; freqs[4] = 250.0; freqs[5] = 500.0;
    freqs[6] = 1000.0; freqs[7] = 2000.0; freqs[8] = 4000.0; freqs[9] = 8000.0; freqs[10] = 16000.0;
    gains[0] = 0.0;
    gains[1] = -4.0; gains[2] = -3.0; gains[3] = -2.0; gains[4] = 0.0; gains[5] = 7.0;
    gains[6] = 12.0; gains[7] = 12.0; gains[8] = 12.0; gains[9] = 12.0; gains[10] = 12.0;
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

  private byte[] audiooutput = new byte[1024 * 4];
  private int audiooutputindex = 0;

  void setupMicrophoneStream() {
    inlsamples = new float[Configuration.buffersize];
    inrsamples = new float[Configuration.buffersize];
    outlsamples = new float[Configuration.buffersize * 4];
    outrsamples = new float[Configuration.buffersize * 4];

    index = 0;
  }

  @Override
  public void processRadioInputStream(short[] inputStream) {

    for (int i = 0; i < inputStream.length; i++) {

//      // for testing ; see if audio from remote device is audible.
//      short lsample = (short) inputStream[i];
//      short rsample = (short) inputStream[i];
//      audiooutput[audiooutputindex++] = (byte) ((lsample >> 8) & 0xFF);
//      audiooutput[audiooutputindex++] = (byte) (lsample & 0xFF);
//      audiooutput[audiooutputindex++] = (byte) ((rsample >> 8) & 0xFF);
//      audiooutput[audiooutputindex++] = (byte) (rsample & 0xFF);
//      if (audiooutputindex == audiooutput.length) {
//        //localAudio.writeAudio(audiooutput);  // listening local.
//        audiooutputindex = 0;
//      }

      // execute the modulation before further processing
      inlsamples[index] = (float) inputStream[i] / 32767.0F * Configuration.micgain; // convert 16 bit samples to -1.0 .. +1.0
      inrsamples[index++] = (float) inputStream[i] / 32767.0F * Configuration.micgain;
      if (index == inlsamples.length) {
        int[] error = new int[1];
        wdsp.fexchange2(Channel.TX, inlsamples, inrsamples, outlsamples, outrsamples, error);
        if (error[0] != 0) {
          Log.info("processRadioInputStream", "fexchange2 returned " + error[0]);
        }
        handleModulatedTxStream(outlsamples, outrsamples);
        index = 0;
      }
    }
  }

  abstract void handleModulatedTxStream(float[] outlsamples, float[] outrsamples);

}
