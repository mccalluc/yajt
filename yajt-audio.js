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
        
        if (YAJT.audio.old_source) {
            YAJT.audio.old_source.stop(YAJT.audio.context.currentTime);
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

            source.start(audio_context.currentTime);
            YAJT.audio.old_source = source;
        },
        sequence: function(samples) {
            
        },
        spectrum: function(samples) {
            var audio_context = YAJT.audio.context;
            var oscillator = audio_context.createOscillator();

            var real = new Float32Array(2);
            var imag = new Float32Array(2);
            real[0] = 0;
            imag[0] = 0;
            real[1] = 1;
            imag[1] = 0;

            var wave = audio_context.createPeriodicWave(real, imag);

            oscillator.setPeriodicWave(wave);
            oscillator.frequency.value = Math.pow(2, YAJT.core.config.tone / 6) * 440;
            oscillator.connect(audio_context.destination);
            oscillator.start(audio_context.currentTime);
            
            YAJT.audio.old_source = oscillator;
        }
    }
};