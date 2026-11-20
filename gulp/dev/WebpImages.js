"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const cwebp = require("gulp-cwebp");

function WebpImages() {
  return src(config.images.src, { encoding: false, allowEmpty: true })
    .pipe(cwebp())
    .pipe(dest(config.images.dest));
}
module.exports = { WebpImages };
