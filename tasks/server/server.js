var gulp = require("gulp");
var livereload = require("gulp-livereload");
var _ = require("lodash");

var srcFiles = require("../files/source.js");

gulp.task("server", ["deploy"], function () {
    livereload.listen();

    var files = _.values(srcFiles);
    return gulp.watch(files, ["deploy"]);
});