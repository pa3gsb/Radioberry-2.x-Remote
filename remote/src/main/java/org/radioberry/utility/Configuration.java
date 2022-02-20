package org.radioberry.utility;

public class Configuration {

  public final static int PORT = 1024;
  public final static int fps = 10;

  public final static double samplerate = 48000.0;
  public final static double tx_samplerate = 12000.0;
  public final static double dsprate = 48000.0;
  public final static int buffersize = 1024;
  //public final static int fftsize = 4096;
  public static final int fftsize = 1024;

  public final static boolean NB2 = false;
  public final static boolean NB2_AE = true;
  public final static int NB2_GAIN = 1;     // 0:Linear 1:Log
  public final static int NB2_NPE = 0;      // 0:OSMS 1:MMSE
  public final static int NB2_POSITION = 1; // 0:PRE-AGC 1:POST-AGC

  public final static boolean NR = false;
  public final static boolean NB = false;
  public final static boolean ANF = false;

  public final static float afgain = 1.0F;
  public final static float micgain = 4.0F;

}
