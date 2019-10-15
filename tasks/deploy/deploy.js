var gulp = require("gulp");
var livereload = require("gulp-livereload");

gulp.task("deploy", ["deploy-source"], function () {
    return gulp.src("./gulpfile.js").pipe(livereload());
});