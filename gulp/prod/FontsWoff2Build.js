"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const ttf2woff2 = require("gulp-ttf2woff2");

function FontsWoff2Build() {
  return src(config.fonts.src, { encoding: false, allowEmpty: true })
    .pipe(ttf2woff2())
    .pipe(dest(config.fonts.dist));
}
module.exports = { FontsWoff2Build };
