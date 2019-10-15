var gulp = require("gulp");
var filter = require("gulp-filter");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var lazypipe = require("lazypipe");

var minifyJs = lazypipe()
    .pipe(filter, "**/*.js")
    .pipe(sourcemaps.init, { loadMaps: true })
    .pipe(rename, { extname: ".min.js" })
    .pipe(uglify)
    .pipe(sourcemaps.write, "./")
    .pipe(gulp.dest, "./dist/js");

module.exports = minifyJs;