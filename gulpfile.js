var gulp = require("gulp");
var _ = require("lodash");

// Hack...
gulp.dest = function () {
    var dest = gulp.dest;

    return function (path, options) {
        options = _.defaults({}, options, {
            mode: "777"
        });
        return dest.call(gulp, path, options);
    }
}();

require("require-dir")("./tasks", { recurse: true });