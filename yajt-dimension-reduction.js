if (typeof YAJT === 'undefined') {
    YAJT = {};
}

YAJT.dimension_reduction = {
    from_top: function(data) {
        var output = [];
        var get = YAJT.dimension_reduction._get;
        // Assumes grayscale, so we only need to look at the first byte.
        for (var x = 1; x < YAJT.core.config.width - 1; x++) {
            for (var y = 1; y < YAJT.core.config.height - 1 && get(data, x, y) < YAJT.core.config.threshold; y++) {}
            output.push(y);
        }
        return output;
    },
    _get: function (data, x, y) {
        return data[(x + y * YAJT.core.config.width) * 4];
    }
};