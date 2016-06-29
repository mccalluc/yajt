// Starting from a copy-and-paste of https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode

if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.audio = {
    generate: function (samples) {
        var audio_context = new (window.AudioContext || window.webkitAudioContext)();
        var channels = 1;
        var frame_count = samples.length;

        var buffer = audio_context.createBuffer(channels, frame_count,
                Math.pow(2, YAJT.core.config.tone / 6) * 440 * frame_count);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < frame_count; i++) {
            //data[i] = Math.sin(i * 2* Math.PI/frame_count)
            data[i] = ((samples[i] / YAJT.core.config.height) - 0.5);
        }

        var source = audio_context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audio_context.destination);
        source.start();
        source.stop(YAJT.core.config.timeout / 1000); // Seconds, not ms.
    }
};