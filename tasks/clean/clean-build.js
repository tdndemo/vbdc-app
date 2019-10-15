var gulp = require("gulp");
var del = require("del");

gulp.task("clean-build", function () {
    return del("./dist");
});