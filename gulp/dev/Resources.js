"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");

function Resources() {
  return src(config.resources.src, { allowEmpty: true }).pipe(dest(config.resources.dest));
}
module.exports = { Resources };
