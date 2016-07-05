// Starting from a copy-and-paste of https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode

if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.audio = {
    context: null,
    generate: function (samples) {
        if (!YAJT.audio.context) {
            if (window.AudioContext) {
                YAJT.audio.context = new window.AudioContext();
            } else if (window.webkitAudioContext) {
                YAJT.audio.context = new window.webkitAudioContext();
            } else {
                alert("Error: window.AudioContext not supported");
                return;
            }
        }
        
        YAJT.audio.generate_from[YAJT.core.config.mode](samples);
    },
    generate_from: {
        waveform: function(samples) {
            var audio_context = YAJT.audio.context;
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

            if (YAJT.audio.old_source) {
                YAJT.audio.old_source.stop(audio_context.currentTime);
            }
            source.start(audio_context.currentTime);
            YAJT.audio.old_source = source;
        },
        sequence: function(samples) {
            
        },
        spectrum: function(samples) {
            
        }
    }
};