if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.image_transforms = {
    grayscale: function (data) {
        var l = data.length / 4;
        for (var i = 0; i < l; i++) {
            var brightness = ( data[i * 4 + 0] + data[i * 4 + 1] + data[i * 4 + 2] ) / 3;
            data[i * 4 + 0] = brightness;
            data[i * 4 + 1] = brightness;
            data[i * 4 + 2] = brightness;
        }
    }
};