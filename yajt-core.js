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
        transforms: [],
        threshold: 32,
        tone: 0
    },
    timer_callback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        var image_data = this.compute_image_data();
        var reduction = YAJT.dimension_reduction.from_top(image_data);
        this.draw_graph(reduction);
        YAJT.audio.generate(reduction);

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
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        } else if (navigator.mozGetUserMedia) { // Firefox
            navigator.mozGetUserMedia(video_obj, function (stream) {
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, error_handler);
        } else {
            alert('Error: navigator.getUserMedia not supported');
            return;
        }

        this.video.addEventListener('play', function () {
            self.timer_callback();
        }, false);
    },
    compute_image_data: function () {
        this.input.drawImage(this.video, 0, 0, this.config.width, this.config.height);
        var image_data = this.input.getImageData(0, 0, this.config.width, this.config.height);
        var transforms = this.config.transforms;
        for (var i = 0; i < transforms.length; i++) {
            transforms[i](image_data.data);
        }
        this.output.putImageData(image_data, 0, 0);
        return image_data.data;
    },
    draw_graph: function(array) {
        this.output.strokeStyle = '#F00';
        this.output.lineWidth = 3;
        this.output.beginPath();
        this.output.moveTo(2, array[0]);
        for (var i = 0; i < array.length; i++) {
            this.output.lineTo(i+2, array[i]);
        }
        this.output.stroke();
    }
};