/** Declare a context for AudioContext object */
let audioContext;

let isFirtsClick = true;
let listeing = false;

// Creating a list of colors for led
const ledColor = [
  "#064dac",
  "#064dac",
  "#064dac",
  "#06ac5b",
  "#15ac06",
  "#4bac06",
  "#80ac06",
  "#acaa06",
  "#ac8b06",
  "#ac5506",
]

/**
 * This method updates leds depending the volume detected
 *
 * @param {Float} vol value of volume detected from microphone
 */
function leds(vol) {
  let leds = [...document.getElementsByClassName('led')]
  let range = leds.slice(0, Math.round(vol))

  for (var i = 0; i < leds.length; i++) {
    leds[i].style.boxShadow = "-2px -2px 4px 0px #a7a7a73d, 2px 2px 4px 0px #0a0a0e5e";
    leds[i].style.height = "25px"
  }

  for (var i = 0; i < range.length; i++) {
    range[i].style.boxShadow = `5px 2px 5px 0px #0a0a0e5e inset, -2px -2px 1px 0px #a7a7a73d inset, -2px -2px 30px 0px ${ledColor[i]} inset`;
    range[i].style.height = "25px"
  }
}

function onMicrophoneDenied() {
  console.log('Acces to microphone denied.')
}

/**
 * Method used to create a comunication between
 * AudioWorkletNode, Microphone and AudioWorkletProcessor
 *
 * @param {MediaStream} stream
 * If user grant access to microphone, this gives you
 * a MediaStream object necessary in this implementation
 */
async function onMicrophoneGranted(stream) {

  if (isFirtsClick) {
    // Initialize AudioContext object
    audioContext = new AudioContext()
    // Adding an AudioWorkletProcessor from another script with addModule method
    await audioContext.audioWorklet.addModule('.\\assets\\js-libs\\WebAudio\\vumeter-processor.js')
    // Creating a MediaStreamSource object and sending a MediaStream object granted by the user
    let microphone = audioContext.createMediaStreamSource(stream)
    // Creating AudioWorkletNode sending context and name of processor registered in vumeter-processor.js
    const node = new AudioWorkletNode(audioContext, 'vumeter')

    // Listing any message from AudioWorkletProcessor in its process method here where you can know the volume level
    node.port.onmessage  = event => {
      let _volume = 0;
      let _sensibility = 1;     // Just to add any sensibility to our ecuation
      if (event.data.volume)
        _volume = event.data.volume;
      leds((_volume * 100) / _sensibility)
    }
    // Now this is the way to connect our microphone to the AudioWorkletNode and output from audioContext
    microphone.connect(node).connect(audioContext.destination)

    isFirtsClick = false
  }

  // Just to know if button is on or off and stop or resume the microphone listening
  let audioButton = document.getElementsByClassName('audio-control')[0];
  if (listeing) {
    audioContext.suspend();
    audioButton.style.boxShadow = "-2px -2px 4px 0px #a7a7a73d, 2px 2px 4px 0px #0a0a0e5e";
    audioButton.style.fontSize = "25px";
  } else {
    audioContext.resume();
    audioButton.style.boxShadow = "5px 2px 5px 0px #0a0a0e5e inset, -2px -2px 1px 0px #a7a7a73d inset";
    audioButton.style.fontSize = "24px";
  }
  listeing = !listeing;
}

function activeSound () {
  try {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia(
      { audio: true, video: false },
      onMicrophoneGranted,
      onMicrophoneDenied
    );
  } catch(e) {
    alert(e)
  }
}
