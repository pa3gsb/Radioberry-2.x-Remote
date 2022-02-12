
function PCMPlayer(option) {
    this.init(option);
}

PCMPlayer.prototype.init = function(option) {
    var defaults = {
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    };
    this.option = Object.assign({}, defaults, option);
    this.samples = new Float32Array();
    this.flush = this.flush.bind(this);
    this.interval = setInterval(this.flush, this.option.flushingTime);
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
};

PCMPlayer.prototype.getMaxValue = function () {
    var encodings = {
        '8bitInt': 128,
        '16bitInt': 32768,
        '32bitInt': 2147483648,
        '32bitFloat': 1
    }

    return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
};

PCMPlayer.prototype.getTypedArray = function () {
    var typedArrays = {
        '8bitInt': Int8Array,
        '16bitInt': Int16Array,
        '32bitInt': Int32Array,
        '32bitFloat': Float32Array
    }

    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
};

var lpfilter;
var hpfilter;

PCMPlayer.prototype.createContext = function()
{
    // create audio context
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create a gain module
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0; //init 0.

    // create a low pass filter
    lpfilter = this.audioCtx.createBiquadFilter();
    lpfilter.type = "lowpass";
    //lpfilter.Q = 10;
    lpfilter.frequency.value = 2400;

    // create a high pass filter
    hpfilter = this.audioCtx.createBiquadFilter();
    hpfilter.type = "highpass";
    //hpfilter.Q = 10;
    hpfilter.frequency.value = 200;

    this.gainNode.connect(hpfilter);
    hpfilter.connect(lpfilter);
    lpfilter.connect(this.audioCtx.destination);

    this.startTime = this.audioCtx.currentTime;
};

PCMPlayer.prototype.setLPfilter = function(v)
{
    if(v <=0 || v == null || v === undefined || v == "null") return;
    //console.log("LP:" + v);
    lpfilter.frequency.value = v;

};

PCMPlayer.prototype.setHPfilter = function(v)
{
    if(v <=0 || v == null || v === undefined || v == "null") return;
    //console.log("HP:" + v);
    hpfilter.frequency.value = v;
};

PCMPlayer.prototype.isTypedArray = function(data) {
    return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
};

PCMPlayer.prototype.feed = function(data)
{
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
};

PCMPlayer.prototype.volume = function(v)
{
    if(v <=0 || v == null || v === undefined || v == "null") return;

    var fraction = parseInt(v) / 100;
    this.gainNode.gain.value = (fraction * fraction);
};

PCMPlayer.prototype.destroy = function()
{
    if (this.interval)
        clearInterval(this.interval);

    this.samples = null;
    this.audioCtx.close();
    this.audioCtx = null;
};

PCMPlayer.prototype.flush = function()
{
    if (!this.samples.length) return;

    var bufferSource = this.audioCtx.createBufferSource(),
        length = this.samples.length / this.option.channels,
        audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate);

    for (var channel = 0; channel < this.option.channels; channel++)
    {
        var audioData = audioBuffer.getChannelData(channel);
        var offset = channel;
        var decrement = 50;

        for (var i = 0; i < length; i++)
        {
            audioData[i] = this.samples[offset];
            offset += this.option.channels;
        }
    }

    if (this.startTime < this.audioCtx.currentTime)
        this.startTime = this.audioCtx.currentTime;

    //console.log('start vs current '+this.startTime+' vs '+this.audioCtx.currentTime+' duration: '+audioBuffer.duration);
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.gainNode);
    bufferSource.start(this.startTime);
    this.startTime += audioBuffer.duration;
    this.samples = new Float32Array();
};
