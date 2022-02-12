package org.radioberry.radio;

import org.openhpsdr.discovery.Discover;
import org.openhpsdr.discovery.Discovered;
import org.openhpsdr.discovery.Discovery;
import org.openhpsdr.protocol.Protocol1_Processor;
import org.radioberry.domain.Radio;
import org.radioberry.utility.Log;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.ArrayList;

@ApplicationScoped
public class Radioberry extends AbstractRadio implements Discover {

  @Inject
  private Protocol1_Processor protocol1Handler;

  private ArrayList<Discovered> discovered = new ArrayList<Discovered>();

  @PostConstruct
  public void afterCreate() {
    System.out.println("Radioberry bean created");
  }

  @Override
  public void start() {
    discovered.clear();
    Discovery discovery = new Discovery(this);
    discovery.startDiscovery();
    if (discovered.size() > 0 ) {
      protocol1Handler.start(discovered.get(0));
      //spectrumStream.setTimer();
      meterStream.setMeterTimer();
    }
  }

  @Override
  public void setRadioSettings(Radio radio) {
    System.out.println("setRadioSettings" + radio.toString());
    setActiveChannel(radio);
    protocol1Handler.setRadioSettings(radio);
  }

  @Override
  void handleModulatedTxStream(float[] outlsamples, float[] outrsamples) {
    protocol1Handler.sendSamples(outlsamples, outrsamples);
  }

  @Override
  public void discovered(Discovered d) {
    Log.info("Radioberry", "Discovered: " + d.toString());
    discovered.add(d);
  }

  @Override
  public void endDiscovery() {
    if (discovered.size() == 0) {
      Log.info("Radioberry", "openHPSDR: No devices found");
      return;
    } else if (discovered.size() == 1) {
    } // 1 gevonden.... dan gaan wij die gebruiken... anders TODO
  }
}
