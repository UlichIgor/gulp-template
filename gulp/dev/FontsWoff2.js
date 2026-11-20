"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const ttf2woff2 = require("gulp-ttf2woff2");

function FontsWoff2() {
  return src(config.fonts.src, { encoding: false, allowEmpty: true })
    .pipe(ttf2woff2())
    .pipe(dest(config.fonts.dest));
}
module.exports = { FontsWoff2 };
