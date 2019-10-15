var gulp = require("gulp");
var concat = require("gulp-concat");
var htmlmin = require("gulp-htmlmin");
var html2js = require("gulp-ng-html2js");
var lazypipe = require("lazypipe");

var srcFiles = require("../files/source.js");

var buildTemplatePipe = lazypipe()
  .pipe(
    gulp.src,
    srcFiles.template
  )
  .pipe(
    htmlmin,
    {
      removeComments: true,
      collapseWhitespace: true
    }
  )
  .pipe(
    html2js,
    {
      declareModule: true,
      prefix: "$app/",
      moduleName: "vbdc-app"
    }
  )
  .pipe(
    concat,
    "d01.template.js"
  );

module.exports = buildTemplatePipe;
