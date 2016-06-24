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
    do_load: function () {
        this.video = $("#video")[0];
        this.c1 = $("#c1")[0];
        this.ctx1 = this.c1.getContext("2d");
        this.c2 = $("#c2")[0];
        this.ctx2 = this.c2.getContext("2d");
        var self = this;

        var video = document.getElementById("video"),
                videoObj = {"video": true},
        error_handler = function (error) {
            console.log("Video capture error: ", error.code);
        };

        if (navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function (stream) {
                video.src = stream;
                video.play();
            }, error_handler);
        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function (stream) {
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
            }, error_handler);
        } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(videoObj, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, error_handler);
        }


        this.video.addEventListener("play", function () {
            self.width = self.video.videoWidth / 2;
            self.height = self.video.videoHeight / 2;
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

$(function() {
   YAJT.do_load(); 
});