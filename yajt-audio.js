// Starting from a copy-and-paste of https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode

if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.audio = {
    generate: function (samples) {
        var audio_context = new (window.AudioContext || window.webkitAudioContext)();
        var channels = 1;
        var frameCount = samples.length;

        var buffer = audio_context.createBuffer(channels, frameCount, audio_context.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < frameCount; i++) {
            data[i] = ((samples[i] / YAJT.core.config.height) - 0.5) * 2;
        }

        var source = audio_context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audio_context.destination);
        source.start();
        source.stop(YAJT.core.config.timeout);
    }
};