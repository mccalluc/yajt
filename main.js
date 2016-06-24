var YAJT = {
    timer_callback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.compute_frame();
        var self = this;
        setTimeout(function () {
            self.timer_callback();
        }, 500); // 500 ms: just so the processor isn't running as hot.
    },
    do_load: function (selector) {
        $(selector)
                .append('<video autoplay width="200" height="150">')
                .append('<canvas id="c1" width="200" height="150">')
                .append('<canvas id="c2" width="200" height="150">');
        this.video = $(selector + ' video')[0];
        this.ctx1 = $('#c1')[0].getContext('2d');
        this.ctx2 = $('#c2')[0].getContext('2d');
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
        this.ctx1.drawImage(this.video, 0, 0, 200, 150);
        var frame = this.ctx1.getImageData(0, 0, 200, 150);
        var l = frame.data.length / 4;

        for (var i = 0; i < l; i++) {
//      var r = frame.data[i * 4 + 0];
//      var g = frame.data[i * 4 + 1];
//      var b = frame.data[i * 4 + 2];
//      if (g > 100 && r > 100 && b < 43)
//        frame.data[i * 4 + 3] = 0;
            frame.data[i * 4 + 1] = 0;
        }
        this.ctx2.putImageData(frame, 0, 0);
        return;
    }
};