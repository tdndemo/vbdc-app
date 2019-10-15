var gulp = require("gulp");
var argv = require("yargs").argv;
var _ = require("lodash");

var path = function () {
    var path = argv.path;
    if (path && !_.endsWith("/")) path += "/";
    return path || "Y:/";
}();

gulp.task("deploy-source", ["build"], function () {
    return gulp.src("./dist/**", { base: "dist" })
        .pipe(gulp.dest(path + "FX/App/"));
});