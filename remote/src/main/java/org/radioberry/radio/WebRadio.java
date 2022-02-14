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
    radio.start();
  }

  public IRadio getRadio() {
    return radio;
  }

}
