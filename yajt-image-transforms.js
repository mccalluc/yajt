if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.image_transforms = {
    grayscale: function (data) {
        var l = data.length / 4;
        for (var i = 0; i < l; i++) {
            var brightness = (data[i * 4 + 0] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
            data[i * 4 + 0] = brightness;
            data[i * 4 + 1] = brightness;
            data[i * 4 + 2] = brightness;
        }
    },
    black_and_white: function (data) {
        var l = data.length / 4;
        for (var i = 0; i < l; i++) {
            var brightness = (data[i * 4] > 128) ? 256 : 0;
            data[i * 4 + 0] = brightness;
            data[i * 4 + 1] = brightness;
            data[i * 4 + 2] = brightness;
        }
    },
    edge_detection: function (data) {
        // Assumes grayscale has already been applied, 
        // and we can just look at the first byte of each four.
        var get = YAJT.image_transforms._get;
        var scratch = (new Uint8ClampedArray(data.length)).fill(255);
        // Most importantly, set the alpha channel, so we actually see the result
        for (var x = 1; x < YAJT.core.config.width; x++) {
            for (var y = 1; y < YAJT.core.config.height; y++) {
                var value =
                        (get(data, x - 1, y - 1) + get(data, x, y - 1) + get(data, x + 1, y - 1)) -
                        (get(data, x - 1, y + 1) + get(data, x, y + 1) + get(data, x + 1, y + 1));
                var index = (x + y * YAJT.core.config.width) * 4;
                scratch[index] = value;
                scratch[index + 1] = value;
                scratch[index + 2] = value;
            }
        }
        data.set(scratch);
    },
    _get: function (data, x, y) {
        return data[(x + y * YAJT.core.config.width) * 4];
    }
};