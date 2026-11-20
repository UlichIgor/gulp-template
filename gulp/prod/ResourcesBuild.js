"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");

function ResourcesBuild() {
  return src(config.resources.src, { allowEmpty: true }).pipe(dest(config.resources.prod));
}
module.exports = { ResourcesBuild };
