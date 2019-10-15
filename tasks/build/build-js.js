var gulp = require("gulp");
var concat = require("gulp-concat");
var gulpif = require("gulp-if");
var sourcemaps = require("gulp-sourcemaps");

var argv = require("yargs").argv;
var merge = require("merge2");

var srcFiles = require("../files/source.js");
var buildTemplate = require("../common/build-template-pipe.js");
var minifyJs = require("../common/minify-js-pipe.js");

var optimize = argv.optimize;

gulp.task("build-js", ["clean-build"], function() {
  var src = merge(gulp.src(srcFiles.js), buildTemplate());

  return (
    src
      // Build .js
      .pipe(sourcemaps.init())
      .pipe(concat("vbdc.js"))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist/js"))

      // Build .min.js
      .pipe(gulpif(optimize, minifyJs()))
  );
});
