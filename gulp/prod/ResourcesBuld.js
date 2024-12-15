"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");

function ResourcesBuld(cb) {
  return src(config.resources.src).pipe(dest(config.resources.prod)), cb();
}
module.exports = { ResourcesBuld };
