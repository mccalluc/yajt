var YAJT = {
    config: {
        selector: '#yajt',
        width: 200,
        height: 150,
        timeout: 500 // 0.5 seconds
    },
    timer_callback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.compute_frame();
        var self = this;
        setTimeout(function () {
            self.timer_callback();
        }, this.config.timeout);
    },
    init: function (options) {
        for (var key in options) {
            this.config[key] = options[key];
        }
        var w_h = {
            width: this.config.width,
            height: this.config.height
        };
        $(this.config.selector)
                .append($('<video autoplay>').attr(w_h).hide())
                .append($('<canvas class="input">').attr(w_h).hide())
                .append('<canvas class="output">').attr(w_h);
        this.video = $(this.config.selector + ' video')[0];
        this.input = $(this.config.selector + ' .input')[0].getContext('2d');
        this.output = $(this.config.selector + ' .output')[0].getContext('2d');
        var self = this;

        var video_obj = {'video': true},
        error_handler = function (error) {
            console.log('Video capture error: ', error.code);
        };

        if (navigator.getUserMedia) { // Standard
            navigator.getUserMedia(video_obj, function (stream) {
                self.video.src = stream;
                self.video.play();
            }, error_handler);
        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(video_obj, function (stream) {
                self.video.src = window.webkitURL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(video_obj, function (stream) {
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        }

        this.video.addEventListener('play', function () {
            self.timer_callback();
        }, false);
    },
    compute_frame: function () {
        this.input.drawImage(this.video, 0, 0, this.config.width, this.config.height);
        var frame = this.input.getImageData(0, 0, this.config.width, this.config.height);
        var l = frame.data.length / 4;

        for (var i = 0; i < l; i++) {
//      var r = frame.data[i * 4 + 0];
//      var g = frame.data[i * 4 + 1];
//      var b = frame.data[i * 4 + 2];
//      if (g > 100 && r > 100 && b < 43)
//        frame.data[i * 4 + 3] = 0;
            frame.data[i * 4 + 1] = 0;
        }
        this.output.putImageData(frame, 0, 0);
        return;
    }
};