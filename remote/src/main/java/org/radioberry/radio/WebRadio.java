package org.radioberry.radio;

import org.openhpsdr.dsp.Wdsp;

import javax.annotation.PostConstruct;
import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import java.io.File;
import java.net.URL;

@ApplicationScoped
@Startup
@Default
public class WebRadio {

  Wdsp wdsp = Wdsp.getInstance();

  @Inject
  private IRadio radio;

  @PostConstruct
  public void afterCreate() {
    System.out.println("Web Radio bean created; now start radio...");
    handleWisdom();
    radio.start();
  }

  public IRadio getRadio() {
    return radio;
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

}
