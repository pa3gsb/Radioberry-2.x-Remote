package org.radioberry.service.resource;

import org.radioberry.domain.DSP;
import org.radioberry.domain.Radio;
import org.radioberry.radio.WebRadio;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/sdr")
public class RadioResource {

  @Inject
  private WebRadio webRadio;

  @Path("/radio")
  @POST
  @Consumes({MediaType.APPLICATION_JSON})
  public Response setRadioSettings(Radio radio) {
    webRadio.getRadio().setRadioSettings(radio);
    return Response.ok().build();
  }

  @Path("/dsp")
  @POST
  @Consumes({MediaType.APPLICATION_JSON})
  public Response setDSPSettings(DSP dsp) {
    webRadio.getRadio().setDSPSettings(dsp);
    return Response.ok().build();
  }
}
