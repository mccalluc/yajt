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
            var chunks = 16;
            var sub_samples_a = new Float32Array(chunks);
            var sub_samples_b = new Float32Array(chunks);
            sub_samples_a[0] = 0;
            sub_samples_b[0] = 0;
            for (var i = 1; i < chunks; i++) {
                var sub_sample_length = Math.floor(samples.length / chunks);
                var start = (i-1) * sub_sample_length;
                var end = i * sub_sample_length;
                var sum = 0;
                $.each(samples.slice(start, end), function(i, el) {sum += el;} );
                sub_samples_a[i] = sum / sub_sample_length;
                sub_samples_b[i] = 0;
            }

            var audio_context = YAJT.audio.context;
            var oscillator = audio_context.createOscillator();
            var wave = audio_context.createPeriodicWave(sub_samples_a, sub_samples_b);

            oscillator.setPeriodicWave(wave);
            oscillator.frequency.value = Math.pow(2, YAJT.core.config.tone / 6) * 440;
            oscillator.connect(audio_context.destination);
            oscillator.start(audio_context.currentTime);
            
            YAJT.audio.old_source = oscillator;
        }
    }
};