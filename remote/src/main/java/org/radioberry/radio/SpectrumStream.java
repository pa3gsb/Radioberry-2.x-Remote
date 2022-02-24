package org.radioberry.radio;

import org.openhpsdr.dsp.Wdsp;
import org.radioberry.domain.Display;
import org.radioberry.radio.websocket.RadioClients;
import org.radioberry.utility.Configuration;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Timer;
import java.util.TimerTask;

@ApplicationScoped
public class SpectrumStream {

  @Inject
  private RadioClients radioClients;

  TimerTask timerTask;

  private Wdsp wdsp = Wdsp.getInstance();

  private float[] samples = new float[1280];

	public void setTimer() {
		timerTask = new TimerTask() {

			@Override
			public void run() {
				int[] result = new int[1];
				wdsp.GetPixels(Display.RX, 0,  samples, result);
				if (result[0] == 1)
				  try {
            radioClients.spectrumStream(samples);
          } catch (Exception ex) {}
			}
		};

		Timer timer = new Timer("Spectrum Timer");

		timer.scheduleAtFixedRate(timerTask, 2000,
				1000 / Configuration.fps);
	}

  public void terminate() {
	  if (null != timerTask) timerTask.cancel();
  }

}
