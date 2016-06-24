// Began with a copy-and-paste from:
//   http://www.html5rocks.com/en/tutorials/getusermedia/intro/ 
//   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.core = {
    config: {
        selector: '#yajt',
        input_class: 'input',
        output_class: 'output',
        width: 200,
        height: 150,
        timeout: 500, // 0.5 seconds
        transforms: []
    },
    timer_callback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.compute_image_data();
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
        var selector = this.config.selector;
        var input_class = this.config.input_class;
        var output_class = this.config.output_class;

        $(selector)
                .append($('<video autoplay>').attr(w_h).hide())
                .append($('<canvas class="' + input_class + '">').attr(w_h).hide())
                .append($('<canvas class="' + output_class + '">').attr(w_h));
        this.video = $(selector + ' video')[0];
        this.input = $(selector + ' .' + input_class)[0].getContext('2d');
        this.output = $(selector + ' .' + output_class)[0].getContext('2d');

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
        } else if (navigator.webkitGetUserMedia) { // WebKit
            navigator.webkitGetUserMedia(video_obj, function (stream) {
                self.video.src = window.webkitURL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        } else if (navigator.mozGetUserMedia) { // Firefox
            navigator.mozGetUserMedia(video_obj, function (stream) {
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        }

        this.video.addEventListener('play', function () {
            self.timer_callback();
        }, false);
    },
    compute_image_data: function () {
        this.input.drawImage(this.video, 0, 0, this.config.width, this.config.height);
        var image_data = this.input.getImageData(0, 0, this.config.width, this.config.height);
        for (var i = 0; i < this.config.transforms.length; i++) {
            this.config.transforms[i](image_data.data);
        }
        this.output.putImageData(image_data, 0, 0);
        return;
    }
};