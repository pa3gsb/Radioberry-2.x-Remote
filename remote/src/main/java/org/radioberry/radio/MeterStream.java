package org.radioberry.radio;

import org.openhpsdr.dsp.Wdsp;
import org.radioberry.domain.Channel;
import org.radioberry.radio.websocket.RadioClients;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Timer;
import java.util.TimerTask;

@ApplicationScoped
public class MeterStream {

  @Inject
  private RadioClients radioClients;

  private Wdsp wdsp = Wdsp.getInstance();

  TimerTask timerTask;

  public void setMeterTimer() {

    timerTask = new TimerTask() {

      @Override
      public void run() {
        int signal = (int) wdsp.GetRXAMeter(Channel.RX, Wdsp.S_AV);
        try {
          radioClients.meterStream(signal);
        } catch (Exception ex) {}
      }
    };

    Timer timer = new Timer("S-Meter Timer");

    timer.scheduleAtFixedRate(timerTask, 2000,1000);
  }

  public void terminate() {
    if (null != timerTask) timerTask.cancel();
  }
}
