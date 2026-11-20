"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const fileinclude = require("gulp-file-include");
const rename = require("gulp-rename");
const gulpHtmlBemValidator = require("gulp-html-bem-validator");

function Html() {
  return src(config.html.src)
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .pipe(rename({ basename: "index" }))
    .pipe(gulpHtmlBemValidator())
    .pipe(dest(config.html.dest));
}
module.exports = { Html };
