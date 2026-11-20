"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const fileinclude = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");

function HtmlBuild() {
  return src(config.html.src)
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .pipe(rename({ basename: "index" }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest(config.html.dist));
}
module.exports = { HtmlBuild };
