package org.radioberry.service.audio;

import org.radioberry.utility.Log;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.SourceDataLine;


@ApplicationScoped
public class LocalAudio {

  private AudioFormat audioformat;
  private SourceDataLine audioline;

  public void initializeLocalAudio() {

    try {
      audioformat = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED,
        48000F, 16, 2, 4, 48000F, true);
      audioline = AudioSystem.getSourceDataLine(audioformat);
      audioline.open(audioformat, 48000);
      audioline.start();
    } catch (Exception e) {
      Log.info("Radioberry", "initializeLocalAudio: " + e.toString());
    }

  }

  @PostConstruct
  void initLocalAudio() {
    System.out.println("Local audio stream bean created");

    initializeLocalAudio();
    if (audioline != null) { Log.info("Radioberry", "local audio initialized"); } else {
      Log.info("Radioberry", "local audio not initialized");
    }
  }

  @PreDestroy
  public void stopLocalAudioOutput() {
    if (audioline != null) {
      audioline.flush();
      audioline.close();
      audioline = null;
    }
  }

  public void writeAudio(byte[] audiooutput) {
    if (audioline != null) {
      int sent = audioline.write(audiooutput,        0, audiooutput.length);
      if (sent != audiooutput.length) {
        Log.info("Radioberry-online",          "write audio returned "
            + sent
            + " when sending "
            + audiooutput.length);
      }
    }
  }

}
